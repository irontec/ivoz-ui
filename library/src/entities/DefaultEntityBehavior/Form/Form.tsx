import { Alert, AlertTitle } from '@mui/material';
import { FormikHelpers } from 'formik';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { PathMatch } from 'react-router-dom';
import { useStoreState } from 'store';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { getMarshallerWhiteList } from '../../../components/form.helper';
import SaveButton from '../../../components/shared/Button/SaveButton';
import ErrorMessage from '../../../components/shared/ErrorMessage';
import { FilterValuesType } from '../../../router/routeMapParser';
import {
  collectReferences,
  DropdownChoices,
  EmbeddableProperty,
  findMatchingColumns,
  ScalarEntityValue,
  useFormikType,
} from '../../../services';
import EntityService, {
  EntityValues,
} from '../../../services/entity/EntityService';
import FormFieldFactory from '../../../services/form/FormFieldFactory';
import _ from '../../../services/translations/translate';
import {
  StyledGroupGrid,
  StyledGroupLegend,
} from '../../DefaultEntityBehavior.styles';
import EntityInterface, { ForeignKeyGetterType } from '../../EntityInterface';
import useFkChoices from '../../data/useFkChoices';
import filterFieldsetGroups, {
  FieldsetGroups,
  FieldsetGroupsField,
  isDetailedFormFieldSpec,
} from '../FilterFieldsetGroups';
import FormFieldMemo from './FormField';
import { useFormHandler } from './useFormHandler';
import { validationErrosToJsxErrorList } from './validationErrosToJsxErrorList';
import { ConfirmEditionDialog } from '../../../components/shared/ConfirmEditDialog';

export type FormOnChangeEvent = React.ChangeEvent<{ name: string; value: any }>;
export type PropertyFkChoices = DropdownChoices;
export type NullablePropertyFkChoices = null | PropertyFkChoices;

export type FkChoices = {
  [key: string]: NullablePropertyFkChoices;
};

export type ReadOnlyProperties = { [attribute: string]: boolean };

export interface FormProps {
  formik?: useFormikType;
  create?: boolean;
  edit?: boolean;
  entityService: EntityService;
  groups?: Array<FieldsetGroups | false>;
  fkChoices?: FkChoices;
  readOnlyProperties?: ReadOnlyProperties;
  row?: EntityValues;
  match: PathMatch;
  fixedValues?: Record<string, ScalarEntityValue>;
  filterValues?: FilterValuesType;
  filterBy?: string | undefined;
  initialValues: EntityValues;
  onSubmit: (
    values: EntityValues,
    imperativeMethods: FormikHelpers<EntityValues>
  ) => Promise<void>;
}

export type EntityFormProps = FormProps &
  Pick<
    EntityInterface,
    | 'validator'
    | 'foreignKeyGetter'
    | 'properties'
    | 'marshaller'
    | 'unmarshaller'
  >;
export type EntityFormType = (props: EntityFormProps) => JSX.Element | null;

const Form: EntityFormType = (props) => {
  const {
    entityService,
    readOnlyProperties,
    filterBy,
    fixedValues,
    filterValues,
    foreignKeyGetter: foreignKeyGetterLoader,
    row,
    match,
    edit,
  } = props;

  const { fkChoices } = props;
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const editDoubleCheck = !edit
    ? false
    : props.entityService.getEntity().editDoubleCheck;
  const [formEvent, setFormEvent] = useState<
    FormEvent<HTMLFormElement> | undefined
  >(undefined);
  const [foreignKeyGetter, setForeignKeyGetter] = useState<
    ForeignKeyGetterType | undefined
  >();

  useEffect(() => {
    if (fkChoices) {
      return;
    }

    if (foreignKeyGetter) {
      return;
    }

    foreignKeyGetterLoader().then((fkGetter) => {
      setForeignKeyGetter(() => fkGetter);
    });
  }, [fkChoices, foreignKeyGetter]);

  const autoloadedFkChoices = useFkChoices({
    disabled: fkChoices !== undefined || foreignKeyGetter === undefined,
    foreignKeyGetter: foreignKeyGetter as ForeignKeyGetterType,
    entityService,
    row,
    match,
  });

  const formik = props.formik || useFormHandler(props);
  const reqError = useStoreState((store) => store.api.errorMsg);

  const allProperties = entityService.getAllProperties();
  const columns = entityService.getProperties();
  const columnNames = Object.keys(columns);

  const inverseRelations = collectReferences(columns);
  const inverseRelationsMatch = findMatchingColumns(
    columnNames,
    inverseRelations
  );
  let totalEntitiesUsed = 0;
  inverseRelationsMatch.forEach((value) => {
    if (Array.isArray(row?.[value])) {
      totalEntitiesUsed = (row?.[value] as string[]).length + totalEntitiesUsed;
    }
  });

  let groups: Array<FieldsetGroups> = [];
  if (props.groups) {
    groups = filterFieldsetGroups(props.groups);
  } else {
    groups.push({
      legend: '',
      fields: columnNames,
    });
  }

  const fieldRows = groups.map((group: FieldsetGroups) => {
    const fields = group.fields as FieldsetGroupsField[];
    return fields.map((fld) => {
      return isDetailedFormFieldSpec(fld) ? fld.name : fld;
    });
  });
  const fields: string[] = [];
  fieldRows.reduce((accumulator, currentValue) => {
    accumulator.push(...currentValue);
    for (const fld of currentValue) {
      const segments = fld.split('.');
      if (segments.length < 2) {
        continue;
      }

      if (accumulator.includes(segments[0])) {
        continue;
      }

      accumulator.push(segments[0]);
    }
    return accumulator;
  }, fields);

  const mlSubproperties: string[] = [];
  for (const fld of fields) {
    if ((allProperties[fld] as EmbeddableProperty)?.multilang) {
      for (const propertyName in allProperties) {
        if (propertyName.indexOf(`${fld}.`) === 0) {
          mlSubproperties.push(propertyName);
        }
      }
    }
  }

  fields.push(...mlSubproperties);
  const visualToggles = entityService.getVisualToggles(formik.values);
  const visibleFields = fields.filter(
    (fldName) => visualToggles[fldName] || false
  );

  const whitelist = getMarshallerWhiteList({
    filterBy,
    fixedValues,
    filterValues,
  });
  visibleFields.push(...whitelist);

  formik.visibleFields = visibleFields;
  const errorList = validationErrosToJsxErrorList(formik, allProperties);
  const divRef = useRef<HTMLDivElement>(null);

  const entity = entityService.getEntity();
  const iden = row ? entity.toStr(row) : '';

  const focusOnDiv = () => {
    const node = divRef.current;
    node?.focus();
  };

  const formFieldFactory = new FormFieldFactory(
    entityService,
    formik,
    formik.handleChange,
    formik.handleBlur,
    divRef
  );

  const confirmEditionText = (): JSX.Element => {
    if (totalEntitiesUsed) {
      return (
        <span>
          {_(`You are about to update`)} <strong>{iden}</strong>
          <br />
          {_(`This change will affect`)} <strong>{totalEntitiesUsed}</strong>{' '}
          {_(`entities`)}
        </span>
      );
    }

    return (
      <span>
        {_(`You are about to update`)} <strong>{iden}</strong>
      </span>
    );
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (formik.isSubmitting) {
            return;
          }

          if (editDoubleCheck) {
            setFormEvent(e);
            setShowConfirm(true);
            return;
          }

          formik.handleSubmit(e);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
      >
        {groups.map((group, idx: number) => {
          const fields = group.fields as Array<FieldsetGroupsField>;
          const visible = fields.reduce(
            (acc: boolean, fld: FieldsetGroupsField) => {
              const fldName = typeof fld === 'string' ? fld : fld.name;

              return acc || visualToggles[fldName];
            },
            false
          );

          if (!visible) {
            return null;
          }

          const visibilityStyles = visible
            ? { display: 'block' }
            : { display: 'none' };

          focusOnDiv();
          return (
            <div
              key={idx}
              ref={divRef}
              style={{ ...visibilityStyles, position: 'relative' }}
            >
              <StyledGroupLegend>{group.legend}</StyledGroupLegend>
              <StyledGroupGrid>
                {fields.map((column: FieldsetGroupsField, idx: number) => {
                  const fldName =
                    typeof column === 'string' ? column : column.name;

                  if (fldName === filterBy) {
                    return null;
                  }

                  return (
                    <ErrorBoundary key={idx} minimalist={true}>
                      <FormFieldMemo
                        column={column}
                        fkChoices={fkChoices || autoloadedFkChoices}
                        visualToggles={visualToggles}
                        readOnlyProperties={readOnlyProperties}
                        formFieldFactory={formFieldFactory}
                      />
                    </ErrorBoundary>
                  );
                })}
              </StyledGroupGrid>
            </div>
          );
        })}

        {Object.keys(errorList).length > 0 && (
          <>
            <br />
            <Alert severity='error'>
              <AlertTitle>{_('Validation error')}</AlertTitle>
              <ul>{Object.values(errorList).map((error) => error)}</ul>
            </Alert>
            <br />
          </>
        )}

        <SaveButton />
        {reqError && <ErrorMessage message={reqError} />}
      </form>
      <ConfirmEditionDialog
        text={confirmEditionText()}
        open={showConfirm}
        handleClose={() => setShowConfirm(false)}
        formEvent={formEvent}
        handleSave={(e) => formik.handleSubmit(e)}
      />
    </div>
  );
};

export { Form };

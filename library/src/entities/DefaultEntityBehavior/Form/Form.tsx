import { Alert, AlertTitle } from '@mui/material';
import { PathMatch } from 'react-router-dom';
import { useStoreState } from 'store';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { getMarshallerWhiteList } from '../../../components/form.helper';
import SaveButton from '../../../components/shared/Button/SaveButton';
import ErrorMessage from '../../../components/shared/ErrorMessage';
import { FilterValuesType } from '../../../router/routeMapParser';
import {
  DropdownChoices,
  EmbeddableProperty,
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
import EntityInterface from '../../EntityInterface';
import filterFieldsetGroups, {
  FieldsetGroups,
  FieldsetGroupsField,
  isDetailedFormFieldSpec,
} from '../FilterFieldsetGroups';
import FormFieldMemo from './FormField';
import { useFormHandler } from './useFormHandler';
import { validationErrosToJsxErrorList } from './validationErrosToJsxErrorList';
import { FormikHelpers } from 'formik';

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
    fkChoices,
    filterBy,
    fixedValues,
    filterValues,
  } = props;

  const formik = props.formik || useFormHandler(props);
  const reqError = useStoreState((store) => store.api.errorMsg);

  const allProperties = entityService.getAllProperties();
  const columns = entityService.getProperties();
  const columnNames = Object.keys(columns);

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

  const formFieldFactory = new FormFieldFactory(
    entityService,
    formik,
    formik.handleChange,
    formik.handleBlur
  );

  return (
    <div>
      <form
        onSubmit={(e) => {
          if (formik.isSubmitting) {
            e.preventDefault();
            e.stopPropagation();
            return false;
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

          return (
            <div key={idx} style={visibilityStyles}>
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
                        fkChoices={fkChoices}
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
    </div>
  );
};

export { Form };

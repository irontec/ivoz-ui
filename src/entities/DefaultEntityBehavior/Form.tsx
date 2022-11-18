import * as React from 'react';
import EntityService, {
  EntityValues,
} from '../../services/entity/EntityService';
import FormFieldFactory from '../../services/form/FormFieldFactory';
import { useFormikType } from '../../services/form/types';
import { Alert, AlertTitle } from '@mui/material';
import {
  StyledGroupLegend,
  StyledGroupGrid,
} from '../DefaultEntityBehavior.styles';
import _ from '../../services/translations/translate';
import { PathMatch } from 'react-router-dom';
import EntityInterface from '../EntityInterface';
import filterFieldsetGroups, {
  FieldsetGroups,
  FieldsetGroupsField,
} from './FilterFieldsetGroups';
import FormFieldMemo from './FormField';

export type FormOnChangeEvent = React.ChangeEvent<{ name: string; value: any }>;

export type PropertyFkChoices = {
  [key: string]: string | React.ReactElement<any>;
};

export type NullablePropertyFkChoices = null | PropertyFkChoices;

export type FkChoices = {
  [key: string]: NullablePropertyFkChoices;
};

export type ReadOnlyProperties = { [attribute: string]: boolean };

export type EntityFormProps = EntityInterface & {
  create?: boolean;
  edit?: boolean;
  entityService: EntityService;
  formik: useFormikType;
  groups?: Array<FieldsetGroups | false>;
  fkChoices?: FkChoices;
  readOnlyProperties?: ReadOnlyProperties;
  validationErrors: Record<string, JSX.Element>;
  row?: EntityValues;
  match: PathMatch;
  filterBy?: string | undefined;
};

export type EntityFormType = (props: EntityFormProps) => JSX.Element;
const Form: EntityFormType = (props) => {
  const {
    entityService,
    formik,
    readOnlyProperties,
    validationErrors,
    fkChoices,
    filterBy,
  } = props;

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

  const visualToggles = entityService.getVisualToggles(formik.values);

  const formFieldFactory = new FormFieldFactory(
    entityService,
    formik,
    formik.handleChange,
    formik.handleBlur
  );

  return (
    <React.Fragment>
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
                  <FormFieldMemo
                    key={idx}
                    column={column}
                    fkChoices={fkChoices}
                    visualToggles={visualToggles}
                    readOnlyProperties={readOnlyProperties}
                    formFieldFactory={formFieldFactory}
                  />
                );
              })}
            </StyledGroupGrid>
          </div>
        );
      })}

      {Object.keys(validationErrors).length > 0 && (
        <>
          <br />
          <Alert severity='error'>
            <AlertTitle>{_('Validation error')}</AlertTitle>
            <ul>{Object.values(validationErrors).map((error) => error)}</ul>
          </Alert>
          <br />
        </>
      )}
    </React.Fragment>
  );
};

export default Form;

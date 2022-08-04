import React from 'react';
import { Grid } from '@mui/material';
import { VisualToggleStates } from '../../services/entity/EntityService';
import FormFieldFactory from '../../services/form/FormFieldFactory';
import _ from '../../services/translations/translate';
import {
  FkChoices,
  ReadOnlyProperties,
  NullablePropertyFkChoices,
} from './Form';
import {
  FieldsetGroupsField,
  isDetailedFormFieldSpec,
} from './FilterFieldsetGroups';

export type EntityFormFieldProps = {
  column: FieldsetGroupsField;
  fkChoices?: FkChoices;
  visualToggles: VisualToggleStates;
  readOnlyProperties?: ReadOnlyProperties;
  formFieldFactory: FormFieldFactory;
};

export type EntityFormFieldType = (
  props: EntityFormFieldProps
) => JSX.Element | null;
export const FormField: EntityFormFieldType = (props) => {
  const {
    column,
    fkChoices,
    visualToggles,
    readOnlyProperties,
    formFieldFactory,
  } = props;

  const columnName = typeof column === 'string' ? column : column.name;

  const choices: NullablePropertyFkChoices = fkChoices
    ? fkChoices[columnName]
    : null;

  if (!visualToggles[columnName]) {
    return null;
  }

  const visibilityStyles = visualToggles[columnName]
    ? { display: 'block' }
    : { display: 'none' };

  const readOnly =
    readOnlyProperties && readOnlyProperties[columnName] ? true : false;

  const defaultSizes = {
    xs: 12,
    md: 6,
    lg: 4,
    xl: 3,
  };

  const sizes = isDetailedFormFieldSpec(column)
    ? { ...defaultSizes, ...column.size }
    : defaultSizes;

  return (
    <Grid item {...sizes} style={visibilityStyles}>
      {formFieldFactory.getFormField(columnName, choices, readOnly)}
    </Grid>
  );
};

const FormFieldMemo = React.memo(
  FormField,
  (prev: EntityFormFieldProps, next: EntityFormFieldProps): boolean => {
    const columnSpec = prev.column;
    const columnName = isDetailedFormFieldSpec(columnSpec)
      ? columnSpec.name
      : columnSpec;

    const nextColumnSpec = next.column;
    const nextColumnName = isDetailedFormFieldSpec(nextColumnSpec)
      ? nextColumnSpec.name
      : nextColumnSpec;

    const column = prev.formFieldFactory.getProperty(columnName);

    if (column.memoize === false) {
      return false;
    }

    const prevFkChoices = prev.fkChoices ? prev.fkChoices[columnName] : null;

    const nextFkChoices = next.fkChoices ? next.fkChoices[columnName] : null;

    const prevReadOnlyProperties = prev.readOnlyProperties
      ? prev.readOnlyProperties[columnName]
      : null;

    const nextReadOnlyProperties = next.readOnlyProperties
      ? next.readOnlyProperties[columnName]
      : null;

    const prevVisualToggle = prev.visualToggles
      ? prev.visualToggles[columnName]
      : null;

    const nextVisualToggle = next.visualToggles
      ? next.visualToggles[columnName]
      : null;

    const prevFormik = prev.formFieldFactory.formik;
    const nextFormik = next.formFieldFactory.formik;

    return (
      columnName === nextColumnName &&
      prevFkChoices === nextFkChoices &&
      prevReadOnlyProperties === nextReadOnlyProperties &&
      prevFormik.values[columnName] === nextFormik.values[columnName] &&
      prevFormik.touched[columnName] === nextFormik.touched[columnName] &&
      prevFormik.errors[columnName] === nextFormik.errors[columnName] &&
      prevVisualToggle === nextVisualToggle
    );
  }
);

export default FormFieldMemo;

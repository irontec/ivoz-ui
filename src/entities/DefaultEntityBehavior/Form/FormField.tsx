import React from 'react';
import { Grid } from '@mui/material';
import { VisualToggleStates } from '../../../services/entity/EntityService';
import FormFieldFactory from '../../../services/form/FormFieldFactory';
import { isPropertyScalar } from '../../../services/api/ParsedApiSpecInterface';
import {
  FkChoices,
  ReadOnlyProperties,
  NullablePropertyFkChoices,
} from './Form';
import {
  FieldsetGroupsField,
  isDetailedFormFieldSpec,
} from '../FilterFieldsetGroups';

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
    if (!column) {
      throw `Unknown property ${columnName}`;
    }

    if (column.memoize === false) {
      return false;
    }

    if (isPropertyScalar(column) && column.multilang === true) {
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

    const columnNameSegments = columnName.split('.');
    const prevFormikValue =
      columnNameSegments.length > 1
        ? prevFormik.values[columnNameSegments[0]][columnNameSegments[1]]
        : prevFormik.values[columnName];

    const nextFormikValue =
      columnNameSegments.length > 1
        ? nextFormik.values[columnNameSegments[0]][columnNameSegments[1]]
        : nextFormik.values[columnName];

    const prevTouchedSubproperty = prevFormik.touched[columnNameSegments[0]] as
      | Record<string, unknown>
      | undefined;
    const prevFormikTouched =
      columnNameSegments.length > 1 && prevTouchedSubproperty
        ? prevTouchedSubproperty[columnNameSegments[1]]
        : prevFormik.touched[columnName];

    const nextTouchedSubproperty = nextFormik.touched[columnNameSegments[0]] as
      | Record<string, unknown>
      | undefined;
    const nextFormikTouched =
      columnNameSegments.length > 1 && nextTouchedSubproperty
        ? nextTouchedSubproperty[columnNameSegments[1]]
        : nextFormik.touched[columnName];

    const prevErrorSubproperty = prevFormik.errors[columnNameSegments[0]] as
      | Record<string, unknown>
      | undefined;
    const prevFormikError =
      columnNameSegments.length > 1 && prevErrorSubproperty
        ? prevErrorSubproperty[columnNameSegments[1]]
        : prevFormik.errors[columnName];

    const nextErrorSubproperty = nextFormik.errors[columnNameSegments[0]] as
      | Record<string, unknown>
      | undefined;
    const nextFormikError =
      columnNameSegments.length > 1 && nextErrorSubproperty
        ? nextErrorSubproperty[columnNameSegments[1]]
        : nextFormik.errors[columnName];

    return (
      columnName === nextColumnName &&
      prevFkChoices === nextFkChoices &&
      prevReadOnlyProperties === nextReadOnlyProperties &&
      prevFormikValue === nextFormikValue &&
      prevFormikTouched === nextFormikTouched &&
      prevFormikError === nextFormikError &&
      prevVisualToggle === nextVisualToggle
    );
  }
);

export default FormFieldMemo;

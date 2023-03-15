import { InputBaseComponentProps, OutlinedInputProps } from '@mui/material';
import { useFormikType } from 'services/form/types';
import { FormOnChangeEvent } from '../../../../entities/DefaultEntityBehavior/Form/Form';
import Multilang from '../../..//form/Field/Multilang';
import { EmbeddableProperty, PropertyList } from '../../../api';

type MultilangFactoryPropsType = {
  fld: string;
  property: EmbeddableProperty;
  properties: PropertyList;
  disabled: boolean;
  hasChanged: boolean;
  inputProps: InputBaseComponentProps;
  InputProps: Partial<OutlinedInputProps>;
  changeHandler: (event: FormOnChangeEvent) => void;
  handleBlur: (event: React.FocusEvent) => void;
  formik: useFormikType;
};

export const MultilangFactory = (
  props: MultilangFactoryPropsType
): JSX.Element => {
  const {
    fld,
    property,
    properties,
    disabled,
    hasChanged,
    inputProps,
    InputProps,
    changeHandler,
    handleBlur,
    formik,
  } = props;

  return (
    <Multilang
      property={property}
      properties={properties}
      _columnName={fld}
      readOnly={disabled}
      disabled={disabled}
      formik={formik}
      values={formik.values}
      changeHandler={changeHandler}
      onBlur={handleBlur}
      hasChanged={hasChanged}
      choices={null}
      InputProps={InputProps}
      inputProps={inputProps}
    />
  );
};

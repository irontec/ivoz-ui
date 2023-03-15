import { InputBaseComponentProps, OutlinedInputProps } from '@mui/material';
import { FormOnChangeEvent } from '../../../../entities/DefaultEntityBehavior/Form/Form';
import { ScalarProperty } from '../../../api';
import { ScalarEntityValue } from '../../../entity';
import { StyledTextField } from '../../../form/Field/TextField/TextField.styles';

type NumberFactoryPropsType = {
  fld: string;
  property: ScalarProperty;
  disabled: boolean;
  value: ScalarEntityValue | Array<ScalarEntityValue>;
  hasChanged: boolean;
  error: React.ReactNode;
  touched: boolean | undefined;
  inputProps: InputBaseComponentProps;
  InputProps: Partial<OutlinedInputProps>;
  changeHandler: (event: FormOnChangeEvent) => void;
  handleBlur: (event: React.FocusEvent) => void;
};

export const NumberFactory = (props: NumberFactoryPropsType): JSX.Element => {
  const {
    fld,
    property,
    disabled,
    value,
    hasChanged,
    error,
    touched,
    inputProps,
    InputProps,
    changeHandler,
    handleBlur,
  } = props;

  if (property.minimum !== undefined) {
    inputProps.min = property.minimum;
  }

  if (property.maximum !== undefined) {
    inputProps.max = property.maximum;
  }

  return (
    <StyledTextField
      name={fld}
      type='number'
      value={value}
      disabled={disabled}
      label={property.label}
      required={property.required}
      onChange={changeHandler}
      onBlur={handleBlur}
      error={touched && Boolean(error)}
      errorMsg={touched && error}
      helperText={property.helpText}
      inputProps={inputProps}
      InputProps={InputProps}
      hasChanged={hasChanged}
    />
  );
};

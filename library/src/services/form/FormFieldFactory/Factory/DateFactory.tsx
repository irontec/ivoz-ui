import { OutlinedInputProps } from '@mui/material';
import { StyledTextField } from '../../../form/Field/TextField/TextField.styles';
import { FormOnChangeEvent } from '../../../../entities/DefaultEntityBehavior/Form/Form';
import { ScalarProperty } from '../../../api';
import { ScalarEntityValue } from '../../../entity';

type DateFactoryPropsType = {
  fld: string;
  property: ScalarProperty;
  disabled: boolean;
  value: ScalarEntityValue | Array<ScalarEntityValue>;
  hasChanged: boolean;
  error: React.ReactNode;
  touched: boolean | undefined;
  InputProps: Partial<OutlinedInputProps>;
  changeHandler: (event: FormOnChangeEvent) => void;
  handleBlur: (event: React.FocusEvent) => void;
};

export const DateFactory = (props: DateFactoryPropsType): JSX.Element => {
  const {
    fld,
    property,
    disabled,
    value,
    hasChanged,
    error,
    touched,
    InputProps,
    changeHandler,
    handleBlur,
  } = props;

  return (
    <StyledTextField
      name={fld}
      type='date'
      value={value}
      disabled={disabled}
      label={property.label}
      required={property.required}
      onChange={changeHandler}
      onBlur={handleBlur}
      error={touched && Boolean(error)}
      errorMsg={touched && error}
      helperText={property.helpText}
      InputProps={InputProps}
      hasChanged={hasChanged}
    />
  );
};

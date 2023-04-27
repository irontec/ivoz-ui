import { OutlinedInputProps } from '@mui/material';
import { FormOnChangeEvent } from '../../../../entities/DefaultEntityBehavior/Form/Form';
import { ScalarProperty } from '../../../api';
import { ScalarEntityValue } from '../../../entity';
import { StyledTextField } from '../../../form/Field/TextField/TextField.styles';

type DateTimeFactoryPropsType = {
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

export const DateTimeFactory = (
  props: DateTimeFactoryPropsType
): JSX.Element => {
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
      type='datetime-local'
      value={value}
      inputProps={{
        step: 1,
      }}
      disabled={disabled}
      label={property.label}
      required={property.required}
      onChange={changeHandler}
      onBlur={handleBlur}
      error={touched && Boolean(error)}
      errorMsg={touched && error}
      helperText={property.helpText}
      fullWidth={true}
      InputProps={InputProps}
      hasChanged={hasChanged}
    />
  );
};

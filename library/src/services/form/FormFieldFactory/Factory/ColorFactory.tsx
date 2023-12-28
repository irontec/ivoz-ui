import {
  InputAdornment,
  InputBaseComponentProps,
  OutlinedInputProps,
} from '@mui/material';
import { FormOnChangeEvent } from '../../../../entities/DefaultEntityBehavior/Form/Form';
import { ScalarProperty } from '../../../api';
import { ScalarEntityValue } from '../../../entity';
import { StyledColorField } from '../../Field/TextField/TextField.styles';

type ColorFactoryPropsType = {
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

export const ColorFactory = (props: ColorFactoryPropsType): JSX.Element => {
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

  if (!InputProps.endAdornment) {
    InputProps.endAdornment = (
      <InputAdornment position='end'>
        <span>{value}</span>
      </InputAdornment>
    );
  }

  return (
    <StyledColorField
      name={fld}
      type={'color'}
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
      inputProps={inputProps}
      hasChanged={hasChanged}
    />
  );
};

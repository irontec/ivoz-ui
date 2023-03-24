import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  FormControl,
  FormHelperText,
  OutlinedInput,
  TextFieldProps as MuiTextFieldProps,
} from '@mui/material';
import { StyledHelpTextTooltip } from '../Shared/HelpText.styles';
import './TextField.scoped.scss';

export type TextFieldProps = MuiTextFieldProps & {
  hasChanged: boolean;
  margin?: 'dense' | 'none';
  size?: 'small' | 'medium';
  errorMsg?: React.ReactNode;
};

export const TextField = (props: TextFieldProps) => {
  const {
    name,
    size,
    type,
    defaultValue,
    value,
    disabled,
    label,
    placeholder,
    multiline,
    required,
    onChange,
    onBlur,
    error,
    errorMsg,
    helperText,
    inputProps,
    InputProps,
    hasChanged,
    inputRef,
  } = props;

  const margin = props.margin ?? undefined;

  let className = props.className;
  if (hasChanged) {
    className += ' changed';
  }

  const labelId = `${name}-label`;
  const maxRows = multiline ? 6 : undefined;

  return (
    <FormControl
      variant='standard'
      fullWidth={true}
      error={error}
      className={'text-field ' + className}
    >
      {label && (
        <label htmlFor={name} id={labelId}>
          {label}
          {required && '*'}
          {helperText && (
            <StyledHelpTextTooltip
              title={helperText}
              placement='top'
              arrow
              className='help-tooltip'
            >
              <HelpOutlineIcon />
            </StyledHelpTextTooltip>
          )}
        </label>
      )}
      <OutlinedInput
        ref={InputProps?.ref}
        name={name}
        type={type}
        size={size}
        multiline={multiline}
        maxRows={maxRows}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        className='input-field'
        margin={margin}
        inputProps={inputProps}
        startAdornment={InputProps?.startAdornment}
        endAdornment={InputProps?.endAdornment}
        inputRef={inputRef}
      />
      {error && errorMsg && (
        <FormHelperText className='helper-error'>{errorMsg}</FormHelperText>
      )}
    </FormControl>
  );
};

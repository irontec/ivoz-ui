import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  FormControl,
  FormHelperText,
  OutlinedInput,
  TextFieldProps as MuiTextFieldProps,
  OutlinedInputProps,
} from '@mui/material';
import { StyledHelpTextTooltip } from '../Shared/HelpText.styles';
import { KeyboardEventHandler } from 'react';

export type TextFieldProps = MuiTextFieldProps & {
  hasChanged: boolean;
  margin?: 'dense' | 'none';
  size?: 'small' | 'medium';
  errorMsg?: React.ReactNode;
  className?: string;
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
    onKeyDown,
    onClick,
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

  type passThroughPropsType = Partial<OutlinedInputProps>;
  const passThroughProps: passThroughPropsType = {};

  if (onKeyDown) {
    passThroughProps.onKeyDown = onKeyDown as KeyboardEventHandler<
      HTMLTextAreaElement | HTMLInputElement
    >;
  }
  if (onClick) {
    passThroughProps.onClick = onClick;
  }

  return (
    <FormControl
      variant='standard'
      fullWidth={true}
      error={error}
      className={className}
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
        {...passThroughProps}
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

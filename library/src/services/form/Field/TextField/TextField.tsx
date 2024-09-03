import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  FormControl,
  FormHelperText,
  OutlinedInput,
  TextFieldProps as MuiTextFieldProps,
  OutlinedInputProps,
} from '@mui/material';
import { StyledHelpTextTooltip } from '../Shared/HelpText.styles';
import { KeyboardEventHandler, useEffect, useState } from 'react';

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

  const [inputValue, setInputValue] = useState(value);
  useEffect(() => {
    if (!value) {
      return;
    }
    setInputValue(value);
  }, [value]);

  const labelId = `${name}-label`;
  const maxRows = multiline ? 6 : undefined;

  const fixDateTime = (value: string) => {
    const haveMissingSeconds = value.length === 16;

    return haveMissingSeconds ? value.concat(':00') : value;
  };

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

  passThroughProps.onChange = (event) => {
    if (type === 'datetime-local') {
      setInputValue(fixDateTime(event.target.value));
    }

    if (onChange) {
      onChange(event);
    }
  };

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
        value={inputValue}
        disabled={disabled}
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

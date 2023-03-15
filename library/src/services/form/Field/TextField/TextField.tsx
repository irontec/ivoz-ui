import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  FormControl,
  FormHelperText,
  OutlinedInput,
  TextFieldProps,
} from '@mui/material';
import { StyledHelpTextTooltip } from '../Shared/HelpText.styles';

type StyledTextFieldProps = TextFieldProps & {
  hasChanged: boolean;
  margin?: 'dense' | 'none';
  size?: 'small' | 'medium';
  errorMsg?: React.ReactNode;
};
export const TextField = (props: StyledTextFieldProps) => {
  const {
    name,
    size,
    type,
    value,
    disabled,
    label,
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
      className={className}
    >
      {label && (
        <label htmlFor={name} id={labelId}>
          {label}
          {required && '*'}
          {helperText && (
            <StyledHelpTextTooltip title={helperText} placement='top' arrow>
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
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        className={className}
        margin={margin}
        inputProps={inputProps}
        startAdornment={InputProps?.startAdornment}
        endAdornment={InputProps?.endAdornment}
      />
      {error && errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
    </FormControl>
  );
};

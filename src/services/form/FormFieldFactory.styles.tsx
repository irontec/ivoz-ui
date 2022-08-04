import { styled, TextFieldProps } from '@mui/material';
import {
  Theme,
  Typography,
  FormControl,
  TextField,
  TextareaAutosize,
} from '@mui/material';

interface StyledSwitchFormControlProps {
  children: React.ReactNode;
  className?: string;
  hasChanged: boolean;
}
export const StyledSwitchFormControl = styled(
  (props: StyledSwitchFormControlProps) => {
    const { children, hasChanged } = props;
    let className = props.className;
    if (hasChanged) {
      className += ' changed';
    }

    return (
      <FormControl className={className} fullWidth={true}>
        {children}
      </FormControl>
    );
  }
)(({ theme }) => {
  return {
    marginTop: '10px',
    '&.changed label': {
      color: theme.palette.info.main,
    },
  };
});

interface StyledFilterDialogTypographyProps {
  children: React.ReactNode;
  className?: string;
}
export const StyledFilterDialogTypography = styled(
  (props: StyledFilterDialogTypographyProps) => {
    const { children, className } = props;
    return (
      <Typography variant='h6' className={className}>
        {children}
      </Typography>
    );
  }
)(({ theme }) => {
  return {
    marginLeft: theme.spacing(2),
    flex: 1,
  };
});

type StyledTextFieldProps = TextFieldProps & {
  hasChanged: boolean;
};
export const StyledTextField = styled((props: StyledTextFieldProps) => {
  const {
    name,
    type,
    value,
    disabled,
    label,
    multiline,
    required,
    onChange,
    onBlur,
    error,
    helperText,
    inputProps,
    InputProps,
    hasChanged,
  } = props;

  let className = props.className;
  if (hasChanged) {
    className += ' changed';
  }

  const maxRows = multiline ? 6 : undefined;

  return (
    <TextField
      name={name}
      type={type}
      multiline={multiline}
      maxRows={maxRows}
      value={value}
      disabled={disabled}
      label={label}
      InputLabelProps={{ shrink: true, required: required }}
      onChange={onChange}
      onBlur={onBlur}
      error={error}
      helperText={helperText}
      fullWidth={true}
      className={className}
      margin='normal'
      inputProps={inputProps}
      InputProps={InputProps}
    />
  );
})(({ theme }) => {
  return {
    marginTop: '0px',
    '&.changed > label': {
      color: theme.palette.info.main,
    },
  };
});

export const StyledLinearProgressContainer = styled('div')(() => {
  return {
    paddingTop: '52px',
  };
});

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import { JSXElementConstructor, ReactElement } from 'react';

export interface SelectProps {
  className?: string;
  name: string;
  label: string | ReactElement<any, string | JSXElementConstructor<any>>;
  value: any;
  required: boolean;
  disabled: boolean;
  onChange: (event: any) => void;
  onBlur: (event: React.FocusEvent) => void;
  hasChanged: boolean;
  choices: any;
  error?: boolean;
  helperText?: string;
}

const Dropdown = (props: SelectProps): JSX.Element => {
  const {
    name,
    label,
    value,
    required,
    disabled,
    onChange,
    onBlur,
    choices,
    error,
    helperText,
    hasChanged,
    className,
  } = props;

  const labelId = `${name}-label`;

  const labelClassName = hasChanged ? 'changed' : '';

  const entriesChoices = Object.entries(choices).filter(
    ([, label]) => label !== false
  );

  const valuesChoices = Object.values(choices).sort();

  const orderChoices: any = [];
  valuesChoices.map((valueChoices) =>
    entriesChoices.map((entryChoices) =>
      valueChoices === entryChoices[1] ? orderChoices.push(entryChoices) : []
    )
  );

  return (
    <FormControl fullWidth={true} error={error} className={className}>
      <InputLabel
        required={required}
        shrink={true}
        className={labelClassName}
        id={labelId}
      >
        {label}
      </InputLabel>
      <Select
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        displayEmpty={true}
        variant='outlined'
        input={
          <OutlinedInput name={name} type='text' label={label} notched={true} />
        }
      >
        {orderChoices.map(([value, label]: [string, any], key: number) => {
          return (
            <MenuItem value={value} key={`${value}-${key}`}>
              {label}
            </MenuItem>
          );
        })}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default Dropdown;

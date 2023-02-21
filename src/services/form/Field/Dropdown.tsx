import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from 'react';

export type DropdownArrayChoice = {
  label: string | React.ReactElement<any>;
  id: string | number;
  extraData?: Record<string, unknown>;
};
export type DropdownArrayChoices = Array<DropdownArrayChoice>;

export type DropdownObjectChoices = {
  [label: string | number]: string | React.ReactElement<any>;
};

export type DropdownChoices = DropdownObjectChoices | DropdownArrayChoices;

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
  choices: DropdownChoices;
  error?: boolean;
  helperText?: string | React.ReactNode;
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

  const [arrayChoices, setArrayChoices] = useState<DropdownArrayChoices>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);

    if (Array.isArray(choices)) {
      setArrayChoices(choices);
      return;
    }

    const arrayValue = [];
    for (const idx in choices) {
      arrayValue.push({ id: idx, label: choices[idx] });
    }
    setArrayChoices(arrayValue);
  }, [choices]);

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
      {ready && (
        <Select
          value={value}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          displayEmpty={true}
          variant='outlined'
          input={
            <OutlinedInput
              name={name}
              type='text'
              label={label}
              notched={true}
            />
          }
        >
          {arrayChoices
            .filter(({ label }) => label)
            .map((arrayChoice, key: number) => {
              return (
                <MenuItem
                  value={arrayChoice.id}
                  key={`${arrayChoice.id}-${key}`}
                >
                  {arrayChoice.label}
                </MenuItem>
              );
            })}
        </Select>
      )}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default Dropdown;

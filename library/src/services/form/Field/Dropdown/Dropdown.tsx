import {
  FormControl,
  FormHelperText,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
  JSXElementConstructor,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { StyledHelpTextTooltip } from '../Shared/HelpText.styles';

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
  errorMsg?: React.ReactNode;
  helperText?: string | React.ReactNode;
  multiple?: boolean;
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
    errorMsg,
    helperText,
    hasChanged,
    className,
    multiple = false,
  } = props;

  const labelId = `${name}-label`;
  const labelClassName = hasChanged ? 'changed' : '';

  const [prevChoices, setPrevChoices] = useState<DropdownChoices>();
  const [arrayChoices, setArrayChoices] = useState<DropdownArrayChoices>([]);

  useEffect(() => {
    setPrevChoices(choices);

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

  const ready = choices === prevChoices;

  return (
    <FormControl fullWidth={true} error={error} className={`${className}`}>
      {label && (
        <label htmlFor={name} id={labelId} className={labelClassName}>
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

      <Select
        multiple={multiple}
        value={ready ? value : multiple ? [] : ''}
        renderValue={
          multiple
            ? (selected) =>
                (selected as Array<string | number>).map((id, idx) => {
                  const choice = arrayChoices.find(
                    (item) => `${item.id}` === `${id}`
                  );

                  return (
                    <span key={`${id}-${idx}`}>
                      {idx > 0 && ', '}
                      {choice ? choice.label : id}
                    </span>
                  );
                })
            : undefined
        }
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        displayEmpty={true}
        variant='outlined'
        className='select'
        input={
          <OutlinedInput
            name={name}
            type='text'
            label={label}
            notched={false}
          />
        }
      >
        {arrayChoices
          .filter(({ label }) => label)
          .map((arrayChoice, key: number) => {
            return (
              <MenuItem value={arrayChoice.id} key={`${arrayChoice.id}-${key}`}>
                {arrayChoice.label}
              </MenuItem>
            );
          })}
      </Select>
      {error && errorMsg && <FormHelperText>{errorMsg}</FormHelperText>}
    </FormControl>
  );
};

export default Dropdown;

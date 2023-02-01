import React, {
  useEffect,
  useState,
  useCallback,
  ReactElement,
  JSXElementConstructor,
} from 'react';
import { Box, TextField } from '@mui/material';
import MuiAutocomplete from '@mui/material/Autocomplete';
import { getI18n } from 'react-i18next';
import {
  DropdownChoices,
  DropdownArrayChoices,
  DropdownArrayChoice,
} from './Dropdown';

export interface AutocompleteProps {
  className?: string;
  name: string;
  label: string | ReactElement<any, string | JSXElementConstructor<any>>;
  value: any;
  multiple: boolean;
  required: boolean;
  disabled: boolean;
  onChange: (event: any) => void;
  onBlur: (event: React.FocusEvent) => void;
  choices: DropdownChoices;
  error?: boolean;
  helperText?: string;
  hasChanged: boolean;
}

const Autocomplete = (props: AutocompleteProps): JSX.Element | null => {
  const {
    name,
    label,
    required,
    multiple,
    disabled,
    onChange,
    onBlur,
    choices,
    error,
    helperText,
    hasChanged,
  } = props;

  const value = props.value || null;
  const i18n = getI18n();

  let className = props.className;
  if (hasChanged) {
    className += ' changed';
  }

  const [arrayChoices, setArrayChoices] = useState<DropdownArrayChoices>([]);

  useEffect(() => {
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

  const onChangeWrapper = useCallback(
    (
      e: any,
      option: DropdownArrayChoice | DropdownArrayChoices | null,
      reason: string
    ) => {
      let selectedValue = undefined;
      if (reason !== 'clear' && option !== null) {
        selectedValue = multiple
          ? (option as DropdownArrayChoices).map((item: any) =>
              typeof item === 'object' ? item.id : item
            )
          : (option as DropdownArrayChoice).id;
      } else {
        selectedValue = arrayChoices.find((item) => item.id === '__null__')
          ? '__null__'
          : undefined;
      }

      onChange({
        target: {
          name: name,
          value: selectedValue,
        },
      });
    },
    [multiple, onChange, name, arrayChoices]
  );

  const getOptionLabel = useCallback(
    (value: any) => {
      if (typeof value !== 'object') {
        value = arrayChoices.find((option) => option.id == value);
      }

      const isTranslation =
        value?.label &&
        typeof value.label === 'object' &&
        value.label?.props?.defaults &&
        typeof value.label?.props?.defaults === 'string';

      if (isTranslation) {
        const translatableText = value.label?.props?.defaults;

        return i18n.t(translatableText);
      }

      return value?.label || '';
    },
    [arrayChoices, i18n]
  );

  const isOptionEqualToValue = useCallback(
    (
      option: DropdownArrayChoice,
      value: DropdownArrayChoice | number | string
    ): boolean => {
      if (option.id == value) {
        return true;
      }

      if (option.id == (value as DropdownArrayChoice).id) {
        return true;
      }

      return false;
    },
    []
  );

  const renderInput = useCallback(
    (params: any) => {
      const InputProps = {
        ...params.InputProps,
        notched: true,
      };

      return (
        <TextField
          {...params}
          name={name}
          label={label}
          InputProps={InputProps}
          InputLabelProps={{ shrink: true, required: required }}
          error={error}
          helperText={helperText}
        />
      );
    },
    [name, label, required, error, helperText]
  );

  const disableClearable = arrayChoices.find((item) => item.id === '__null__')
    ? false
    : true;

  let autocompleteValue;
  if (multiple) {
    autocompleteValue = arrayChoices.length ? value : [];
  } else {
    autocompleteValue =
      arrayChoices?.find((item) => `${item.id}` === `${value}`) ?? null;
  }

  return (
    <MuiAutocomplete
      className={className}
      value={autocompleteValue}
      multiple={multiple}
      disabled={disabled}
      disableClearable={disableClearable}
      onChange={onChangeWrapper}
      onBlur={onBlur}
      options={arrayChoices}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      filterSelectedOptions
      renderInput={renderInput}
      renderOption={(props, option) => (
        <Box component='li' data-value={option.id} {...props}>
          {option.label}
        </Box>
      )}
    />
  );
};

export default Autocomplete;

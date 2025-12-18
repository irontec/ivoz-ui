import { Box, InputProps, Paper, Typography } from '@mui/material';
import MuiAutocomplete from '@mui/material/Autocomplete';
import React, {
  JSXElementConstructor,
  ReactElement,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  DropdownArrayChoice,
  DropdownArrayChoices,
  DropdownChoices,
} from '../Dropdown';
import { StyledAutocompleteTextField } from '../TextField';
import { SelectOptionsType } from 'entities/EntityInterface';
import { FormOnChangeEvent } from 'entities/DefaultEntityBehavior/Form/Form';
import SearchIcon from '@mui/icons-material/Search';

export interface DynamicAutocompleteProps {
  choices: DropdownChoices;
  selectOptions?: SelectOptionsType;
  nullOption?: string | React.ReactElement<any>;
  className?: string;
  name: string;
  label: string | ReactElement<any, string | JSXElementConstructor<any>>;
  placeholder?: string;
  value: any;
  multiple: boolean;
  required: boolean;
  disabled: boolean;
  onBlur: (event: React.FocusEvent) => void;
  error?: boolean;
  errorMsg?: React.ReactNode;
  helperText?: string | React.ReactNode;
  hasChanged: boolean;
  InputProps?: Partial<InputProps>;
  onChange: (event: FormOnChangeEvent) => void;
}

const DynamicAutocomplete = (
  props: DynamicAutocompleteProps
): JSX.Element | null => {
  const {
    nullOption,
    name,
    label,
    required,
    multiple,
    disabled,
    onBlur,
    error,
    errorMsg,
    helperText,
    hasChanged,
    value,
    choices,
    selectOptions,
    onChange,
  } = props;

  const { t } = useTranslation();

  let className = props.className;
  if (hasChanged) {
    className += ' changed';
  }

  if (multiple) {
    className += ' multiselect';
  }

  const nullOptionObject: DropdownArrayChoice = {
    id: '__null__',
    label: nullOption ?? '',
  };
  const [arrayChoices, setArrayChoices] = useState<DropdownArrayChoices>([]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentOption, setCurrentOption] =
    useState<DropdownArrayChoice>(nullOptionObject);

  const debounceTimeoutRef = useRef<NodeJS.Timeout>();
  const loadedValuesRef = useRef<Set<string | number>>(new Set());

  useEffect(() => {
    if (selectOptions && Object.keys(choices).length === 0) {
      return;
    }

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

  useEffect(() => {
    const nullValue = !value || value === '__null__';

    if (nullValue) {
      return;
    }

    if (!selectOptions) {
      return;
    }

    if (loadedValuesRef.current.has(value)) {
      return;
    }

    loadedValuesRef.current.add(value);

    selectOptions(
      {
        callback: (options: unknown) => {
          const option = (options as DropdownArrayChoices)[0];
          if (option) {
            setArrayChoices((prev) => {
              const exists = prev.some((item) => item.id == option.id);
              return exists ? prev : [...prev, option];
            });
          }
        },
      },
      {
        id: value,
      }
    );
  }, [value, selectOptions]);

  const setOptions = useCallback(
    (options: any) => {
      const isCurrentOptionIncluded = options.some(
        (option: any) => option.id == currentOption?.id
      );

      if (
        !isCurrentOptionIncluded &&
        currentOption &&
        currentOption.id !== '__null__'
      ) {
        options.unshift(currentOption);
      }

      if (nullOptionObject) {
        options.unshift(nullOptionObject);
      }

      setArrayChoices(options);
    },
    [nullOptionObject, currentOption]
  );

  const clearSearch = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    setLoading(false);
  }, []);

  const loadOptions = useCallback(
    (searchValue: string) => {
      if (!selectOptions) {
        console.error('selectOptions is not defined');
        return;
      }

      setLoading(true);
      debounceTimeoutRef.current = setTimeout(() => {
        selectOptions(
          {
            callback: (options: unknown) => {
              setLoading(false);
              setOptions(options);
            },
          },
          {
            searchTerm: searchValue,
          }
        );
      }, 500);
    },
    [searchTerm, selectOptions]
  );

  useEffect(() => {
    clearSearch();

    const searchTermMatchNullOption =
      getOptionLabel(nullOptionObject) === searchTerm;
    if (searchTermMatchNullOption) {
      return;
    }

    const isSearchTermIncluded =
      searchTerm !== '' &&
      arrayChoices?.some((option) =>
        getOptionLabel(option).includes(searchTerm)
      );

    if (isSearchTermIncluded) {
      return;
    }

    loadOptions(searchTerm);
  }, [searchTerm, selectOptions]);

  const handleInputChange = useCallback(
    (e: any, value: string, reason: string) => {
      if (reason === 'clear') {
        setSearchTerm('');
        return;
      }

      if (reason === 'input') {
        setSearchTerm(value);
        return;
      }

      if (reason === 'reset') {
        if (arrayChoices.length === 0) {
          setSearchTerm('');
        }
      }
    },
    []
  );

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
      } else if (reason === 'clear') {
        selectedValue = '';
      } else {
        selectedValue = arrayChoices?.find((item) => item.id === '__null__')
          ? '__null__'
          : null;
      }

      setCurrentOption(option as DropdownArrayChoice);

      onChange({
        target: {
          name: name,
          value: selectedValue,
        },
      } as FormOnChangeEvent);
    },
    [multiple, onChange, name, arrayChoices]
  );

  const getOptionLabel = useCallback(
    (value: any) => {
      if (typeof value !== 'object') {
        value = arrayChoices?.find((option) => option.id == value);
      }

      const isTranslation =
        value?.label &&
        typeof value.label === 'object' &&
        value.label?.props?.defaults &&
        typeof value.label?.props?.defaults === 'string';

      if (isTranslation) {
        const translatableText = value.label?.props?.defaults;

        return t(translatableText);
      }

      return value?.label || '';
    },
    [arrayChoices, t]
  );

  const isOptionEqualToValue = useCallback(
    (
      option: DropdownArrayChoice,
      value: DropdownArrayChoice | number | string
    ): boolean => {
      if (value === currentOption?.id) {
        return true;
      }

      if (option?.id == value) {
        return true;
      }

      if (option?.id == (value as DropdownArrayChoice).id) {
        return true;
      }

      return false;
    },
    []
  );

  const arrayChoicesLength = arrayChoices?.length ?? 0;

  const renderInput = useCallback(
    (props: any) => {
      const inputProps = {
        ...props.InputProps,
        notched: true,
      };

      const showPlaceholder = !searchTerm && !loading;
      const inputPlaceholder = showPlaceholder
        ? t('Type to search')
        : props.placeholder;

      return (
        <StyledAutocompleteTextField
          {...props}
          name={name}
          label={label}
          required={required}
          disabled={disabled}
          InputProps={inputProps}
          InputLabelProps={{ shrink: true, required: required }}
          error={error}
          errorMsg={errorMsg}
          helperText={helperText}
          placeholder={inputPlaceholder}
        />
      );
    },
    [
      name,
      label,
      required,
      disabled,
      error,
      errorMsg,
      helperText,
      arrayChoicesLength,
      searchTerm,
      loading,
    ]
  );

  const dropdownHelperText = 'Type to load more options';
  const CustomOption = useCallback(
    (props: any) => {
      return (
        <Paper {...props}>
          {props.children}
          {dropdownHelperText && (
            <Box
              sx={{
                p: 2,
                borderTop: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-text)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <SearchIcon sx={{ fontSize: '18px' }} />
              <Typography variant='caption'>{t(dropdownHelperText)}</Typography>
            </Box>
          )}
        </Paper>
      );
    },
    [dropdownHelperText]
  );

  const disableClearable = arrayChoices.find((item) => item.id === '__null__')
    ? false
    : true;

  const safeValue = arrayChoices.find((item) => item.id == value)
    ? value
    : null;

  return (
    <MuiAutocomplete
      className={'dynamic-autocomplete' + className}
      value={safeValue}
      multiple={multiple}
      disabled={disabled}
      disableClearable={disableClearable}
      onChange={onChangeWrapper}
      onBlur={onBlur}
      onInputChange={handleInputChange}
      options={arrayChoices ?? []}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      loading={loading}
      placeholder={props.placeholder}
      renderInput={renderInput}
      PaperComponent={CustomOption}
      renderOption={(props, option) => (
        <Box
          component='li'
          className='autocomplete-option'
          data-value={option.id}
          {...props}
        >
          {option.label}
        </Box>
      )}
    />
  );
};

export default DynamicAutocomplete;

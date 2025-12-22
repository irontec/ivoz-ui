import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { memo, useEffect, useMemo, useState } from 'react';
import {
  LightButton,
  TonalButton,
} from '../../../../components/shared/Button/Button.styles';
import { NullablePropertyFkChoices } from '../../../../entities';
import {
  PropertyList,
  isPropertyFk,
  isPropertyScalar,
} from '../../../../services/api/ParsedApiSpecInterface';
import {
  DropdownChoices,
  SelectProps,
} from '../../../../services/form/Field/Dropdown';
import { StyledDropdown } from '../../../../services/form/Field/Dropdown/Dropdown.styles';
import { StyledDynamicAutocomplete } from '../../../../services/form/Field/DynamicAutocomplete/DynamicAutocomplete.styles';
import { StyledTextField } from '../../../../services/form/Field/TextField/TextField.styles';
import _ from '../../../../services/translations/translate';
import { CriteriaFilterValue } from '../ContentFilterDialog';
import FilterIconFactory from '../icons/FilterIconFactory';
import StoreContainer from '../../../../store/StoreContainer';
import { SelectOptionsType } from '../../../../entities/EntityInterface';

export interface ContentFilterRowProps {
  idx: number;
  filters: { [key: string]: Array<string> };
  row: CriteriaFilterValue;
  columns: PropertyList;
  fkChoices: { [fldName: string]: NullablePropertyFkChoices };
  fieldNames: DropdownChoices;
  isLast: boolean;
  setRow: (idx: number, name: string, type: string, value: string) => void;
  removeRow: (idx: number) => void;
  className?: string;
}

const StyledDropdownMemo = memo(
  StyledDropdown,
  (prev: SelectProps, next: SelectProps) => {
    return prev.value === next.value;
  }
);

export default function ContentFilterRow(
  props: ContentFilterRowProps
): JSX.Element | null {
  const {
    idx,
    filters,
    row,
    columns,
    fkChoices,
    fieldNames,
    isLast,
    setRow,
    removeRow,
    className,
  } = props;

  const [name, setName] = useState(row.name);
  if (!filters[name]) {
    return null;
  }

  const filterChoices = useMemo(() => {
    const choices: DropdownChoices = {};
    for (const filter of filters[name]) {
      choices[filter] = FilterIconFactory({
        name: filter,
        includeLabel: true,
      });
    }
    return choices;
  }, [filters, name]);

  const [type, setType] = useState(row.type);
  const [value, setValue] = useState<string>(row.value as string);

  useEffect(() => {
    setName(row.name);
    setType(row.type);
    setValue(row.value as string);
  }, [row]);

  const column = columns[name];

  const [selectOptions, setSelectOptions] = useState<SelectOptionsType | null>(
    null
  );

  const { useDynamicAutocomplete, entityName, enumValue } = useMemo(() => {
    let enumVal: DropdownChoices | null = null;
    let useDynamic = false;
    let entName = '';

    if (isPropertyFk(column)) {
      const entities = StoreContainer.store.getState().entities.entities;
      entName = column.$ref?.replace('#/definitions/', '') || '';
      const entity = entities?.[entName];

      if (entity?.dynamicSelectOptions) {
        useDynamic = true;
      } else {
        enumVal = fkChoices[name] || {};
      }
    } else if (column.enum) {
      enumVal = column.enum;
    } else if (column.type === 'boolean') {
      enumVal = {
        true: _('True'),
        false: _('False'),
      };
    }

    return {
      useDynamicAutocomplete: useDynamic,
      entityName: entName,
      enumValue: enumVal,
    };
  }, [column, name, fkChoices]);

  useEffect(() => {
    if (!useDynamicAutocomplete || !entityName) {
      return;
    }

    const entities = StoreContainer.store.getState().entities.entities;
    const entity = entities?.[entityName];

    if (entity?.selectOptions) {
      entity.selectOptions().then((handler) => {
        setSelectOptions(() => handler);
      });
    }
  }, [useDynamicAutocomplete, entityName]);

  const columnFormat = isPropertyScalar(column) && column.format;
  let textFieldInputType = 'text';
  const inputProps: Record<string, unknown> = {};

  switch (columnFormat) {
    case 'date-time':
      textFieldInputType = 'datetime-local';
      inputProps.step = 1;
      break;
  }

  const updateCriteria = () => {
    setRow(idx, name, type, value);
  };
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (!isLast) {
        updateCriteria();
      }
    }, 250);
    return () => clearTimeout(timeOutId);
  }, [name, type, value, isLast]);

  const mobile = useMediaQuery(useTheme().breakpoints.down('md'));

  return (
    <Box className={className}>
      <StyledDropdownMemo
        name='name'
        label=''
        value={name}
        required={false}
        disabled={false}
        onChange={({ target }) => {
          const val = target.value;
          setName(val);
          setType(filters[val][0]);
          setValue('');
        }}
        onBlur={() => {
          /* noop */
        }}
        choices={fieldNames}
        error={false}
        errorMsg=''
        hasChanged={false}
      />
      <StyledDropdown
        name='type'
        label=''
        value={type}
        required={false}
        disabled={false}
        onChange={({ target }) => {
          setType(target.value);
        }}
        onBlur={() => {
          /* noop */
        }}
        choices={filterChoices}
        error={false}
        errorMsg=''
        hasChanged={false}
      />
      {type !== 'exists' && !enumValue && !useDynamicAutocomplete && (
        <StyledTextField
          name='value'
          value={value}
          type={textFieldInputType}
          error={false}
          errorMsg=''
          inputProps={inputProps}
          InputProps={{}}
          hasChanged={false}
          onChange={({ target }) => {
            let { value } = target;
            if (textFieldInputType === 'datetime-local') {
              value = value.replace('T', ' ');
            }

            setValue(value);
          }}
        />
      )}
      {type !== 'exists' && useDynamicAutocomplete && selectOptions && (
        <StyledDynamicAutocomplete
          name='value'
          label=''
          value={value}
          choices={{}}
          multiple={false}
          required={false}
          disabled={false}
          onChange={({ target }) => {
            setValue(target.value);
          }}
          onBlur={() => {
            /* noop */
          }}
          selectOptions={selectOptions}
          error={false}
          errorMsg=''
          hasChanged={false}
        />
      )}
      {type !== 'exists' && enumValue && !useDynamicAutocomplete && (
        <StyledDropdown
          name='value'
          label=''
          value={value}
          required={false}
          disabled={false}
          onChange={({ target }) => {
            setValue(target.value);
          }}
          onBlur={() => {
            /* noop */
          }}
          choices={enumValue as DropdownChoices}
          error={false}
          errorMsg=''
          hasChanged={false}
        />
      )}
      {isLast && (
        <TonalButton onClick={updateCriteria}>
          <AddIcon />

          {mobile && _('Add')}
        </TonalButton>
      )}
      {!isLast && (
        <LightButton
          onClick={() => {
            removeRow(idx);
          }}
        >
          <DeleteOutlineIcon />
        </LightButton>
      )}
    </Box>
  );
}

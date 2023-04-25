import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import {
  LightButton,
  TonalButton,
} from '../../../../components/shared/Button/Button.styles';
import { NullablePropertyFkChoices } from '../../../../entities';
import {
  PropertyList,
  isPropertyFk,
} from '../../../../services/api/ParsedApiSpecInterface';
import {
  Dropdown,
  DropdownChoices,
  SelectProps,
} from '../../../../services/form/Field/Dropdown';
import { StyledTextField } from '../../../../services/form/Field/TextField';
import _ from '../../../../services/translations/translate';
import { CriteriaFilterValue } from '../ContentFilterDialog';
import FilterIconFactory from '../icons/FilterIconFactory';
import './ContentFilter.scoped.scss';
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
}

const StyledDropdownMemo = memo(
  Dropdown,
  (prev: SelectProps, next: SelectProps) => {
    return prev.value === next.value;
  }
);

export default function ContentFilterRow(
  props: ContentFilterRowProps
): JSX.Element {
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
  } = props;

  const [name, setName] = useState(row.name);
  const filterChoices: DropdownChoices = {};
  for (const filter of filters[name]) {
    filterChoices[filter] = FilterIconFactory({
      name: filter,
      includeLabel: true,
    });
  }

  const [type, setType] = useState(row.type);
  const [value, setValue] = useState<string>(row.value as string);

  useEffect(() => {
    setName(row.name);
    setType(row.type);
    setValue(row.value as string);
  }, [row]);

  const column = columns[name];
  let enumValue: DropdownChoices | null = null;
  if (isPropertyFk(column)) {
    enumValue = fkChoices[name] || {};
  } else if (column.enum) {
    enumValue = column.enum;
  } else if (column.type === 'boolean') {
    enumValue = {
      true: _('True'),
      false: _('False'),
    };
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
    <Box className='content-filter-row'>
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
      <StyledDropdownMemo
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
      {type !== 'exists' && !enumValue && (
        <StyledTextField
          name='value'
          value={value}
          type='text'
          error={false}
          errorMsg=''
          inputProps={{}}
          InputProps={{}}
          hasChanged={false}
          onChange={({ target }) => {
            setValue(target.value);
          }}
        />
      )}
      {type !== 'exists' && enumValue && (
        <Dropdown
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

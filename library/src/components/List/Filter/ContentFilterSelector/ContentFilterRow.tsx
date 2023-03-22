import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { NullablePropertyFkChoices } from '../../../../entities';
import {
  isPropertyFk,
  PropertyList
} from '../../../../services/api/ParsedApiSpecInterface';
import {
  DropdownChoices, SelectProps, StyledDropdown
} from '../../../../services/form/Field/Dropdown';
import { StyledTextField } from '../../../../services/form/Field/TextField';
import _ from '../../../../services/translations/translate';
import { CriteriaFilterValue } from '../ContentFilterDialog';
import FilterIconFactory from '../icons/FilterIconFactory';
import {
  StyledRowActionItem,
  StyledRowContainer,
  StyledRowItem
} from './ContentFilterSelector.styles';

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
  StyledDropdown,
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
  }
  useEffect(() => {
    const timeOutId = setTimeout(
      () => {
        if (!isLast) {
          updateCriteria();
        }
      },
      250
    );
    return () => clearTimeout(timeOutId);
  }, [name, type, value, isLast]);

  return (
    <StyledRowContainer>
      <StyledRowItem>
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
          onBlur={() => {}}
          choices={fieldNames}
          error={false}
          errorMsg=''
          hasChanged={false}
        />
      </StyledRowItem>
      <StyledRowItem>
        <StyledDropdownMemo
          name='type'
          label=''
          value={type}
          required={false}
          disabled={false}
          onChange={({ target }) => {
            setType(target.value);
          }}
          onBlur={() => {}}
          choices={filterChoices}
          error={false}
          errorMsg=''
          hasChanged={false}
        />
      </StyledRowItem>
      <StyledRowItem>
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
          <StyledDropdown
            name='value'
            label=''
            value={value}
            required={false}
            disabled={false}
            onChange={({ target }) => {
              setValue(target.value);
            }}
            onBlur={() => {}}
            choices={enumValue as DropdownChoices}
            error={false}
            errorMsg=''
            hasChanged={false}
          />
        )}
      </StyledRowItem>
      <StyledRowActionItem>
        {isLast && (
          <Button
            variant='contained'
            onClick={updateCriteria}
          >
            <AddIcon />
          </Button>
        )}
        {!isLast && (
          <Button
            variant='contained'
            onClick={() => {
              removeRow(idx);
            }}
          >
            <DeleteOutlineIcon />
          </Button>
        )}
      </StyledRowActionItem>
    </StyledRowContainer>
  );
}

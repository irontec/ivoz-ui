import SearchIcon from '@mui/icons-material/Search';
import { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import EntityService from '../../../services/entity/EntityService';
import { StyledSearchTextField } from '../../../services/form/Field/TextField/TextField.styles';

import { InputBaseComponentProps } from '@mui/material';
import { useStoreActions, useStoreState } from 'store';
import { DropdownArrayChoices, isPropertyFk } from '../../../services';
import { StyledAutocomplete } from '../../../services/form/Field/Autocomplete/Autocomplete.styles';
import useFirstColumn from './hook/useFirstColumn';
import useFirstColumnCriteria from './hook/useFirstColumnCriteria';

export interface FastSearchFieldProps {
  className?: string;
  path: string;
  entityService: EntityService;
  ignoreColumn: string | undefined;
}

const FastSearchField = (
  props: FastSearchFieldProps,
  ref: ForwardedRef<any>
): JSX.Element => {
  const { className, path, entityService, ignoreColumn } = props;

  const queryStringCriteria = useStoreState((state) => [
    ...state.route.queryStringCriteria,
  ]);
  const setQueryStringCriteria = useStoreActions((actions) => {
    return actions.route.setQueryStringCriteria;
  });

  const firstColumnCriteria = useFirstColumnCriteria({
    entityService,
    path,
    ignoreColumn,
  });

  const [firstColumnName, firstColumnSpec] = useFirstColumn({
    entityService,
    ignoreColumn,
  });

  const isFk = isPropertyFk(firstColumnSpec);
  const foreignEntities = useStoreState((state) => state.list.fkChoices);
  const fkChoices =
    (foreignEntities[firstColumnName] as DropdownArrayChoices) || [];

  const isDatetime = !isFk && firstColumnSpec.format === 'date-time';

  const initialValue = (firstColumnCriteria?.value as string) || '';
  const [value, setValue] = useState(
    isDatetime ? initialValue.replace(' ', 'T') : initialValue
  );

  const triggerSearchIfChanged = () => {
    if (!firstColumnCriteria) {
      return;
    }

    if (firstColumnCriteria.value == value) {
      return;
    }

    if (value !== '') {
      const val = isDatetime ? (value as string).replace('T', ' ') : value;
      firstColumnCriteria.value = encodeURIComponent(val);
    }

    let match = false;
    let matchIdx: string | undefined;
    for (const idx in queryStringCriteria) {
      if (queryStringCriteria[idx].name !== firstColumnCriteria.name) {
        continue;
      }

      if (queryStringCriteria[idx].type !== firstColumnCriteria.type) {
        continue;
      }

      queryStringCriteria[idx] = firstColumnCriteria;
      matchIdx = idx;
      match = true;
      break;
    }

    if (!match) {
      queryStringCriteria.push(firstColumnCriteria);
    } else if (value === '' && matchIdx) {
      queryStringCriteria.splice(parseInt(matchIdx, 10), 1);
    }

    setQueryStringCriteria(queryStringCriteria);
  };

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { value } = target;
    setValue(value);
  };

  useEffect(() => {
    //reset value
    setValue((firstColumnCriteria?.value as string) || '');
  }, [firstColumnCriteria]);

  useEffect(() => {
    if (isDatetime) {
      return;
    }

    const timeOutId = setTimeout(() => {
      triggerSearchIfChanged();
      return;
    }, 2000);
    return () => clearTimeout(timeOutId);
  }, [value, firstColumnCriteria]);

  if (isFk) {
    return (
      <StyledAutocomplete
        className={className}
        name='fast_search'
        label=''
        placeholder='Search'
        value={value}
        multiple={false}
        required={false}
        disabled={false}
        onChange={changeHandler}
        onBlur={() => {
          /* noop */
        }}
        choices={fkChoices}
        disableClearable={false}
        hasChanged={false}
        InputProps={{
          startAdornment: <SearchIcon />,
        }}
      />
    );
  }

  let type = 'text';
  const inputProps = {} as InputBaseComponentProps;

  if (isDatetime) {
    type = 'datetime-local';
    inputProps.step = 1;
  }

  return (
    <StyledSearchTextField
      name='fast_search'
      type={type}
      error={false}
      value={value}
      errorMsg=''
      inputProps={inputProps}
      InputProps={{
        startAdornment: <SearchIcon />,
      }}
      onBlur={() => {
        if (!isDatetime) {
          return;
        }

        triggerSearchIfChanged();
      }}
      onKeyDown={(event) => {
        if (event.code !== 'Enter') {
          return;
        }

        triggerSearchIfChanged();
      }}
      placeholder='Search'
      hasChanged={false}
      onChange={changeHandler}
      ref={ref}
    />
  );
};

export default forwardRef(FastSearchField);

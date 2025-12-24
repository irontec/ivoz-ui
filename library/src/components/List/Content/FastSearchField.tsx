import SearchIcon from '@mui/icons-material/Search';
import { ForwardedRef, forwardRef, useEffect, useMemo, useState } from 'react';
import EntityService from '../../../services/entity/EntityService';
import { StyledSearchTextField } from '../../../services/form/Field/TextField/TextField.styles';

import { InputBaseComponentProps } from '@mui/material';
import { useStoreActions, useStoreState } from 'store';
import { DropdownArrayChoices, isPropertyFk } from '../../../services';
import { StyledAutocomplete } from '../../../services/form/Field/Autocomplete/Autocomplete.styles';
import { StyledDynamicAutocomplete } from '../../../services/form/Field/DynamicAutocomplete/DynamicAutocomplete.styles';
import useFirstColumn from './hook/useFirstColumn';
import useFirstColumnCriteria from './hook/useFirstColumnCriteria';
import StoreContainer from '../../../store/StoreContainer';
import { SelectOptionsType } from '../../../entities/EntityInterface';

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

  const storeQueryStringCriteria = useStoreState(
    (state) => state.route.queryStringCriteria
  );
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

  const [selectOptions, setSelectOptions] = useState<
    SelectOptionsType | undefined
  >(undefined);

  const { useDynamicAutocomplete, entityName } = useMemo(() => {
    if (!isFk) {
      return { useDynamicAutocomplete: false, entityName: '' };
    }

    const entities = StoreContainer.store.getState().entities.entities;
    const entName = firstColumnSpec.$ref?.replace('#/definitions/', '') || '';
    const entity = entities?.[entName];

    return {
      useDynamicAutocomplete: entity?.dynamicSelectOptions || false,
      entityName: entName,
    };
  }, [isFk, firstColumnSpec]);

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

    const queryStringCriteria = [...storeQueryStringCriteria];
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

    const queryStringCriteriaWithoutPagination = queryStringCriteria.filter(
      (criteria) => criteria.name !== '_page'
    );

    setQueryStringCriteria(queryStringCriteriaWithoutPagination);
  };

  const changeHandler = ({ target }: { target: { value: any } }) => {
    setValue(target.value);
  };

  useEffect(() => {
    //reset value
    setValue(decodeURIComponent(firstColumnCriteria?.value as string) || '');
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

  if (isFk && useDynamicAutocomplete) {
    return (
      <StyledDynamicAutocomplete
        name='fast_search'
        label=''
        className={className}
        value={value}
        choices={{}}
        multiple={false}
        required={false}
        disabled={false}
        onChange={changeHandler}
        onBlur={() => {
          /* noop */
        }}
        selectOptions={selectOptions}
        error={false}
        errorMsg=''
        hasChanged={false}
      />
    );
  }

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

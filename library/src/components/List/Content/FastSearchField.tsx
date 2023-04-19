import SearchIcon from '@mui/icons-material/Search';
import { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import EntityService from '../../../services/entity/EntityService';
import { StyledSearchTextField } from '../../../services/form/Field/TextField/TextField.styles';

import 'ListContent.scoped.scss';
import { useStoreActions, useStoreState } from 'store';

interface FastSearchFieldProps {
  path: string;
  entityService: EntityService;
  ignoreColumn: string | undefined;
}

const FastSearchField = (
  props: FastSearchFieldProps,
  ref: ForwardedRef<any>
): JSX.Element => {
  const { path, entityService, ignoreColumn } = props;

  const queryStringCriteria = useStoreState((state) => [
    ...state.route.queryStringCriteria,
  ]);
  const setQueryStringCriteria = useStoreActions((actions) => {
    return actions.route.setQueryStringCriteria;
  });

  const columns = entityService.getCollectionColumns();
  const firstColumnKey = Object.keys(columns).find(
    (columnKey) => columnKey !== ignoreColumn
  ) as string;

  const filters = entityService.getPropertyFilters(firstColumnKey, path);
  const filter = filters[0];

  const currentCriteria = queryStringCriteria.find((criteria) => {
    return criteria.name === firstColumnKey && criteria.type === filter;
  });
  const [value, setValue] = useState(currentCriteria?.value || '');

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { value } = target;
    setValue(value);
  };

  useEffect(() => {
    //reset value
    setValue(currentCriteria?.value || '');
  }, [currentCriteria]);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (currentCriteria) {
        if (currentCriteria.value == value) {
          return;
        }

        if (value !== '') {
          currentCriteria.value = value;
        } else {
          for (const idx in queryStringCriteria) {
            if (queryStringCriteria[idx] === currentCriteria) {
              queryStringCriteria.splice(parseInt(idx, 10), 1);
              break;
            }
          }
        }

        setQueryStringCriteria(queryStringCriteria);

        return;
      }

      if (!value) {
        return;
      }

      queryStringCriteria.push({
        name: firstColumnKey,
        type: filter,
        value,
      });
      setQueryStringCriteria(queryStringCriteria);
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [value, currentCriteria]);

  return (
    <StyledSearchTextField
      name='fast_search'
      type='text'
      error={false}
      value={value}
      errorMsg=''
      inputProps={{}}
      InputProps={{
        startAdornment: <SearchIcon />,
      }}
      placeholder='Search'
      hasChanged={false}
      onChange={changeHandler}
      ref={ref}
    />
  );
};

export default forwardRef(FastSearchField);

import SearchIcon from '@mui/icons-material/Search';
import { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import EntityService from '../../../services/entity/EntityService';
import { StyledSearchTextField } from '../../../services/form/Field/TextField/TextField.styles';

import { useStoreActions, useStoreState } from 'store';
import useFirstColumnCriteria from './hook/useFirstColumnCriteria';

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

  const firstColumnCriteria = useFirstColumnCriteria({
    entityService,
    path,
    ignoreColumn,
  });

  const [value, setValue] = useState(firstColumnCriteria?.value || '');

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const { value } = target;
    setValue(value);
  };

  useEffect(() => {
    //reset value
    setValue(firstColumnCriteria?.value || '');
  }, [firstColumnCriteria]);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (firstColumnCriteria) {
        if (firstColumnCriteria.value == value) {
          return;
        }

        if (value !== '') {
          firstColumnCriteria.value = encodeURIComponent(value);
        }

        let match = false;
        for (const idx in queryStringCriteria) {
          if (queryStringCriteria[idx].name !== firstColumnCriteria.name) {
            continue;
          }

          if (queryStringCriteria[idx].type !== firstColumnCriteria.type) {
            continue;
          }

          queryStringCriteria[idx] = firstColumnCriteria;
          match = true;
          break;
        }

        if (!match) {
          queryStringCriteria.push(firstColumnCriteria);
        }

        setQueryStringCriteria(queryStringCriteria);

        return;
      }
    }, 1000);
    return () => clearTimeout(timeOutId);
  }, [value, firstColumnCriteria]);

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

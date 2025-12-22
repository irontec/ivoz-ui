import { Menu, useMediaQuery, useTheme } from '@mui/material';
import { CancelToken } from 'axios';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { PathMatch } from 'react-router-dom';
import EntityService from '../../../services/entity/EntityService';
import { useStoreActions, useStoreState } from '../../../store';
import { StyledContentFilterSelector } from './ContentFilterSelector/ContentFilterSelector.styles';
import { FilterCriteria } from './FilterCriteria';
import { SearchFilterType } from './icons/FilterIconFactory';

export interface CriteriaFilterValue {
  name: string;
  type: SearchFilterType;
  value: string | number | boolean;
}

export type CriteriaFilterValues = Array<CriteriaFilterValue>;

interface ContentFilterDialogProps {
  entityService: EntityService;
  path: string;
  preloadData: boolean;
  ignoreColumn: string | undefined;
  cancelToken: CancelToken;
  match: PathMatch;
  anchorEl: null | HTMLElement;
  setAnchorEl: Dispatch<SetStateAction<null | HTMLElement>>;
}

export function ContentFilterDialog(
  props: ContentFilterDialogProps
): JSX.Element | null {
  const {
    entityService,
    path,
    preloadData,
    ignoreColumn,
    cancelToken,
    match,
    anchorEl,
    setAnchorEl,
  } = props;

  const queryStringCriteria = useStoreState(
    (state) => state.route.queryStringCriteria
  );
  const foreignEntities = useStoreState((state) => state.list.fkChoices);
  const setQueryStringCriteria = useStoreActions((actions) => {
    return actions.route.setQueryStringCriteria;
  });
  const setFkChoices = useStoreActions((actions) => {
    return actions.list.setFkChoices;
  });

  const mobile = useMediaQuery(useTheme().breakpoints.down('md'));
  const [loading, setLoading] = useState<boolean>(true);

  const foreignKeyGetterLoader = entityService.getEntity().foreignKeyGetter;

  useEffect(() => {
    if (!loading) {
      return;
    }

    if (!preloadData && !Boolean(anchorEl)) {
      return;
    }

    foreignKeyGetterLoader().then((foreignKeyGetter) => {
      foreignKeyGetter({
        entityService,
        cancelToken,
        match,
        filterContext: true,
      }).then((foreignEntities: any) => {
        setFkChoices(foreignEntities);
        setLoading(false);
      });
    });
  }, [
    preloadData,
    anchorEl,
    loading,
    foreignKeyGetterLoader,
    entityService,
    cancelToken,
    match,
  ]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const commitCriteria = (data: CriteriaFilterValues) => {
    handleClose();

    const sanitizeData = data.map((row) => {
      return {
        ...row,
        value: encodeURIComponent(row.value),
      };
    });

    setQueryStringCriteria(sanitizeData);
  };

  const removeFilter = (index: number) => {
    const newCriteria = [...queryStringCriteria];
    newCriteria.splice(index, 1);
    setQueryStringCriteria(newCriteria);
  };

  return (
    <>
      <Menu
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledContentFilterSelector
          entityService={entityService}
          fkChoices={foreignEntities}
          ignoreColumn={ignoreColumn}
          path={path}
          commitCriteria={commitCriteria}
          close={handleClose}
        />
      </Menu>
      {!mobile && (
        <FilterCriteria
          entityService={entityService}
          fkChoices={foreignEntities}
          removeFilter={removeFilter}
          path={path}
        />
      )}
    </>
  );
}

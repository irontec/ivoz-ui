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

  const queryStringCriteria: CriteriaFilterValues = useStoreState(
    (state) => state.route.queryStringCriteria
  );
  const setQueryStringCriteria = useStoreActions((actions) => {
    return actions.route.setQueryStringCriteria;
  });

  const mobile = useMediaQuery(useTheme().breakpoints.down('md'));
  const [loading, setLoading] = useState<boolean>(true);
  const [foreignEntities, setForeignEntities] = useState<any>({});
  const [criteria, setCriteria] =
    useState<CriteriaFilterValues>(queryStringCriteria);

  useEffect(() => {
    setCriteria(queryStringCriteria);
  }, [queryStringCriteria, setCriteria]);

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
        setForeignEntities(foreignEntities);
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
    setQueryStringCriteria(data);
  };

  const removeFilter = (index: number) => {
    const newCriteria = [...criteria];
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

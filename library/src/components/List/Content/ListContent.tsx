import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box } from '@mui/system';
import { CancelToken } from 'axios';
import { Location } from 'history';
import { ForwardedRef, createRef, forwardRef, useEffect } from 'react';
import { PathMatch } from 'react-router-dom';
import { useStoreActions, useStoreState } from 'store';
import { EntityItem, RouteMapItem } from '../../../router/routeMapParser';
import EntityService, {
  EntityValues,
} from '../../../services/entity/EntityService';
import _ from '../../../services/translations/translate';
import Pagination from '../Pagination';
import ContentCard from './Card/ContentCard';
import ListContentHeader from './ListContentHeader';
import { StyledContentTable } from './Table/ContentTable.styles';
import useMultiselectState from './Table/hook/useMultiselectState';
import { StyledEmpty } from './Empty.styles';

export interface ListContentProps {
  childEntities: Array<RouteMapItem>;
  path: string;
  entityService: EntityService;
  ignoreColumn: string | undefined;
  preloadData: boolean;
  cancelToken: CancelToken;
  match: PathMatch;
  routeChain: Array<EntityItem>;
  location: Location<Record<string, string> | undefined>;
  className?: string;
  empty: boolean;
}

const ListContent = (
  props: ListContentProps,
  ref: ForwardedRef<any>
): JSX.Element => {
  const {
    childEntities,
    path,
    entityService,
    ignoreColumn,
    preloadData,
    cancelToken,
    match,
    routeChain,
    location,
    className,
    empty,
  } = props;

  const listRef = createRef();
  const mobile = useMediaQuery(useTheme().breakpoints.down('md'));

  const [selectedValues, handleChange, setSelectedValues] =
    useMultiselectState();
  const rows = useStoreState((state) => state.list.rows);

  const selectAllHandler = () => {
    const rowIds = rows.map((row) => row.id?.toString() || '');
    setSelectedValues(rowIds);
  };

  const parentRow = useStoreState((state) => state.list.parentRow);
  const setParentRow = useStoreActions((state) => state.list.setParentRow);
  const apiGet = useStoreActions((actions) => {
    return actions.api.get;
  });

  useEffect(() => {
    if (!parentRow) {
      if (Object.values(match.params).length === 0) {
        return;
      }

      const parentRoute = routeChain[routeChain.length - 2];
      if (!parentRoute) {
        return;
      }

      const matchValues = Object.values(match.params);
      const path = parentRoute.entity.path + '/' + matchValues.pop();

      apiGet({
        path,
        params: {},
        successCallback: async (data) => {
          setParentRow(data as EntityValues);
        },
        cancelToken,
      });
    }
  }, [parentRow, match]);

  if (empty) {
    return <StyledEmpty entityService={entityService} className={className} />;
  }

  return (
    <>
      <Box className={className}>
        {mobile && (
          <ListContentHeader
            path={path}
            entityService={entityService}
            ignoreColumn={ignoreColumn}
            preloadData={preloadData}
            cancelToken={cancelToken}
            match={match}
            location={location}
            selectedValues={selectedValues}
            mobile={true}
            parentRow={parentRow}
            ref={ref}
          />
        )}
        <Box className='card'>
          {!mobile && (
            <ListContentHeader
              path={path}
              entityService={entityService}
              ignoreColumn={ignoreColumn}
              preloadData={preloadData}
              cancelToken={cancelToken}
              match={match}
              location={location}
              selectedValues={selectedValues}
              parentRow={parentRow}
              ref={ref}
            />
          )}

          {!mobile && (
            <Box sx={{ overflowX: 'auto' }}>
              <StyledContentTable
                entityService={entityService}
                ignoreColumn={ignoreColumn}
                path={path}
                childEntities={childEntities}
                selectedValues={selectedValues}
                handleChange={handleChange}
                setSelectedValues={setSelectedValues}
              />
            </Box>
          )}
          {mobile && (
            <Box>
              <ContentCard
                selectedValues={selectedValues}
                handleChange={handleChange}
                entityService={entityService}
                ignoreColumn={ignoreColumn}
                path={path}
                childEntities={childEntities}
              />
            </Box>
          )}
        </Box>
      </Box>
      <Box component={'footer'}>
        {mobile && (
          <a onClick={selectAllHandler} className='link'>
            {_('Select all')}
          </a>
        )}
        <Box className='pagination'>
          <Pagination listRef={listRef} />
        </Box>
      </Box>
    </>
  );
};

export default forwardRef(ListContent);

import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box } from '@mui/system';
import { CancelToken } from 'axios';
import { Location } from 'history';
import { ForwardedRef, forwardRef } from 'react';
import { PathMatch } from 'react-router-dom';
import { RouteMapItem } from '../../../router/routeMapParser';
import EntityService from '../../../services/entity/EntityService';
import ContentCard from './Card/ContentCard';
import ListContentHeader from './ListContentHeader';
import { StyledContentTable } from './Table/ContentTable.styles';
import useMultiselectState from './Table/hook/useMultiselectState';

export interface ListContentProps {
  childEntities: Array<RouteMapItem>;
  path: string;
  entityService: EntityService;
  ignoreColumn: string | undefined;
  preloadData: boolean;
  cancelToken: CancelToken;
  match: PathMatch;
  location: Location<Record<string, string> | undefined>;
  className?: string;
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
    location,
    className,
  } = props;

  const mobile = useMediaQuery(useTheme().breakpoints.down('md'));

  const [selectedValues, handleChange, setSelectedValues] =
    useMultiselectState();

  return (
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
          ref={ref}
          mobile={true}
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
  );
};

export default forwardRef(ListContent);

import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box } from '@mui/system';
import { CancelToken } from 'axios';
import { Location } from 'history';
import React, { ForwardedRef, forwardRef } from 'react';
import { PathMatch } from 'react-router-dom';
import { RouteMapItem } from '../../../router/routeMapParser';
import EntityService from '../../../services/entity/EntityService';
import ContentCard from './Card/ContentCard';
import ListContentHeader from './ListContentHeader';
import ContentTable from './Table/ContentTable';
import useMultiselectState from './Table/hook/useMultiselectState';

interface ListContentProps {
  childEntities: Array<RouteMapItem>;
  path: string;
  entityService: EntityService;
  ignoreColumn: string | undefined;
  preloadData: boolean;
  cancelToken: CancelToken;
  match: PathMatch;
  location: Location<Record<string, string> | undefined>;
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
  } = props;

  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('md'));

  const [selectedValues, handleChange, setSelectedValues] =
    useMultiselectState();

  return (
    <React.Fragment>
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

      {bigScreen && (
        <Box>
          <ContentTable
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
      {!bigScreen && (
        <Box>
          <ContentCard
            entityService={entityService}
            ignoreColumn={ignoreColumn}
            path={path}
            childEntities={childEntities}
          />
        </Box>
      )}
    </React.Fragment>
  );
};

export default forwardRef(ListContent);

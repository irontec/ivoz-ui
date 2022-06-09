import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Box } from '@mui/system';
import { CancelToken } from 'axios';
import { Location } from 'history';
import React, { ForwardedRef, forwardRef } from 'react';
import { match } from 'react-router-dom';
import EntityInterface from '../../../entities/EntityInterface';
import { RouteMapItem } from '../../../router/routeMapParser';
import EntityService from '../../../services/entity/EntityService';
import ContentCard from './Card/ContentCard';
import ListContentHeader from './ListContentHeader';
import ContentTable from './Table/ContentTable';

interface ListContentProps {
  childEntities: Array<RouteMapItem>,
  path: string,
  entityService: EntityService,
  rows: any,
  ignoreColumn: string | undefined,
  preloadData: boolean,
  cancelToken: CancelToken,
  match: match,
  location: Location<Record<string, string> | undefined>,
  parentEntity: EntityInterface | undefined,
}

const ListContent = forwardRef((props: ListContentProps, ref: ForwardedRef<any>): JSX.Element => {
  const {
    childEntities,
    path,
    entityService,
    rows,
    ignoreColumn,
    preloadData,
    cancelToken,
    match,
    location,
    parentEntity,
  } = props;

  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('md'));

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
        parentEntity={parentEntity}
      />

      {bigScreen && <Box>
        <ContentTable
          entityService={entityService}
          rows={rows}
          ignoreColumn={ignoreColumn}
          path={path}
          childEntities={childEntities}
        />
      </Box>}
      {!bigScreen && <Box>
        <ContentCard
          entityService={entityService}
          rows={rows}
          ignoreColumn={ignoreColumn}
          path={path}
          childEntities={childEntities}
        />
      </Box>}
    </React.Fragment >
  );
});

export default ListContent;
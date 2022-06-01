import React, { useState } from 'react';
import { match, useLocation } from 'react-router-dom';
import { CancelToken } from 'axios';
import { Box } from '@mui/system';
import { Tooltip, Fab, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import QueueIcon from '@mui/icons-material/Queue';
import SearchIcon from '@mui/icons-material/Search';
import { ContentFilter } from '../../../components/List/Filter/ContentFilter';
import EntityService from '../../../services/entity/EntityService';
import _ from '../../../services/translations/translate';
import { StyledActionButtonContainer, StyledLink, StyledFab } from './ListContent.styles';
import ContentTable from './Table/ContentTable';
import ContentCard from './Card/ContentCard';
import { RouteMapItem } from '../../../router/routeMapParser';

interface ListContentProps {
  childEntities: Array<RouteMapItem>,
  path: string,
  entityService: EntityService,
  rows: any,
  ignoreColumn: string | undefined,
  preloadData: boolean,
  cancelToken: CancelToken,
  match: match,
}

export default function ListContent(props: ListContentProps): JSX.Element {
  const {
    childEntities,
    path,
    entityService,
    rows,
    ignoreColumn,
    preloadData,
    cancelToken,
    match,
  } = props;

  const location = useLocation();
  const acl = entityService.getAcls();
  const entity = entityService.getEntity();
  const [showFilters, setShowFilters] = useState(false);
  const handleFiltersClose = () => {
    setShowFilters(false);
  };

  const filterButtonHandler = (/*event: MouseEvent<HTMLButtonElement>*/) => {
    setShowFilters(!showFilters);
  };

  const theme = useTheme();
  const bigScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <React.Fragment>
      <StyledActionButtonContainer>
        <div>
          <h3 style={{
            margin: 0,
            fontSize: '1.6em',
            fontWeight: 400,
          }}>
            List of {entity.title}
          </h3>
        </div>
        <div>
          <Tooltip title={_('Search')} arrow>
            <StyledFab onClick={filterButtonHandler}>
              <SearchIcon />
            </StyledFab>
          </Tooltip>
          {acl.create && <StyledLink to={`${location.pathname}/create`}>
            <Tooltip title="Add" enterTouchDelay={0} arrow>
              <Fab color="secondary" size="small" variant="extended">
                <QueueIcon />
              </Fab>
            </Tooltip>
          </StyledLink>}
        </div>
      </StyledActionButtonContainer>

      <ContentFilter
        entityService={entityService}
        open={showFilters}
        handleClose={handleFiltersClose}
        path={path}
        preloadData={preloadData}
        ignoreColumn={ignoreColumn}
        cancelToken={cancelToken}
        match={match}
      />

      {bigScreen && <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <ContentTable
          entityService={entityService}
          rows={rows}
          ignoreColumn={ignoreColumn}
          path={path}
          childEntities={childEntities}
        />
      </Box>}
      {!bigScreen && <Box sx={{ display: { xs: 'block', md: 'none' } }}>
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
}
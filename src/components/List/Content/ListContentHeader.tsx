import QueueIcon from '@mui/icons-material/Queue';
import SearchIcon from '@mui/icons-material/Search';
import { Fab, Tooltip } from '@mui/material';
import { CancelToken } from 'axios';
import { Location } from 'history';
import React, { ForwardedRef, forwardRef, useState } from 'react';
import { match } from 'react-router-dom';
import { ContentFilter } from '../../../components/List/Filter/ContentFilter';
import EntityInterface from '../../../entities/EntityInterface';
import EntityService from '../../../services/entity/EntityService';
import _ from '../../../services/translations/translate';
import useParentIden from './hook/useParentIden';
import { StyledActionButtonContainer, StyledFab, StyledLink } from './ListContent.styles';

interface ListContentProps {
  path: string,
  entityService: EntityService,
  ignoreColumn: string | undefined,
  preloadData: boolean,
  cancelToken: CancelToken,
  match: match,
  location: Location<Record<string, string> | undefined>,
  parentEntity: EntityInterface | undefined,
}

const ListContentHeader = forwardRef((props: ListContentProps, ref: ForwardedRef<any>): JSX.Element => {
  const {
    path,
    entityService,
    ignoreColumn,
    preloadData,
    cancelToken,
    match,
    location,
    parentEntity,
  } = props;

  const acl = entityService.getAcls();
  const entity = entityService.getEntity();
  const [showFilters, setShowFilters] = useState(false);
  const handleFiltersClose = () => {
    setShowFilters(false);
  };

  const filterButtonHandler = () => {
    setShowFilters(!showFilters);
  };

  let iden = useParentIden({
    match,
    location,
    parentEntity,
    cancelToken,
  });

  return (
    <React.Fragment>
      <StyledActionButtonContainer>
        <div ref={ref}>
          <h3 style={{
            margin: 0,
            fontSize: '1.5em',
            fontWeight: 400,
          }}>
            List of {entity.title} {iden && (<span>({iden})</span>)}
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
    </React.Fragment >
  );
});

export default ListContentHeader;
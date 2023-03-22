import QueueIcon from '@mui/icons-material/Queue';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Fab, Tooltip } from '@mui/material';
import { CancelToken } from 'axios';
import { Location } from 'history';
import React, { ForwardedRef, forwardRef, useState } from 'react';
import { PathMatch } from 'react-router-dom';
import { StyledSearchTextField } from '../../../services/form/Field/TextField/TextField.styles';
import { useStoreState } from 'store';
import { MultiSelectFunctionComponent } from '../../../router';
import EntityService from '../../../services/entity/EntityService';
import _ from '../../../services/translations/translate';
import { ContentFilterDialog } from '../Filter/ContentFilterDialog';
import DeleteRowsButton from './CTA/DeleteRowsButton';
import { StyledActionButtonContainer, StyledLink } from './ListContent.styles';

interface ListContentProps {
  path: string;
  entityService: EntityService;
  ignoreColumn: string | undefined;
  preloadData: boolean;
  cancelToken: CancelToken;
  match: PathMatch;
  location: Location<Record<string, string> | undefined>;
  selectedValues: string[];
}

const ListContentHeader = (
  props: ListContentProps,
  ref: ForwardedRef<any>
): JSX.Element => {
  const {
    path,
    entityService,
    ignoreColumn,
    preloadData,
    cancelToken,
    match,
    location,
    selectedValues,
  } = props;

  const entity = entityService.getEntity();
  const acl = entityService.getAcls();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rows = useStoreState((state) => state.list.rows);

  const multiselectActions = Object.values(entity.customActions)
    .filter((action) => action.multiselect)
    .map((item) => item.action as MultiSelectFunctionComponent);
  const multiselect =
    entityService.getAcls().delete === true || multiselectActions.length > 0;

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <React.Fragment>
      <StyledActionButtonContainer ref={ref}>
        <Box className='buttons'>
          <StyledSearchTextField
            name='fast_search'
            type='text'
            error={false}
            errorMsg=''
            inputProps={{}}
            InputProps={{
              startAdornment: <SearchIcon />,
            }}
            placeholder="Search"
            hasChanged={false}
            onChange={({ target }) => {
              console.log(target.value);
            }}
          />
          <Tooltip title={_('Search')} arrow>
            <Button
              color='secondary'
              size='small'
              variant='contained'
              onClick={handleOpenMenu}
            >
              <SearchIcon />
            </Button>
          </Tooltip>
          <ContentFilterDialog
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            entityService={entityService}
            path={path}
            preloadData={preloadData}
            ignoreColumn={ignoreColumn}
            cancelToken={cancelToken}
            match={match}
          />
        </Box>
        <Box className='buttons'>
          {multiselect &&
            multiselectActions.map((Action, key) => {
              return (
                <Button
                  key={key}
                  variant='contained'
                  disabled={selectedValues.length < 1}
                  sx={{
                    verticalAlign: 'inherit',
                    marginLeft: '10px',
                    padding: 0,
                  }}
                >
                  <Action
                    style={{ padding: '6px 18px 0' }}
                    rows={rows}
                    selectedValues={selectedValues}
                    entityService={entityService}
                  />
                </Button>
              );
            })}
          <Button
            variant='contained'
            disabled={selectedValues.length < 1}
            sx={{
              verticalAlign: 'inherit',
              marginLeft: '10px',
              padding: 0,
              paddingTop: 0.5,
            }}
          >
            <DeleteRowsButton
              selectedValues={selectedValues}
              entityService={entityService}
            />
          </Button>
          {acl.create && (
            <StyledLink to={`${location.pathname}/create`}>
              <Tooltip title='Add' enterTouchDelay={0} arrow>
                <Fab color='secondary' size='small' variant='extended'>
                  <QueueIcon />
                </Fab>
              </Tooltip>
            </StyledLink>
          )}
        </Box>
      </StyledActionButtonContainer>
    </React.Fragment>
  );
};

export default forwardRef(ListContentHeader);

import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Tooltip } from '@mui/material';
import { CancelToken } from 'axios';
import { Location } from 'history';
import React, { ForwardedRef, forwardRef, useState } from 'react';
import { PathMatch } from 'react-router-dom';
import { useStoreState } from 'store';
import { MultiSelectFunctionComponent } from '../../../router';
import EntityService from '../../../services/entity/EntityService';
import { StyledSearchTextField } from '../../../services/form/Field/TextField/TextField.styles';
import _ from '../../../services/translations/translate';
import { ContentFilterDialog } from '../Filter/ContentFilterDialog';
import DeleteRowsButton from './CTA/DeleteRowsButton';
import { StyledActionButtonContainer, StyledLink } from './ListContent.styles';
import { MultiselectMoreChildEntityLinks } from './Shared/MultiselectMoreChildEntityLinks';

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

  let multiselectActionNum = multiselectActions.length;
  if (acl.delete) {
    multiselectActionNum++;
  }

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
            placeholder='Search'
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
            multiselectActionNum < 2 &&
            multiselectActions.map((Action, key) => {
              return (
                <Button
                  key={key}
                  variant='contained'
                  disabled={selectedValues.length < 1}
                >
                  <Action
                    rows={rows}
                    selectedValues={selectedValues}
                    entityService={entityService}
                  />
                </Button>
              );
            })}
          {multiselect && multiselectActionNum > 1 && (
            <MultiselectMoreChildEntityLinks
              childActions={multiselectActions}
              selectedValues={selectedValues}
              rows={rows}
              entityService={entityService}
              deleteMapItem={
                acl.delete && {
                  entity,
                  route: `${entity.path}/:id`,
                }
              }
            />
          )}
          {acl.delete && multiselectActionNum < 2 && (
            <Button variant='contained' disabled={selectedValues.length < 1}>
              <DeleteRowsButton
                selectedValues={selectedValues}
                entityService={entityService}
              />
            </Button>
          )}
          {acl.create && (
            <StyledLink to={`${location.pathname}/create`}>
              <Tooltip title='Add' enterTouchDelay={0} arrow>
                <Button variant='contained'>
                  <AddIcon />
                  {_('Add')}
                </Button>
              </Tooltip>
            </StyledLink>
          )}
        </Box>
      </StyledActionButtonContainer>
    </React.Fragment>
  );
};

export default forwardRef(ListContentHeader);

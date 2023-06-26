import AddIcon from '@mui/icons-material/Add';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { Badge, Box, Tooltip } from '@mui/material';
import { CancelToken } from 'axios';
import { Location } from 'history';
import React, { ForwardedRef, forwardRef, useState } from 'react';
import { PathMatch } from 'react-router-dom';
import { useStoreState } from 'store';
import {
  SolidButton,
  TonalButton,
} from '../../../components/shared/Button/Button.styles';
import {
  GlobalFunctionComponent,
  MultiSelectFunctionComponent,
} from '../../../router';
import EntityService from '../../../services/entity/EntityService';
import _ from '../../../services/translations/translate';
import { ContentFilterDialog } from '../Filter/ContentFilterDialog';
import DeleteRowsButton from './CTA/DeleteRowsButton';
import { StyledActionButtonContainer, StyledLink } from './ListContent.styles';
import { MultiselectMoreChildEntityLinks } from './Shared/MultiselectMoreChildEntityLinks';

import FastSearchField from './FastSearchField';

interface ListContentProps {
  path: string;
  entityService: EntityService;
  ignoreColumn: string | undefined;
  preloadData: boolean;
  cancelToken: CancelToken;
  match: PathMatch;
  location: Location<Record<string, string> | undefined>;
  selectedValues: string[];
  mobile?: boolean;
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
    mobile,
  } = props;

  const entity = entityService.getEntity();
  const disableMultiDelete = entity.disableMultiDelete || false;

  const acl = entityService.getAcls();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rows = useStoreState((state) => state.list.rows);

  const globalAndMultiselectActions = Object.values(
    entity.customActions
  ).filter((action) => action.multiselect || action.global);

  const multiselectOrGlobal =
    entityService.getAcls().delete === true ||
    globalAndMultiselectActions.length > 0;

  let actionNum = globalAndMultiselectActions.length;
  if (acl.delete) {
    actionNum++;
  }

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const queryStringCriteria = useStoreState(
    (state) => state.route.queryStringCriteria
  );

  return (
    <StyledActionButtonContainer ref={ref} className={'list-content-header'}>
      <Box className='buttons start'>
        <FastSearchField
          path={path}
          entityService={entityService}
          ignoreColumn={ignoreColumn}
        />
        <Tooltip title={_('Advanced search')} arrow>
          <Badge
            color='error'
            variant='dot'
            invisible={!mobile || queryStringCriteria.length == 0}
          >
            <TonalButton onClick={handleOpenMenu}>
              <TuneRoundedIcon />
            </TonalButton>
          </Badge>
        </Tooltip>
        <Box className='filter-chips'>
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
      </Box>
      <Box className='buttons end'>
        {multiselectOrGlobal &&
          actionNum < 2 &&
          globalAndMultiselectActions
            .map(
              (item) =>
                item.action as
                  | MultiSelectFunctionComponent
                  | GlobalFunctionComponent
            )
            .map((Action, key) => {
              return (
                <Action
                  key={key}
                  rows={rows}
                  selectedValues={selectedValues}
                  entityService={entityService}
                />
              );
            })}
        {multiselectOrGlobal && actionNum > 1 && (
          <MultiselectMoreChildEntityLinks
            childActions={globalAndMultiselectActions}
            selectedValues={selectedValues}
            rows={rows}
            entityService={entityService}
            deleteMapItem={
              acl.delete &&
              !disableMultiDelete && {
                entity,
                route: `${entity.path}/:id`,
              }
            }
          />
        )}
        {acl.delete && actionNum < 2 && !disableMultiDelete && (
          <DeleteRowsButton
            selectedValues={selectedValues}
            entityService={entityService}
          />
        )}
        {acl.create && (
          <StyledLink to={`${location.pathname}/create`}>
            <Tooltip title='Add' enterTouchDelay={0} arrow>
              <SolidButton>
                <AddIcon />
                {!mobile && _('Add')}
              </SolidButton>
            </Tooltip>
          </StyledLink>
        )}
      </Box>
    </StyledActionButtonContainer>
  );
};

export default forwardRef(ListContentHeader);

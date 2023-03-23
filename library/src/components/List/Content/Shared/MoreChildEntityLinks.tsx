import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuItem from '@mui/material/MenuItem';
import { StyledMenu } from '../../../shared/Menu/Menu.styles';
import React from 'react';
import useCurrentPathMatch from '../../../../hooks/useCurrentPathMatch';
import {
  isActionItem,
  isEntityItem,
  isSingleRowActionItem,
  RouteMapItem,
} from '../../../../router';
import EntityService from '../../../../services/entity/EntityService';
import DeleteRowButton from '../CTA/DeleteRowButton';
import {
  StyledTableRowCustomCta,
  StyledTableRowEntityCta,
} from '../Table/ContentTable.styles';
import buildLink from './BuildLink';

interface MoreChildEntityLinksProps {
  childEntities: Array<RouteMapItem>;
  row: Record<string, any>;
  entityService: EntityService;
  deleteMapItem?: RouteMapItem | false;
}

export const MoreChildEntityLinks = (props: MoreChildEntityLinksProps) => {
  const { childEntities, row, entityService, deleteMapItem } = props;

  const match = useCurrentPathMatch();
  const entity = entityService.getEntity();
  const ChildDecorator = entity.ChildDecorator;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <StyledTableRowCustomCta onClick={handleClick}>
        <MoreHorizIcon />
      </StyledTableRowCustomCta>
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {childEntities.map((routeMapItem, key: number) => {
          if (
            isActionItem(routeMapItem) &&
            isSingleRowActionItem(routeMapItem, routeMapItem.action)
          ) {
            return (
              <MenuItem key={key}>
                <routeMapItem.action
                  match={match}
                  row={row}
                  entityService={entityService}
                  variant='text'
                />
              </MenuItem>
            );
          }

          if (!isEntityItem(routeMapItem)) {
            return null;
          }

          const title = routeMapItem.entity.title as JSX.Element;
          const link = buildLink({
            link: routeMapItem.route || '',
            id: row.id,
            params: match.params,
          });

          return (
            <MenuItem key={key}>
              <ChildDecorator key={key} routeMapItem={routeMapItem} row={row}>
                <StyledTableRowEntityCta
                  to={link}
                  parentEntity={entity}
                  parentRow={row}
                >
                  {title}
                </StyledTableRowEntityCta>
              </ChildDecorator>
            </MenuItem>
          );
        })}
        {deleteMapItem && (
          <MenuItem>
            <ChildDecorator routeMapItem={deleteMapItem} row={row}>
              <DeleteRowButton
                variant='text'
                row={row}
                entityService={entityService}
              />
            </ChildDecorator>
          </MenuItem>
        )}
      </StyledMenu>
    </>
  );
};

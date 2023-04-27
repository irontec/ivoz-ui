import MenuItem from '@mui/material/MenuItem';
import useCurrentPathMatch from '../../../../hooks/useCurrentPathMatch';
import {
  isActionItem,
  isEntityItem,
  isSingleRowActionItem,
  RouteMapItem,
} from '../../../../router';
import EntityService, {
  EntityValues,
} from '../../../../services/entity/EntityService';
import DeleteRowButton from '../CTA/DeleteRowButton';
import { StyledTableRowEntityCta } from '../Table/ContentTable.styles';
import buildLink from './BuildLink';
import { MoreChildEntityLinksWrapper } from './MoreChildEntityLinksWrapper';

interface MoreChildEntityLinksProps {
  childEntities: Array<RouteMapItem>;
  row: EntityValues;
  entityService: EntityService;
  deleteMapItem?: RouteMapItem | false;
}

export const MoreMenuItem = MenuItem;

export const MoreChildEntityLinks = (props: MoreChildEntityLinksProps) => {
  const { childEntities, row, entityService, deleteMapItem } = props;

  const match = useCurrentPathMatch();
  const entity = entityService.getEntity();
  const ChildDecorator = entity.ChildDecorator;

  return (
    <MoreChildEntityLinksWrapper>
      {childEntities.map((routeMapItem, key: number) => {
        if (
          isActionItem(routeMapItem) &&
          isSingleRowActionItem(routeMapItem, routeMapItem.action)
        ) {
          return (
            <routeMapItem.action
              key={key}
              match={match}
              row={row}
              entityService={entityService}
              variant='text'
            />
          );
        }

        if (!isEntityItem(routeMapItem)) {
          return null;
        }

        const title = routeMapItem.entity.title as JSX.Element;
        const link = buildLink({
          link: routeMapItem.route || '',
          id: `${row.id}`,
          params: match.params,
        });

        console.log('title', title);
        debugger;

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
    </MoreChildEntityLinksWrapper>
  );
};

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
import { StyledTableRowChildEntityLink } from '../Table/ContentTable.styles';
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
  const isEditable = row.editable ?? true;

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

        const baseUrl = process.env.BASE_URL || '/';
        const title = routeMapItem.entity.title as JSX.Element;
        const link = buildLink({
          link: `${baseUrl}${routeMapItem.route?.substring(1)}`,
          id: `${row.id}`,
          params: match.params,
        });
        return (
          <MoreMenuItem key={key}>
            <ChildDecorator
              key={key}
              variant='text'
              routeMapItem={routeMapItem}
              row={row}
              entityService={entityService}
              disabled={routeMapItem.disabled}
            >
              <StyledTableRowChildEntityLink
                to={link}
                parentEntity={entity}
                parentRow={row}
              >
                {title}
              </StyledTableRowChildEntityLink>
            </ChildDecorator>
          </MoreMenuItem>
        );
      })}
      {deleteMapItem && (
        <ChildDecorator
          variant='text'
          routeMapItem={deleteMapItem}
          row={row}
          entityService={entityService}
          disabled={deleteMapItem.disabled || !isEditable}
        >
          <DeleteRowButton
            variant='text'
            row={row}
            entityService={entityService}
            disabled={deleteMapItem?.disabled || !isEditable}
          />
        </ChildDecorator>
      )}
    </MoreChildEntityLinksWrapper>
  );
};

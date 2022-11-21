import { Tooltip } from '@mui/material';
import useCurrentPathMatch from '../../../../hooks/useCurrentPathMatch';
import {
  isActionItem,
  isSingleRowActionItem,
  isEntityItem,
  RouteMapItem,
} from '../../../../router/routeMapParser';
import EntityService from '../../../../services/entity/EntityService';
import {
  StyledTableRowCustomCta,
  StyledTableRowEntityCta,
} from '../Table/ContentTable.styles';
import buildLink from './BuildLink';

type ChildEntityLinksProps = {
  childEntities: Array<RouteMapItem>;
  row: Record<string, any>;
  entityService: EntityService;
};

const ChildEntityLinks = (props: ChildEntityLinksProps): JSX.Element => {
  const { entityService, childEntities, row } = props;

  const match = useCurrentPathMatch();

  const entity = entityService.getEntity();
  const ChildDecorator = entity.ChildDecorator;

  return (
    <>
      {childEntities.map((routeMapItem, key: number) => {
        if (
          isActionItem(routeMapItem) &&
          isSingleRowActionItem(routeMapItem, routeMapItem.action)
        ) {
          return (
            <StyledTableRowCustomCta key={key}>
              <routeMapItem.action
                match={match}
                row={row}
                entityService={entityService}
              />
            </StyledTableRowCustomCta>
          );
        }

        if (!isEntityItem(routeMapItem)) {
          return null;
        }

        const Icon = routeMapItem.entity.icon as React.FunctionComponent;
        const title = routeMapItem.entity.title as JSX.Element;
        const link = buildLink({
          link: routeMapItem.route || '',
          id: row.id,
          params: match.params,
        });

        return (
          <ChildDecorator key={key} routeMapItem={routeMapItem} row={row}>
            <Tooltip title={title} placement='bottom-start' enterTouchDelay={0}>
              <StyledTableRowEntityCta
                to={link}
                parentEntity={entity}
                parentRow={row}
              >
                <Icon />
              </StyledTableRowEntityCta>
            </Tooltip>
          </ChildDecorator>
        );
      })}
    </>
  );
};

export default ChildEntityLinks;

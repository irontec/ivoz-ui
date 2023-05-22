import useCurrentPathMatch from '../../../../hooks/useCurrentPathMatch';
import {
  RouteMapItem,
  isActionItem,
  isEntityItem,
  isSingleRowActionItem,
} from '../../../../router/routeMapParser';
import EntityService from '../../../../services/entity/EntityService';
import DeleteRowButton from '../CTA/DeleteRowButton';
import ChildEntityLink from './ChildEntityLink';
import { MoreChildEntityLinks } from './MoreChildEntityLinks';

type ChildEntityLinksProps = {
  childEntities: Array<RouteMapItem>;
  row: Record<string, any>;
  entityService: EntityService;
  detail?: React.ReactNode;
  edit?: React.ReactNode;
  deleteMapItem?: RouteMapItem | false;
};

const ChildEntityLinks = (props: ChildEntityLinksProps): JSX.Element => {
  const { entityService, childEntities, row, detail, edit, deleteMapItem } =
    props;

  const match = useCurrentPathMatch();

  const entity = entityService.getEntity();
  const ChildDecorator = entity.ChildDecorator;

  let firstActionButtonNum = 0;
  if (detail || edit) {
    firstActionButtonNum = 1;
  }

  const childEntitiesCopy = [...childEntities];
  const visibleChildEntities = childEntitiesCopy.splice(
    0,
    2 - firstActionButtonNum
  );

  return (
    <>
      {detail}
      {edit}
      {visibleChildEntities.map((routeMapItem, key: number) => {
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
            />
          );
        }

        if (!isEntityItem(routeMapItem)) {
          return null;
        }

        return (
          <ChildDecorator key={key} routeMapItem={routeMapItem} row={row}>
            <ChildEntityLink
              routeMapItem={routeMapItem}
              row={row}
            />
          </ChildDecorator>
        );
      })}
      {childEntitiesCopy.length === 0 && deleteMapItem && (
        <ChildDecorator routeMapItem={deleteMapItem} row={row}>
          <DeleteRowButton row={row} entityService={entityService} />
        </ChildDecorator>
      )}
      {childEntitiesCopy.length > 0 && (
        <MoreChildEntityLinks
          childEntities={childEntitiesCopy}
          row={row}
          entityService={entityService}
          deleteMapItem={deleteMapItem}
        />
      )}
    </>
  );
};

export default ChildEntityLinks;

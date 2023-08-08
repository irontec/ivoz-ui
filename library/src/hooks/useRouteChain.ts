import { PathMatch } from 'react-router-dom';
import { EntityItem, RouteMap, filterRouteMapPath, isActionItem } from '../router';

type useRouteChainProps = {
  routeMap: RouteMap,
  match: PathMatch
};

const useRouteChain = (
  props: useRouteChainProps
): Array<EntityItem> => {

  const {routeMap, match} = props;
  const filteredRouteMapPath = filterRouteMapPath(routeMap, match);

  const routeItems: Array<EntityItem> = filteredRouteMapPath?.entity
    ? [
        {
          entity: filteredRouteMapPath.entity,
          route: filteredRouteMapPath.route,
        },
      ]
    : [];

  let child = filteredRouteMapPath?.children?.[0];

  while (child) {
    if (isActionItem(child)) {
      break;
    }

    routeItems.push({ entity: child.entity, route: child.route });
    child = child.children?.[0];
  }

  return routeItems;
};

export default useRouteChain;

import { List, Create, Edit, View } from '../components';
import ParsedApiSpecInterface from '../services/api/ParsedApiSpecInterface';
import EntityService from '../services/entity/EntityService';
import EntityInterface from '../entities/EntityInterface';
import {
  isActionItem,
  isEntityItem,
  isRouteMapBlock,
  RouteMap,
  RouteMapItem,
} from './routeMapParser';

export interface EntityList {
  [name: string]: Readonly<EntityInterface>;
}

export type RouteSpec = {
  key: string;
  path: string;
  entity: EntityInterface;
  component: React.ComponentClass<any, any> | React.FunctionComponent<any>;
};

const parseRouteMapItems = (
  apiSpec: ParsedApiSpecInterface,
  items: RouteMapItem[],
  routeMap: RouteMap
): RouteSpec[] => {
  const routes: Array<RouteSpec> = [];

  for (const routeMapItem of items) {
    if (isActionItem(routeMapItem)) {
      continue;
    }

    const { entity, route, children } = routeMapItem;
    if (!entity || !route) {
      continue;
    }

    const iden = entity.iden;

    let acls = entity.acl;
    if (apiSpec[iden]) {
      const entityService = new EntityService(
        apiSpec[iden].actions,
        apiSpec[iden].properties,
        entity
      );
      acls = entityService.getAcls();
    }

    if (acls.read) {
      routes.push({
        key: `${iden}-list`,
        path: `${route}`,
        entity: entity,
        component: List,
      });
    }

    if (acls.create) {
      routes.push({
        key: `${iden}-create`,
        path: `${route}/create`,
        entity: entity,
        component: Create,
      });
    }

    if (acls.update) {
      routes.push({
        key: `${iden}-update`,
        path: `${route}/:id/update`,
        entity: entity,
        component: Edit,
      });
    } else if (acls.detail) {
      routes.push({
        key: `${iden}-detailed`,
        path: `${route}/:id/detailed`,
        entity: entity,
        component: View,
      });
    }

    if (children && children.length) {
      const childRoutes = parseRouteMapItems(apiSpec, children, routeMap);
      routes.push(...childRoutes);
    }
  }

  return routes;
};

const parseRoutes = (
  apiSpec: ParsedApiSpecInterface,
  routeMap: RouteMap
): RouteSpec[] => {
  const routes: Array<RouteSpec> = [];
  for (const entity of routeMap) {
    if (isRouteMapBlock(entity)) {
      if (!entity.children) {
        continue;
      }

      const childrenRoutes = parseRouteMapItems(
        apiSpec,
        entity.children,
        routeMap
      );
      routes.push(...childrenRoutes);
    } else if (isEntityItem(entity)) {
      const childrenRoutes = parseRouteMapItems(apiSpec, [entity], routeMap);
      routes.push(...childrenRoutes);
    }
  }

  return routes;
};

export default parseRoutes;

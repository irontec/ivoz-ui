import { PathMatch } from 'react-router-dom';
import EntityInterface from '../entities/EntityInterface';
import {
  EntityItem,
  RouteMap,
  RouteMapBlock,
  RouteMapItem,
  isActionItem,
  isEntityItem,
  isRouteMapBlock,
} from './routeMapParser';

const matchRoute = (
  route: EntityItem,
  match: PathMatch,
  includeChildren = false
): EntityItem | undefined => {
  const baseUrl = process.env.BASE_URL || '/';

  const routePaths = [
    baseUrl + route.route?.substring(1),
    baseUrl + route.route?.substring(1) + '/create',
    baseUrl + route.route?.substring(1) + '/:id/update',
    baseUrl + route.route?.substring(1) + '/:id/detailed',
  ];

  if (routePaths.includes(match.pattern.path)) {
    const resp: RouteMapItem = { ...route };
    if (!includeChildren) {
      delete resp.children;
    }

    return resp;
  }
};

const _filterRoutePathItems = (
  route: RouteMapItem,
  match: PathMatch,
  includeChildren = false
): EntityItem | undefined => {
  if (isActionItem(route)) {
    return undefined;
  }

  if (route.children) {
    for (const child of route.children) {
      const resp = _filterRoutePathItems(child, match, includeChildren);
      if (resp) {
        return {
          ...route,
          children: [resp],
        };
      }
    }
  }

  return matchRoute(route, match, includeChildren);
};

export const filterRouteMapPath = (
  routeMap: RouteMap,
  match: PathMatch
): EntityItem | undefined => {
  for (const item of routeMap) {
    if (isRouteMapBlock(item)) {
      for (const child of item.children) {
        const resp = _filterRoutePathItems(child, match, false);
        if (resp) {
          return resp;
        }
      }
    } else if (isEntityItem(item)) {
      const resp = _filterRoutePathItems(item as EntityItem, match, false);
      if (resp) {
        return resp;
      }
    }
  }
};

const _findRoute = (
  route: RouteMapItem,
  match: PathMatch
): EntityItem | undefined => {
  if (isActionItem(route)) {
    return undefined;
  }

  if (route.children) {
    for (const child of route.children) {
      const resp = _findRoute(child, match);
      if (resp) {
        return resp;
      }
    }
  }

  return matchRoute(route, match, true);
};

const findRoute = (
  routeMap: RouteMap,
  match: PathMatch
): EntityItem | undefined => {
  for (const item of routeMap) {
    if (isRouteMapBlock(item) || (isEntityItem(item) && item.children)) {
      for (const child of (item as RouteMapBlock).children) {
        const resp = _findRoute(child, match);
        if (resp) {
          return resp;
        }
      }
    }

    if (isEntityItem(item as unknown as RouteMapItem)) {
      const resp = _filterRoutePathItems(item as EntityItem, match, true);
      if (resp) {
        return resp;
      }
    }
  }
};

export const findParentEntity = (
  routeMap: RouteMap,
  match: PathMatch
): EntityInterface | undefined => {
  const parentPattern = match.pattern.path.split('/').slice(0, -2).join('/');
  if (!parentPattern) {
    return;
  }

  for (const item of routeMap) {
    if (isRouteMapBlock(item)) {
      for (const child of item.children) {
        const resp = _findRoute(child, {
          ...match,
          pattern: {
            ...match.pattern,
            path: parentPattern,
          },
        });
        if (resp) {
          return resp.entity;
        }
      }
    } else if (isEntityItem(item)) {
      const resp = _findRoute(item, {
        ...match,
        pattern: {
          ...match.pattern,
          path: parentPattern,
        },
      });

      if (resp) {
        return resp.entity;
      }
    }
  }
};

export default findRoute;

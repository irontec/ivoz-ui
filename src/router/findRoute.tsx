import {
  isActionItem,
  RouteMap,
  RouteMapItem,
  EntityItem,
} from './routeMapParser';
import { PathMatch } from 'react-router-dom';
import EntityInterface from '../entities/EntityInterface';

const matchRoute = (
  route: EntityItem,
  match: PathMatch,
  includeChildren = false
): EntityItem | undefined => {
  const routePaths = [
    route.route,
    route.route + '/create',
    route.route + '/:id/update',
    route.route + '/:id/detailed',
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
  match: PathMatch
): EntityItem | undefined => {
  if (isActionItem(route)) {
    return undefined;
  }

  if (route.children) {
    for (const child of route.children) {
      const resp = _filterRoutePathItems(child, match);
      if (resp) {
        return {
          ...route,
          children: [resp],
        };
      }
    }
  }

  return matchRoute(route, match);
};

export const filterRouteMapPath = (
  routeMap: RouteMap,
  match: PathMatch
): EntityItem | undefined => {
  for (const item of routeMap) {
    for (const child of item.children) {
      const resp = _filterRoutePathItems(child, match);
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
    for (const child of item.children) {
      const resp = _findRoute(child, match);
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
  }
};

export default findRoute;

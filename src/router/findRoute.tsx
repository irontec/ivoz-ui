import { isActionItem, RouteMap, RouteMapItem, EntityItem } from './routeMapParser';
import { match } from 'react-router-dom';
import EntityInterface from '../entities/EntityInterface';

const matchRoute = (route: EntityItem, match: match, includeChildren = false): EntityItem | undefined => {

    const routePaths = [
        route.route,
        route.route + '/create',
        route.route + '/:id/update',
        route.route + '/:id/detailed',
    ];

    if (routePaths.includes(match.path)) {

        const resp: RouteMapItem = { ...route };
        if (!includeChildren) {
            delete resp.children;
        }

        return resp;
    }
};

const _filterRoutePathItems = (route: RouteMapItem, match: match): EntityItem | undefined => {

    if(isActionItem(route)) {
        return undefined;
    }

    if (route.children) {
        for (const child of route.children) {

            const resp = _filterRoutePathItems(child, match);
            if (resp) {
                return {
                    ...route,
                    children: [
                        resp
                    ]
                };
            }
        }
    }

    return matchRoute(route, match);
}

export const filterRouteMapPath = (routeMap: RouteMap, match: match): EntityItem | undefined => {

    for (const item of routeMap) {
        for (const child of item.children) {
            const resp = _filterRoutePathItems(child, match);
            if (resp) {
                return resp;
            }
        }
    }
}

const _findRoute = (route: RouteMapItem, match: match): EntityItem | undefined => {

    if(isActionItem(route)) {
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
}

const findRoute = (routeMap: RouteMap, match: match): EntityItem | undefined => {
    for (const item of routeMap) {
        for (const child of item.children) {
            const resp = _findRoute(child, match);
            if (resp) {
                return resp;
            }
        }
    }
}

export const findParentEntity = (routeMap: RouteMap, match: match): EntityInterface | undefined => {

    const parentPath = match.path.split('/').slice(0, -2).join('/');

    for (const item of routeMap) {
        for (const child of item.children) {
            const resp = _findRoute(child, {...match, path: parentPath});
            if (resp) {
                return resp.entity;
            }
        }
    }
}

export default findRoute;
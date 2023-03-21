import { Action, action } from 'easy-peasy';
import { RouteObject } from 'react-router-dom';

interface RoutesState {
  routes: RouteObject[];
}

interface RoutesActions {
  setRoutes: Action<RoutesState, RouteObject[]>;
}

export type RoutesStore = RoutesState & RoutesActions;

const routes: RoutesStore = {
  routes: [],
  setRoutes: action<RoutesState, RouteObject[]>((state, routes) => {
    const simplifiedRoutes = routes.map((item) => ({path: item.path} as RouteObject));
    state.routes = simplifiedRoutes;
  }),
};

export default routes;

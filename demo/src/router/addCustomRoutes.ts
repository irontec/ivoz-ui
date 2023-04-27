import { RouteSpec } from '@irontec/ivoz-ui';

import BlankComponent from '../components/Blank';
import BlankComponent2 from '../components/Blank2';

const addCustomRoutes = (routes: Array<RouteSpec>): Array<RouteSpec> => {
  const blankRoute = routes.find((route) => route.key === 'Blank-list');

  if (blankRoute) {
    blankRoute.component = BlankComponent;
  }

  const blankRoute2 = routes.find((route) => route.key === 'Blank2-list');

  if (blankRoute2) {
    blankRoute2.component = BlankComponent2;
  }

  return routes;
};

export default addCustomRoutes;

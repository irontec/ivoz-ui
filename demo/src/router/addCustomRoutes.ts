import { RouteSpec } from '@irontec/ivoz-ui';
import BlankComponent from '../components/Blank';

const addCustomRoutes = (routes: Array<RouteSpec>): Array<RouteSpec> => {
  const blankRoute = routes.find(
    (route) => route.key === 'Blank-list'
  );

  if (blankRoute) {
    blankRoute.component = BlankComponent;
  }

  return routes;
};

export default addCustomRoutes;

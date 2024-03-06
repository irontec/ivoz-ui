import { Create, Detail, Edit, RouteSpec } from '@irontec/ivoz-ui';
import Client from 'entities/Client/Client';
import Platform from 'entities/Platform/Platform';

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

  routes.push({
    component: Detail,
    entity: Platform,
    key: 'platform-detailed',
    path: `${Platform.path}/:id/detailed`,
  });

  routes.push({
    component: Edit,
    entity: {
      ...Platform,
      localPath: '/platform_edit_only',
    },
    key: 'EditOnlyPlatform-edit',
    path: '/platform_edit_only/:id',
  });

  routes.push({
    component: Edit,
    entity: {
      ...Client,
      localPath: '/client_edit_only',
    },
    key: 'EditOnlyClient-edit',
    path: '/client_edit_only/:id',
  });

  routes.push({
    component: Detail,
    entity: {
      ...Client,
      localPath: '/client_view_only',
    },
    key: 'ReadOnlyClient-view',
    path: '/client_view_only/:id',
  });

  routes.push({
    component: Create,
    entity: {
      ...Client,
      localPath: '/client_create_only',
    },
    key: 'CreateOnlyClient-edit',
    path: '/client_create_only',
  });

  return routes;
};

export default addCustomRoutes;

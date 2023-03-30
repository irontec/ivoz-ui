import Dashboard from '@irontec/ivoz-ui/components/Dashboard';
import parseRoutes, { RouteSpec } from '@irontec/ivoz-ui/router/parseRoutes';
import RouteContent from '@irontec/ivoz-ui/router/RouteContent';
import ParsedApiSpecInterface from '@irontec/ivoz-ui/services/api/ParsedApiSpecInterface';
import Login from 'components/Login';
import { useEffect } from 'react';
import { RouteObject, useRoutes } from 'react-router-dom';
import { useStoreActions, useStoreState } from 'store';

import addCustomRoutes from './addCustomRoutes';
import AppRouteContentWrapper from './AppRouteContentWrapper';
import getEntityMap from './EntityMap';

export interface AppRoutesProps {
  apiSpec: ParsedApiSpecInterface;
}

export default function AppRoutes(props: AppRoutesProps): React.ReactNode {
  const { apiSpec } = props;

  const loggedIn = useStoreState((state) => state.auth.loggedIn);
  const setRoutes = useStoreActions((actions) => actions.routes.setRoutes);
  const entityMap = getEntityMap();

  if (!loggedIn) {
    return <Login />;
  }

  const routes: RouteObject[] = [
    {
      path: '/',
      element: (
        <AppRouteContentWrapper loggedIn={loggedIn} routeMap={entityMap}>
          <Dashboard routeMap={entityMap} />
        </AppRouteContentWrapper>
      ),
    },
  ];

  const routeSpecs = addCustomRoutes(parseRoutes(apiSpec, entityMap));

  routeSpecs.map((route: RouteSpec) => {
    routes.push({
      path: route.path,
      element: (
        <AppRouteContentWrapper loggedIn={loggedIn} routeMap={entityMap}>
          <RouteContent route={route} routeMap={entityMap} {...props} />
        </AppRouteContentWrapper>
      ),
    });
  });

  useEffect(() => {
    setRoutes(routes);
  }, [routes]);

  return useRoutes(routes);
}

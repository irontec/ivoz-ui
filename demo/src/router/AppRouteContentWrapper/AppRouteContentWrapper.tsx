import 'AppRouteContentWrapper.scoped.scss';

import { Header, Menu } from '@irontec/ivoz-ui/components/layout';
import { RouteMap } from '@irontec/ivoz-ui/router/routeMapParser';
import { Box, useMediaQuery, useTheme } from '@mui/material';

interface AppRouteContentProps {
  routeMap: RouteMap;
  loggedIn: boolean;
  children: JSX.Element;
}

export default function AppRouteContentWrapper(
  props: AppRouteContentProps
): JSX.Element {
  const { loggedIn, routeMap, children } = props;

  return (
    <>
      <Box className='app-wrapper'>
        <Menu routeMap={routeMap} />
        <Box component='main'>
          <Box component='header' className='breadcrumb'>
            {loggedIn && <Header routeMap={routeMap} />}
          </Box>
          <Box className='route-content'>{children}</Box>
        </Box>
      </Box>
    </>
  );
}

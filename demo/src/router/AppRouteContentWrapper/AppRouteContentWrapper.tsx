import { Box, Toolbar } from '@mui/material';
import { Header, Menu, Footer } from '@irontec/ivoz-ui/components/layout';
import { RouteMap } from '@irontec/ivoz-ui/router/routeMapParser';

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
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ display: 'flex' }}>
          <Menu routeMap={routeMap} />
        </Box>
        <Box component='main' sx={{ display: 'block', padding: 3 }}>
          <Box>
            {loggedIn && <Header routeMap={routeMap} />}
          </Box>
          <Box>
            {children}
          </Box>
        </Box>
      </Box>
      <Box>
        <Footer />
      </Box>
    </>
  );
}

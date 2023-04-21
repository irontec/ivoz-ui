import { Box } from '@mui/material';
import { RouteMap } from '../../router/routeMapParser';
import { Header, Menu } from '../layout';
import Loading from '../layout/Loading/Loading';

export interface AppRouteContentProps {
  routeMap: RouteMap;
  loggedIn: boolean;
  children: JSX.Element;
  className?: string;
}

export default function AppRouteContentWrapper(
  props: AppRouteContentProps
): JSX.Element {
  const { loggedIn, routeMap, children, className } = props;

  return (
    <div className={className}>
      <Loading />
      <Box className='app-wrapper'>
        <Menu routeMap={routeMap} />
        <Box component='main'>
          <Box component='header' className='breadcrumb'>
            {loggedIn && <Header routeMap={routeMap} />}
          </Box>

          <Box component='section'>{children}</Box>
        </Box>
      </Box>
    </div>
  );
}

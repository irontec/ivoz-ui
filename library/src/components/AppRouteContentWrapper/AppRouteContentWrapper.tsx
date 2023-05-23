import { Box, IconButton } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useStoreActions, useStoreState } from 'store';
import { RouteMap } from '../../router/routeMapParser';
import { Header, Menu } from '../layout';
import Loading from '../layout/Loading/Loading';
import { StyledCloseIcon } from '../shared/Message.styles';

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

  const clearFlassMsg = useStoreActions((actions) => actions.flashMsg.clear);
  const flassMsg = useStoreState((state) => state.flashMsg.msg);
  const flassMsgType = useStoreState((state) => state.flashMsg.type);

  return (
    <div className={className}>
      <Loading />
      <Box className='app-wrapper'>
        <Menu routeMap={routeMap} />
        <Box component='main'>
          <Box component='header' className='breadcrumb'>
            {loggedIn && <Header routeMap={routeMap} />}
          </Box>
          {flassMsg && (
            <MuiAlert
              severity={flassMsgType}
              action={
                <IconButton
                  aria-label='close'
                  color='inherit'
                  onClick={() => {
                    clearFlassMsg();
                  }}
                >
                  <StyledCloseIcon />
                </IconButton>
              }
            >
              {flassMsg}
            </MuiAlert>
          )}
          <Box component='section'>{children}</Box>
        </Box>
      </Box>
    </div>
  );
}

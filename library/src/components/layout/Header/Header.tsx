import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LightButton } from '../../../components/shared/Button/Button.styles';
import { RouteMap } from '../../../router/routeMapParser';
import { useStoreActions } from '../../../store';
import Settings from './Settings/Settings';
import Avatar from './Avatar/Avatar';
import Breadcrumbs from './Breadcrumbs';
import './Header.scoped.scss';

interface headerProps {
  routeMap: RouteMap;
  children?: React.ReactNode;
}

export default function Header(props: headerProps): JSX.Element {
  const { routeMap, children } = props;
  const resetAuth = useStoreActions((actions) => actions.auth.resetAll);
  const toggleVisibility = useStoreActions(
    (actions) => actions.menu.toggleVisibility
  );
  const handleLogout = () => {
    resetAuth();
  };

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box className='menu-container'>
      <Box className='start'>
        <Breadcrumbs desktop={desktop} routeMap={routeMap} />
      </Box>

      <Box className='end'>
        {desktop && (
          <>
            <Settings />

            <Avatar>
              <MenuItem key='logout' onClick={handleLogout}>
                <Typography textAlign='center'>Logout</Typography>
              </MenuItem>
            </Avatar>
          </>
        )}

        {!desktop && (
          <LightButton
            onClick={() => {
              toggleVisibility();
            }}
          >
            <MenuIcon />
          </LightButton>
        )}
      </Box>
    </Box>
  );
}

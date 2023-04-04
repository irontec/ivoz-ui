import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Button,
  MenuItem,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LightButton } from '../../../components/shared/Button/Button.styles';
import { RouteMap } from '../../../router/routeMapParser';
import { useStoreActions } from '../../../store';
import AccountSettings from './AccountSettings/AccountSettings';
import Breadcrumbs from './Breadcrumbs';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import './Header.scoped.scss';

interface headerProps {
  routeMap: RouteMap;
  children?: React.ReactNode;
  customAvatar?: JSX.Element;
}

export default function Header(props: headerProps): JSX.Element {
  const { routeMap, children, customAvatar } = props;
  const resetAuth = useStoreActions((actions) => actions.auth.resetAll);
  const handleLogout = () => {
    resetAuth();
  };

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  if (!desktop) {
  }

  return (
    <Box className='menu-container'>
      <Box className='start'>
        <Breadcrumbs desktop={desktop} routeMap={routeMap} />

        {false && (
          <a className='back-mobile'>
            <NavigateBeforeRoundedIcon /> Breadcrumb movil
          </a>
        )}
      </Box>

      <Box className='end'>
        {desktop && (
          <>
            <AccountSettings customAvatar={customAvatar}>
              {children || (
                <MenuItem key='logout' onClick={handleLogout}>
                  <Typography textAlign='center'>Logout</Typography>
                </MenuItem>
              )}
            </AccountSettings>

            <Tooltip title='Account'>
              <Box className='account'>AL</Box>
            </Tooltip>
          </>
        )}

        {!desktop && (
          <LightButton>
            <MenuIcon />
          </LightButton>
        )}
      </Box>
    </Box>
  );
}

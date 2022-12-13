import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { RouteMap } from '../../router/routeMapParser';
import { useStoreActions } from '../../store';
import Breadcrumbs from './Breadcrumbs';
import {
  StyledAppBar,
  StyledHeaderContainer,
  StyledToolbar,
} from './Header.styles';
import LanguageSelector, {
  Languages,
} from './LanguageSelector/LanguageSelector';

interface headerProps {
  loggedIn: boolean;
  routeMap: RouteMap;
  children?: React.ReactNode;
  customAvatar?: JSX.Element;
  languages?: Languages;
}

export default function Header(props: headerProps): JSX.Element {
  const { loggedIn, routeMap, children, customAvatar, languages } = props;
  const resetAuth = useStoreActions((actions) => actions.auth.resetAll);
  const handleLogout = () => {
    resetAuth();
  };

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <StyledHeaderContainer>
      <StyledAppBar position='fixed'>
        <StyledToolbar>
          {loggedIn && (
            <Box sx={{ flexGrow: 1 }}>
              <Breadcrumbs routeMap={routeMap} />
            </Box>
          )}
          {loggedIn && (
            <Box sx={{ flexGrow: 0 }}>
              {languages && <LanguageSelector languages={languages} />}
              <Tooltip title='Open settings'>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  {customAvatar || (
                    <Avatar sx={{ bgcolor: 'white', color: 'primary.main' }}>
                      <ManageAccountsIcon />
                    </Avatar>
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {children || (
                  <MenuItem key='logout' onClick={handleLogout}>
                    <Typography textAlign='center'>Logout</Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          )}
        </StyledToolbar>
      </StyledAppBar>
    </StyledHeaderContainer>
  );
}

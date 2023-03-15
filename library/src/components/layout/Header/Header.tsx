import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Box, IconButton, MenuItem, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { RouteMap } from '../../../router/routeMapParser';
import { useStoreActions, useStoreState } from '../../../store';
import Breadcrumbs from '../Breadcrumbs';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { StyledAvatar, StyledMenu } from './styles';

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
  const languages = useStoreState((state) => state.i18n.languages);

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Breadcrumbs routeMap={routeMap} />
        <Box>
          {languages && <LanguageSelector languages={languages} />}
          <Tooltip title='Open settings'>
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{ padding: 0, margin: '0 10px 10px' }}
            >
              {customAvatar || (
                <StyledAvatar>
                  <ManageAccountsIcon />
                </StyledAvatar>
              )}
            </IconButton>
          </Tooltip>
          <StyledMenu
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
          </StyledMenu>
        </Box>
      </Box>
    </>
  );
}

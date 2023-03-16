import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { MenuItem, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useStoreActions } from 'store';
import { StyledButton } from '../styles';
import { StyledMenu } from './styles/Menu.styles';

interface AccountSettingsProps {
  children?: React.ReactNode;
  customAvatar?: JSX.Element;
}

export default function AccountSettings(
  props: AccountSettingsProps
): JSX.Element {
  const { children, customAvatar } = props;
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
    <>
      <Tooltip title='Open settings'>
        <StyledButton onClick={handleOpenUserMenu}>
          {customAvatar || <ManageAccountsIcon />}
        </StyledButton>
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
    </>
  );
}

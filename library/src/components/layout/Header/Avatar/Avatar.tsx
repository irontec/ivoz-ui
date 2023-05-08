import { Box, MenuItem, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useStoreActions } from 'store';
import { StyledMenu } from '../Settings/styles/Menu.styles';
import _ from '../../../../services/translations/translate';
import { useStoreState } from 'store';

export interface AvatarProps {
  children?: React.ReactNode;
  className?: string;
}

const parseJwt = (token: string): { username: string } => {
  if (!token) {
    return {
      username: 'unknown',
    };
  }

  const base64Url = token.split('.')?.[1];
  const base64 = base64Url?.replace(/-/g, '+')?.replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
};

export default function Avatar(props: AvatarProps): JSX.Element {
  const { children, className } = props;
  const resetAuth = useStoreActions((actions) => actions.auth.resetAll);
  const token = useStoreState((state) => state.auth.token as string);
  const tokenPayload = parseJwt(token);
  const username = tokenPayload.username;

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
    <div className={className}>
      <Tooltip title={_('{{username}} account settings', { username })}>
        <Box onClick={handleOpenUserMenu} className='account'>
          {username.substring(0, 2).toUpperCase()}
        </Box>
      </Tooltip>
      <StyledMenu
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
            <Typography textAlign='center'>{_('Logout')}</Typography>
          </MenuItem>
        )}
      </StyledMenu>
    </div>
  );
}

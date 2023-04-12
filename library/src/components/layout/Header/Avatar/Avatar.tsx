import { Box, MenuItem, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { useStoreActions } from 'store';
import { StyledMenu } from '../Settings/styles/Menu.styles';
import _ from '../../../../services/translations/translate';
import './Avatar.scoped.scss';

interface AvatarProps {
  children?: React.ReactNode;
}

export default function Avatar(props: AvatarProps): JSX.Element {
  const { children } = props;
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
      <Tooltip title={_('Account settings')}>
        <Box onClick={handleOpenUserMenu} className='account'>
          AL
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
    </>
  );
}

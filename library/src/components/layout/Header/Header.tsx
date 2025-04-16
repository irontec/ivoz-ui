import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  LightButton,
  SolidButton,
} from '../../../components/shared/Button/Button.styles';
import { RouteMap } from '../../../router/routeMapParser';
import { useStoreActions, useStoreState } from '../../../store';
import Avatar from './Avatar';
import Breadcrumbs from './Breadcrumbs';
import Settings from './Settings/Settings';
import _ from '../../../services/translations/translate';
import { useState } from 'react';
import Logo from '../Menu/Logo';

export interface headerProps {
  routeMap: RouteMap;
  className?: string;
}

export default function Header(props: headerProps): JSX.Element {
  const { routeMap, className } = props;
  const [open, setOpen] = useState(false);
  const resetAuth = useStoreActions((actions) => actions.auth.resetAll);
  const toggleVisibility = useStoreActions(
    (actions) => actions.menu.toggleVisibility
  );
  const logo = useStoreState((state) => state.theme.logo);

  const handleLogout = () => {
    resetAuth();
  };

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const handleModal = () => {
    setOpen(!open);
  };

  return (
    <Box className={className}>
      <Box className='start'>
        <Breadcrumbs desktop={desktop} routeMap={routeMap} />
      </Box>

      <Box className='end'>
        {desktop && (
          <>
            <Settings />

            <Avatar>
              <MenuItem key='logout' onClick={handleModal}>
                <Typography textAlign='center'>{_('About')}</Typography>
              </MenuItem>
              <MenuItem key='logout' onClick={handleLogout}>
                <Typography textAlign='center'>{_('Logout')}</Typography>
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
        {open && (
          <Dialog
            open={open}
            onClose={handleModal}
            keepMounted
            aria-labelledby='dialog-about'
            aria-describedby='dialog-about'
          >
            <CloseRoundedIcon className='close-icon' onClick={handleModal} />
            <DialogContent className='dialog-about'>
              <p>
                <img src={logo || './logo.svg'} className='logo' />
              </p>
              <p>idei</p>
              <p>
                {_('Version')} 1.6.0 <br />
                {_('Last update')}: 11/03/2025
              </p>
              <p>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                  }}
                  className='logo'
                >
                  Powered by <Logo />
                </Box>
              </p>
              <p>©2025 Irontec | All rights reserved</p>
            </DialogContent>
            <DialogActions>
              <SolidButton onClick={handleModal} sx={{ width: '100%' }}>
                {_('ACCEPT')}
              </SolidButton>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Box>
  );
}

import { AppBar, AppBarProps, Toolbar } from '@mui/material';
import { styled } from '@mui/material';

export const StyledAppBar = styled((props: AppBarProps) => {
  const { position, className, children } = props;
  return (
    <AppBar position={position} className={className}>
      {children}
    </AppBar>
  );
})(({ theme }) => {
  return {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    maxWidth: '1920px',
    left: 0,
  };
});

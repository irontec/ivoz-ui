import { AppBar, AppBarProps, Theme, Toolbar } from '@mui/material';
import { styled } from '@mui/material';

export const StyledHeaderContainer = styled('div')({
  display: 'flex',
});


export const StyledAppBar = styled(
  (props: AppBarProps) => {
    const { position, className, children } = props;
    return (<AppBar position={position} className={className}>{children}</AppBar>);
  }
)(
  ({ theme }) => {
    return {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      maxWidth: '1920px',
      left: 0,
    }
  }
);

export const StyledToolbar = styled(Toolbar)(
  ({ theme }) => {

    const minHeight = '64px';

    return {
      ...theme.mixins.toolbar,
      minHeight,
      padding: '0 23px',
      '@media (min-width:600px)': {
        minHeight,
      },
    };
  }
);

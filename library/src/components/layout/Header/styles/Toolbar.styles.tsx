import { Toolbar } from '@mui/material';
import { styled } from '@mui/material';

export const StyledToolbar = styled(Toolbar)(({ theme }) => {
  const minHeight = '64px';

  return {
    ...theme.mixins.toolbar,
    minHeight,
    padding: '0 23px',
    '@media (min-width:600px)': {
      minHeight,
    },
  };
});

import MuiMenu from '@mui/material/Menu';
import { styled } from '@mui/material';

export const StyledMenu = styled(MuiMenu)(() => {
  return {
    '& .disabled': {
      color: '#aaa',
    },
    '& .MuiMenuItem-root:has(.display-none)': {
      display: 'none',
    },
  };
});

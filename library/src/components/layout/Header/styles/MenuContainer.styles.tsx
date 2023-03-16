import { Box } from '@mui/material';
import { styled } from '@mui/material';

export const StyledMenuContainer = styled(Box)(({ theme }) => {
  return {
    display: 'flex',
    justifyContent: 'space-between',
  };
});

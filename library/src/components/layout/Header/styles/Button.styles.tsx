import { Button } from '@mui/material';
import { styled } from '@mui/material';

export const StyledButton = styled(Button)(({ theme }) => {
  return {
    backgroundColor: '#ccc',
    color: theme.palette.primary.main,
    padding: 2,
    margin: 3,
  };
});

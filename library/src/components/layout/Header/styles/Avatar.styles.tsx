import { Avatar } from '@mui/material';
import { styled } from '@mui/material';

export const StyledAvatar = styled(Avatar)(({ theme }) => {
  return {
    backgroundColor: '#ccc',
    color: theme.palette.primary.main,
  };
});

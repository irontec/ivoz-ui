import HomeIcon from '@mui/icons-material/Home';
import { styled } from '@mui/material';

export const StyledHomeIcon = styled(HomeIcon)(({ theme }) => {
  return {
    marginRight: theme.spacing(0.5),
    width: 25,
    height: 25,
  };
});

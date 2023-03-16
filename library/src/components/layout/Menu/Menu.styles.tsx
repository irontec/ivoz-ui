import { Divider, styled } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import List from '@mui/material/List';

export const StyledDivider = styled(Divider)(() => {
  return {
    margin: '10px 0 10px',
    width: '90%',
  };
});

export const StyledMenuList = styled(List)(() => {
  return {
    width: '100%',
    maxWidth: 360,
  };
});

export const StyledHomeIcon = styled(HomeIcon)(({ theme }) => {
  return {
    marginRight: theme.spacing(0.5),
    width: 25,
    height: 25,
  };
});

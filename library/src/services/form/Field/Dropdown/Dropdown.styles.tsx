import { styled } from '@mui/material';
import Dropdown from './Dropdown';

export const StyledDropdown = styled(Dropdown)(({ theme }) => {
  return {
    '& > label.changed': {
      color: theme.palette.info.main,
    },
  };
});

export default StyledDropdown;

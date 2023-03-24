import { ToggleButton, styled } from '@mui/material';

const StyledToggleButton = styled(ToggleButton)(({ theme }) => {
  return {
    border: 'none',
    textTransform: 'none',
  };
});

export default StyledToggleButton;

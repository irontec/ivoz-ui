import { Button, styled } from '@mui/material';

const StyledButton = styled(Button)(({ theme }) => {
  return {
    padding: 0,
    margin: '0px 10px 10px',
    backgroundColor: '#ccc',
    color: theme.palette.primary.main,
  };
});

export default StyledButton;

import { styled } from '@mui/material';
import MenuHeader from './MenuHeader';

export const StyledMenuHeader = styled(MenuHeader)(() => {
  return {
    display: 'flex-container',
    justifyContent: 'space-between',
    paddingLeft: '20px',
    '& > *': {
      display: 'flex',
    },
    '& > p': {
      margin: '0 0 10px',
    },
    '& > button': {
      height: '25px',
      minWidth: '25px',
    },
  };
});

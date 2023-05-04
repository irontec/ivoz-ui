import { styled } from '@mui/material';
import Empty from './Empty';

export const StyledEmpty = styled(Empty)(() => {
  return {
    border: '1px solid red',
    '& span': {
      border: '1px solid black',
    },
  };
});

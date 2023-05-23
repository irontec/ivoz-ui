import { styled } from '@mui/material';
import Empty from './Empty';

export const StyledEmpty = styled(Empty)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    gap: 'var(--spacing-lg)',
    paddingTop: '80px',
    '& h3': {
      fontSize: '24px',
      margin: 0,
    },
    '& p': {
      textAlign: 'center',
      maxWidth: '600px',
      margin: 0,
    },

    '& img': {
      maxWidth: '100%',
    },
  };
});

import { Theme, styled } from '@mui/material';
import ContentFilterRow from './ContentFilterRow';

export const StyledContentFilterRow = styled(ContentFilterRow)(
  ({ theme }: { theme: Theme }) => {
    return {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-md)',

      [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
        '& button': {
          width: '100%',
        },
      },

      '& button': {
        height: '50px',
        aspectRatio: 1,
      },
    };
  }
);

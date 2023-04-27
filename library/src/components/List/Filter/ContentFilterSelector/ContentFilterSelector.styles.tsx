import { Theme, styled } from '@mui/material';
import ContentFilterSelector from './ContentFilterSelector';

export const StyledContentFilterSelector = styled(ContentFilterSelector)(
  ({ theme }: { theme: Theme }) => {
    return {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-xl)',
      padding: 'var(--spacing-lg)',
      width: '700px',
      maxWidth: '100%',
      [theme.breakpoints.down('md')]: {
        width: '320px',
      },

      '& .filters': {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
      },

      '& .actions': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
          flexWrap: 'wrap',
          gap: 'var(--spacing-md)',
        },
        '& .buttons': {
          display: 'flex',
          gap: 'var(--spacing-md)',
          '& button': {
            height: '40px',
            paddingInline: 'var(--spacing-lg)',
          },
        },
      },
    };
  }
);

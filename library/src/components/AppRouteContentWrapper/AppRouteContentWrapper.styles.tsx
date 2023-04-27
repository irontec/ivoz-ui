import { styled } from '@mui/styles';
import { Theme } from '@mui/material';
import AppRouteContentWrapper from './AppRouteContentWrapper';

export const StyledAppRouteContentWrapper = styled(AppRouteContentWrapper)(
  ({ theme }: { theme: Theme }) => {
    return {
      '& .app-wrapper': {
        height: '100vh',
        backgroundColor: 'var(--color-background)',
        backgroundImage: "url('/assets/img/bg-noise.png')",
        display: 'flex',
      },
      '& main': {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xl)',
        flex: 1,
        overflow: 'auto',
        padding: 'var(--spacing-md)',
        transition: 'var(--transition-all-1)',
        [theme.breakpoints.up('sm')]: {
          paddingInline: 'var(--spacing-xxl)',
          paddingBlock: 'var(--spacing-lg)',
        },
      },
    };
  }
);

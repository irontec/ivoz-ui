import { styled } from '@mui/styles';
import AppRouteContentWrapper from './AppRouteContentWrapper';

export const StyledAppRouteContentWrapper = styled(AppRouteContentWrapper)(
  () => {
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
        gap: 'calc(var(--spacing-md) + 4px)',
        flex: 1,
        overflow: 'auto',
        padding: 'var(--spacing-md)',
        paddingInline: 'clamp(var(--spacing-md), 2vw, var(--spacing-xxl))',
        transition: 'var(--transition-all-1)',
        '& > section': {
          flexGrow: 1,
        },
      },
    };
  }
);

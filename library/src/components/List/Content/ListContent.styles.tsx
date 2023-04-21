import { Fab, Theme } from '@mui/material';
import { styled } from '@mui/material';
import HistoryTrackerLink, {
  HistoryTrackerLinkProps,
} from '../../../components/shared/HistoryTrackerLink';
import { forwardRef } from 'react';
import ListContent from './ListContent';

export const StyledListContent = styled(ListContent)(
  ({theme}: {theme: Theme}) => {
    return {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-md)',

      '& .list-content-header': {
        display: 'flex',
        gap: 'var(--spacing-sm)',
        justifyContent: 'space-between',
      },

      '& .buttons': {
        display: 'flex',
        gap: 'var(--spacing-sm)',
        alignItems: 'center',
        '&.start': {
          flexShrink: 1,
          minWidth: 0,
        },
        '&.end': {
          flexShrink: 0,
        },
      },

      '.text-field': {
        width: 'unset',
      },

      '& .input-field': {
        background: 'var(--color-background)',
        color: 'var(--color-text)',
        [theme.breakpoints.down('md')]: {
          background: 'var(--color-background-elevated)',
        }
      },

      '.filter-chips': {
        display: 'flex',
        gap: 'var(--spacing-sm)',
        flexShrink: '1',
        overflow: 'auto',
        paddingBottom: '2px',
      
        '&::-webkit-scrollbar': {
          height: '6px',
        },
      
        '&::-webkit-scrollbar-thumb': {
          borderRadius: '6px',
          background: 'var(--color-button)',
        },
      
        '&::-webkit-scrollbar-thumb:hover': {
          background: 'var(--color-border)',
        }
      },

      '& .card': {
        paddingBottom: 0,
        [theme.breakpoints.down('md')]: {
          paddingBlock: 0,
        }
      }
    };
  }
);

export const StyledActionButtonContainer = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    '& > .buttons': {
      textAlign: 'end',
      '& button': {
        height: '40px',
        minWidth: '40px',
      },
    },
  };
});

export const StyledLink = styled((props: HistoryTrackerLinkProps) => {
  const { children, className, to } = props;
  return (
    <HistoryTrackerLink to={to} className={className}>
      {children}
    </HistoryTrackerLink>
  );
})(() => {
  return {
    textDecoration: 'none',
    color: 'inherit',
  };
});

const _Fab = forwardRef<any, any>((props, ref) => {
  const { children, className, onClick, ...rest } = props;
  return (
    <Fab
      {...rest}
      color='secondary'
      size='small'
      variant='extended'
      className={className}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </Fab>
  );
});
_Fab.displayName = '_Fab';

export const StyledFab = styled(_Fab)(() => {
  return {
    marginRight: '10px',
  };
});

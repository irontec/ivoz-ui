import { Fab } from '@mui/material';
import { styled } from '@mui/material';
import HistoryTrackerLink, {
  HistoryTrackerLinkProps,
} from '../../../components/shared/HistoryTrackerLink';
import { forwardRef } from 'react';

export const StyledActionButtonContainer = styled('div')(() => {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    '& > .buttons': {
      textAlign: 'end',
      '& button': {
        margin: '0 0 5px 5px',
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

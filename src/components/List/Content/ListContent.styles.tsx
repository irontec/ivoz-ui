import { Fab } from '@mui/material';
import { styled } from '@mui/styles';
import HistoryTrackerLink from '../../../components/shared/HistoryTrackerLink';
import { forwardRef } from 'react';

export const StyledActionButtonContainer = styled('div')(
  () => {
    return {
      display: 'flex',
      justifyContent: 'space-between',
      '& > div:nth-child(n+1)': {
        alignContent: 'flex-end'
      }
    }
  }
);

export const StyledLink = styled(
  (props) => {
    const { children, className, to } = props;
    return (<HistoryTrackerLink to={to} className={className}>{children}</HistoryTrackerLink>);
  }
)(
  () => {
    return {
      textDecoration: 'none',
      color: 'inherit',
    }
  }
);

const _Fab = forwardRef<any, any>((props, ref) => {
  const { children, className, onClick, ...rest } = props;
  return (
    <Fab
      {...rest}
      color="secondary"
      size="small"
      variant="extended"
      className={className}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </Fab>
  );
});
_Fab.displayName = '_Fab';

export const StyledFab = styled(_Fab)(
  () => {
    return {
      marginRight: '10px'
    }
  }
);

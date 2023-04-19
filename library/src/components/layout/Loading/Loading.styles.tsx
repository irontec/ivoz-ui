import { LinearProgress } from '@mui/material';
import { forwardRef } from 'react';

export const StyledLinearProgress = forwardRef((props, ref) => {
  return (
    <LinearProgress
      {...props}
      color='primary'
      sx={{ height: 2, position: 'absolute', width: '100%' }}
      ref={ref}
    />
  );
});

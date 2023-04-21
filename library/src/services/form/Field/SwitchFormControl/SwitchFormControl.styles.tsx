import { styled } from '@mui/material';
import { SwitchFormControl } from './SwitchFormControl';

export const StyledSwitchFormControl = styled(SwitchFormControl)(
  () => {
    return {
      userSelect: 'none',
      marginTop: '32px',

      '& .MuiSwitch-root': {
        padding: '6px',
      },

      '& .MuiSwitch-switchBase': {
        '&:hover': {
          background: 'none',
        }
      },

      '& .MuiSwitch-thumb': {
        backgroundColor: 'white',
      },

      '& .Mui-checked + .MuiSwitch-track': {
        '--bg-color': 'var(--color-primary)',
      },

      '& .MuiSwitch-track': {
        '--bg-color': '#e0e1e2',
        backgroundColor: 'var(--bg-color)',
        opacity: 1,
        borderRadius: '100vw',
      },

      '& .MuiTouchRipple-root': {
        display: 'none',
      }
    };
  }
);

import { styled } from '@mui/material';
import { SwitchFormControl } from './SwitchFormControl';

export const StyledSwitchFormControl = styled(SwitchFormControl)(
  ({ theme }) => {
    return {
      marginTop: '32px',
      '&.changed label': {
        color: theme.palette.info.main,
      },
    };
  }
);

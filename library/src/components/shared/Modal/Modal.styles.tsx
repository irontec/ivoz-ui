import {
  Box,
  SxProps,
  Theme,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/styles';

type StyledDialogContentBodyProps = {
  sx?: SxProps<Theme>;
};

export const StyledDialogContentBody = styled(
  Box
)<StyledDialogContentBodyProps>(({ sx }) => {
  const resolvedStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-md)',
    ...sx,
  };

  return resolvedStyles as any;
});

export const StyledDialogContent = styled(DialogContent)(() => {
  return {
    minWidth: '350px',
  };
});

export const StyledDialogActions = styled(DialogActions)(() => {
  return {
    padding: 0,
    marginTop: '10px',
  };
});

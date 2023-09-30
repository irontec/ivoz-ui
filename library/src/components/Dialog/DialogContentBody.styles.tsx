import { Box, SxProps, Theme } from '@mui/material';
import { styled } from '@mui/styles';

type StyledDialogContentBodyProps = {
  sx?: SxProps<Theme>;
};

export const StyledDialogContentBody = styled(
  Box
)<StyledDialogContentBodyProps>(({ sx }) => {
  const resolvedStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...sx,
  };

  return resolvedStyles as any;
});

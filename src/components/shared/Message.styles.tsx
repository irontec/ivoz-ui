import { styled } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

export const StyledCloseIcon = styled(CloseIcon)(() => {
  return {
    position: 'relative',
  };
});

interface StyledSnackbarContentMessageContainerProps {
  children: React.ReactNode;
  className?: string;
}
export const StyledSnackbarContentMessageContainer = styled(
  (props: StyledSnackbarContentMessageContainerProps) => {
    const { children, className } = props;
    return <span className={className}>{children}</span>;
  }
)(() => {
  return {
    display: 'flex',
    alignItems: 'center',
  };
});

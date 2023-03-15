import { styled, Typography } from '@mui/material';

interface StyledFilterDialogTypographyProps {
  children: React.ReactNode;
  className?: string;
}
export const StyledFilterDialogTypography = styled(
  (props: StyledFilterDialogTypographyProps) => {
    const { children, className } = props;
    return (
      <Typography variant='h6' className={className}>
        {children}
      </Typography>
    );
  }
)(({ theme }) => {
  return {
    marginLeft: theme.spacing(2),
    flex: 1,
  };
});

export const StyledLinearProgressContainer = styled('div')(() => {
  return {
    paddingTop: '52px',
  };
});

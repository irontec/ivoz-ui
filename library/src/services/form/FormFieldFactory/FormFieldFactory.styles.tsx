import { Box, styled, Typography } from '@mui/material';

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

export const StyledSketchPickerContainer = styled(Box)(
  (props: { visibility: 'hidden' | 'initial' }) => {
    return {
      visibility: props.visibility,
      marginLeft: 120,
      marginTop: -190,
      position: 'relative',
    };
  }
);

export const StyledColorFactoryContainer = styled(Box)(() => {
  return {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 25,
  };
});

import { Box, styled, Typography } from '@mui/material';
import { CSSProperties } from 'react';

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
  (props: {
    visibility: 'hidden' | 'initial';
    mouseposition?: { x: number; y: number };
  }) => {
    const { visibility, mouseposition } = props;
    const marginStyles: CSSProperties = { marginTop: -300 };

    if (mouseposition) {
      const { y } = mouseposition;
      if (y < -611) {
        marginStyles.marginTop = 50;
      }
    }

    return {
      visibility,
      position: 'absolute',
      zIndex: 9999,
      ...marginStyles,
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

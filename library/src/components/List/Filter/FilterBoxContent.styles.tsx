import { styled } from '@mui/material';
import { AppBar, Typography, Toolbar } from '@mui/material';
import FilterBoxContent from './FilterBoxContent';

export const StyledAppBar = styled(AppBar)(() => {
  return {
    position: 'relative',
  };
});

interface StyledFilterDialogTypographyProps {
  children: React.ReactNode;
  className: string;
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

export const StyledFilterBoxContent = styled(FilterBoxContent)(() => {
  return {
    paddingTop: '65px',
    maxWidth: '450px',
  };
});

export const StyledToolbar = styled(Toolbar)(() => {
  return {
    display: 'flex',
    justifyContent: 'space-between',
  };
});

import { styled } from '@mui/material';
import { Typography, Grid, Theme } from '@mui/material';

interface StyledGroupLegendProps {
  children: React.ReactNode;
  className?: string;
}
export const StyledGroupLegend = styled((props: StyledGroupLegendProps) => {
  const { children, className } = props;
  return (
    <Typography variant='h6' color='inherit' gutterBottom className={className}>
      {children}
    </Typography>
  );
})(() => {
  return {
    marginBottom: '40px',
    paddingBottom: '10px',
    borderBottom: '1px solid #aaa',
  };
});

interface StyledGroupGridProps {
  children: React.ReactNode;
  className?: string;
}
export const StyledGroupGrid = styled((props: StyledGroupGridProps) => {
  const { children, className } = props;
  return (
    <Grid container spacing={3} className={className}>
      {children}
    </Grid>
  );
})(({ theme }) => {
  return {
    [theme.breakpoints.up('md')]: {
      paddingLeft: '15px',
    },
    marginBottom: '15px',
  };
});

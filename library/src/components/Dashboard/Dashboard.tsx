import { Box, Grid, styled } from '@mui/material';
import { isRouteMapBlock, RouteMap } from '../../router/routeMapParser';
import DashboardBlock from './DashboardBlock';

export interface DashboardProps {
  className?: string;
  routeMap: RouteMap;
}

const Dashboard = (props: DashboardProps) => {
  const { className, routeMap } = props;

  return (
    <Box className='card'>
      <Grid container spacing={3} className={className}>
        {routeMap.map((routeMapBlock, key) => {
          if (!isRouteMapBlock(routeMapBlock)) {
            return null;
          }

          return <DashboardBlock key={key} routeMapBlock={routeMapBlock} />;
        })}
      </Grid>
    </Box>
  );
};

export default styled(Dashboard)(({ theme }) => {
  return {
    [theme.breakpoints.down('md')]: {
      '& ul': {
        paddingInlineStart: '20px',
      },
      '& ul li.submenu li': {
        paddingInlineStart: '40px',
      },
    },
  };
});

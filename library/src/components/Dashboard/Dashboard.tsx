import { Grid, styled } from '@mui/material';
import { isRouteMapBlock, RouteMap } from '../../router/routeMapParser';
import DashboardBlock from './DashboardBlock';

export interface DashboardProps {
  className?: string;
  routeMap: RouteMap;
}

const Dashboard = (props: DashboardProps) => {
  const { className, routeMap } = props;

  return (
    <Grid container spacing={3} className={className}>
      {routeMap.map((routeMapBlock, key) => {
        if (!isRouteMapBlock(routeMapBlock)) {
          return null;
        }

        return <DashboardBlock key={key} routeMapBlock={routeMapBlock} />;
      })}
    </Grid>
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

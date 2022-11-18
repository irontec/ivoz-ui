import { Grid, styled } from '@mui/material';
import { RouteMap, RouteMapBlock } from '../../router/routeMapParser';
import DashboardBlock from './DashboardBlock';

export interface DashboardProps {
  className?: string;
  routeMap: RouteMap;
}

const Dashboard = (props: DashboardProps) => {
  const { className, routeMap } = props;

  return (
    <Grid container spacing={3} className={className}>
      {routeMap.map((routeMapBlock: RouteMapBlock, key: number) => {
        return <DashboardBlock key={key} routeMapBlock={routeMapBlock} />;
      })}
    </Grid>
  );
};

export default
  styled(Dashboard)(({ theme }) => {
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
  })
;

import { withRouter } from "react-router-dom";
import { Grid, styled, Theme } from "@mui/material";
import { RouteMap, RouteMapBlock } from "../../router/routeMapParser";
import DashboardBlock from "./DashboardBlock";

interface DashboardProps {
    className?: string,
    routeMap: RouteMap,
}

const Dashboard = (props: DashboardProps) => {

    const { className, routeMap } = props;

    return (
        <Grid container spacing={3} className={className}>
            {routeMap.map((routeMapBlock: RouteMapBlock, key: number) => {
                return (
                    <DashboardBlock key={key} routeMapBlock={routeMapBlock} />
                );
            })}
        </Grid>
    );
};

export default withRouter<any, any>(
    styled(Dashboard)(
        ({ theme }) => {
            return {
                [theme.breakpoints.down('md')]: {
                    '& ul': {
                        'paddingInlineStart': '20px',
                    },
                    '& ul li.submenu li': {
                        'paddingInlineStart': '40px',
                    },
                }
            };
        }
    )
);
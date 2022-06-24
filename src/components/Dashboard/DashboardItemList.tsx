import StyledDashboardLink from './DashboardItemList.styles';
import { RouteMapItem, isActionItem } from "../../router/routeMapParser";

const DashboardItemList = (props: { items: RouteMapItem[] }): JSX.Element => {

    const { items } = props;

    return (
        <ul>
            {items.map((item: RouteMapItem, key: number) => {

                if (isActionItem(item)) {
                    return null;
                }

                const { route, entity } = item;

                if (!entity) {
                    return null;
                }

                return (
                    <li key={key}>
                        <StyledDashboardLink to={route || ''}>
                            <>
                                <entity.icon />
                                {entity.title}
                            </>
                        </StyledDashboardLink>
                    </li>
                );
            })}
        </ul>
    );
}

export default DashboardItemList;
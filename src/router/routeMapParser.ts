import EntityInterface from "../entities/EntityInterface";

export interface RouteMapItem {
    entity: EntityInterface,
    route?: string,
    filterBy?: string,
    queryString?: string[],
    children?: Array<RouteMapItem>,
}

export type RouteMapBlock<T extends RouteMapItem = RouteMapItem>= {
    label: string | JSX.Element | null,
    children: Array<T>,
}

export type RouteMap<T extends RouteMapItem = RouteMapItem> = Array<RouteMapBlock<T>>;

const RouteMapItemParser = <T extends RouteMapItem = RouteMapItem>(item: T, routPrefix = '', depth = 1): T => {

    if (item.children && item.children.length) {

        const children = item.children?.map((subitem) => {
            return RouteMapItemParser(
                subitem,
                `${routPrefix}${item.entity?.path}/:parent_id_${depth}`,
                depth + 1
            );
        });

        item = {
            ...item,
            children
        }
    }

    return {
        ...item,
        route: routPrefix + item.entity?.path
    };
}

const routeMapParser = <T extends RouteMapItem = RouteMapItem>(map: RouteMap<T>): RouteMap<T> => {

    const resp = map.map((block) => {
        const children = block.children?.map((item: T) => {
            return RouteMapItemParser<T>(item);
        });

        return {
            ...block,
            children
        }
    });

    return resp;
}


export default routeMapParser;
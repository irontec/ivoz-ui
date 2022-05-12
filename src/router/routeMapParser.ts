import React from "react";
import EntityInterface from "../entities/EntityInterface";

export interface EntityItem {
    entity: EntityInterface,
    route?: string,
    filterBy?: string,
    fixedValues?: Record<string, string | number | boolean>,
    children?: Array<RouteMapItem>,
}

export interface ActionItem {
    action: React.FunctionComponent<unknown>,
}

export type RouteMapItem = EntityItem | ActionItem;


export type RouteMapBlock<T extends RouteMapItem = RouteMapItem>= {
    label: string | JSX.Element | null,
    children: Array<T>,
}

export const isEntityItem = (property: RouteMapItem): property is EntityItem => {
    return (property as EntityItem).entity !== undefined;
}

export const isActionItem = (property: RouteMapItem): property is ActionItem => {
    return (property as ActionItem).action !== undefined;
}

export type RouteMap<T extends RouteMapItem = RouteMapItem> = Array<RouteMapBlock<T>>;
const RouteMapItemParser = <T extends RouteMapItem = RouteMapItem>(item: T, routPrefix = '', depth = 1): T => {

    if (isActionItem(item)) {
        return item;
    }

    if (!isEntityItem(item)) {
        throw "unkown item type";
    }

    if (item.children && item.children.length) {
        const children = item.children?.map((subitem) => {

            if (isActionItem(subitem)) {
                return subitem;
            }

            const entity = (item as EntityItem).entity;

            return RouteMapItemParser(
                subitem,
                `${routPrefix}${entity.path}/:parent_id_${depth}`,
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
import React from 'react';
import EntityService, {
  ScalarEntityValue,
} from '../services/entity/EntityService';
import EntityInterface from '../entities/EntityInterface';
import { PathMatch } from 'react-router-dom';

export type FilterValuesType = Record<
  string,
  ScalarEntityValue | ScalarEntityValue[]
>;

export interface EntityItem {
  entity: EntityInterface;
  route?: string;
  filterBy?: string;
  filterValues?: FilterValuesType;
  fixedValues?: Record<string, ScalarEntityValue>;
  children?: Array<RouteMapItem>;
}

export interface ActionItemProps {
  row: Record<string, any>;
  entityService: EntityService;
  match: PathMatch;
}

export interface MultiSelectActionItemProps {
  rows: Array<Record<string, any>>;
  selectedValues: Array<string>;
  entityService: EntityService;
  style: Record<string, string | number>;
}

export type CustomActionProps = ActionItemProps | MultiSelectActionItemProps;

export const isSingleRowAction = (
  props: CustomActionProps
): props is ActionItemProps => {
  return (props as ActionItemProps).row !== undefined;
};

export const isMultiSelectAction = (
  props: CustomActionProps
): props is MultiSelectActionItemProps => {
  return (props as MultiSelectActionItemProps).rows !== undefined;
};

export type SingleRowFunctionComponent =
  React.FunctionComponent<ActionItemProps>;
export type MultiSelectFunctionComponent =
  React.FunctionComponent<MultiSelectActionItemProps>;
export type ActionFunctionComponent =
  | SingleRowFunctionComponent
  | MultiSelectFunctionComponent;

export interface ActionItem {
  action: ActionFunctionComponent;
  rowAction?: boolean;
  multiselect?: boolean;
}

export type RouteMapItem = EntityItem | ActionItem;

export type RouteMapBlock<T extends RouteMapItem = RouteMapItem> = {
  label: string | JSX.Element | null;
  children: Array<T>;
};

export const isEntityItem = (
  property: RouteMapItem
): property is EntityItem => {
  return (property as EntityItem).entity !== undefined;
};

export const isActionItem = (
  property: RouteMapItem
): property is ActionItem => {
  return (property as ActionItem).action !== undefined;
};

export const isSingleRowActionItem = (
  property: RouteMapItem,
  action: ActionFunctionComponent
): action is SingleRowFunctionComponent => {
  if (!isActionItem(property)) {
    return false;
  }

  return property.rowAction === true || property.rowAction === undefined;
};

export type RouteMap<T extends RouteMapItem = RouteMapItem> = Array<
  RouteMapBlock<T>
>;
const RouteMapItemParser = <T extends RouteMapItem = RouteMapItem>(
  item: T,
  routPrefix = '',
  depth = 1
): T => {
  if (isActionItem(item)) {
    return item;
  }

  if (!isEntityItem(item)) {
    throw 'unkown item type';
  }

  if (item.children && item.children.length) {
    const children = item.children?.map((subitem) => {
      if (isActionItem(subitem)) {
        return subitem;
      }

      const entity = (item as EntityItem).entity;

      const path = entity.localPath || entity.path;

      return RouteMapItemParser(
        subitem,
        `${routPrefix}${path}/:parent_id_${depth}`,
        depth + 1
      );
    });

    item = {
      ...item,
      children,
    };
  }

  const path = item.entity?.localPath || item.entity?.path;

  return {
    ...item,
    route: routPrefix + path,
  };
};

const routeMapParser = <T extends RouteMapItem = RouteMapItem>(
  map: RouteMap<T>
): RouteMap<T> => {
  const resp = map.map((block) => {
    const children = block.children?.map((item: T) => {
      return RouteMapItemParser<T>(item);
    });

    return {
      ...block,
      children,
    };
  });

  return resp;
};

export default routeMapParser;

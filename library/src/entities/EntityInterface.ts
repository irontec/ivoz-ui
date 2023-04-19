import { CancelToken } from 'axios';
import { EntityList } from '../router/parseRoutes';
import {
  PartialPropertyList,
  PropertySpec,
} from '../services/api/ParsedApiSpecInterface';
import EntityService, {
  EntityValues,
  VisualToggleStates,
} from '../services/entity/EntityService';
import React from 'react';
import { PathMatch } from 'react-router-dom';
import { EntityFormProps, fetchFksType } from './DefaultEntityBehavior';
import { ActionItem, RouteMapItem } from '../router/routeMapParser';
import { DropdownChoices, EntityValue } from 'services';

export type ListDecoratorPropsType = {
  field: string;
  row: any;
  property: PropertySpec;
  ignoreCustomComponent?: true;
};

export type ListDecoratorType = React.FunctionComponent<ListDecoratorPropsType>;

export interface ChildDecoratorProps {
  routeMapItem: RouteMapItem;
  row: Record<string, any>;
}

export type ChildDecoratorType = React.FunctionComponent<
  React.PropsWithChildren<ChildDecoratorProps>
>;

export interface foreignKeyResolverProps {
  data: any;
  allowLinks?: boolean;
  entityService?: EntityService;
  cancelToken?: CancelToken;
  entities?: EntityList;
  skip?: Array<string>;
}

export type foreignKeyResolverType = (
  props: foreignKeyResolverProps
) => Promise<any>;
export type ForeignKeyGetterTypeArgs = {
  cancelToken?: CancelToken;
  entityService: EntityService;
  match: PathMatch;
  row?: EntityValues;
  filterContext?: boolean;
  skip?: Array<string>;
};
export type ForeignKeyGetterType = (
  props: ForeignKeyGetterTypeArgs
) => Promise<any>;
export declare type FetchFksCallback = (
  choices: DropdownChoices,
  fullResponse?: Array<Record<string, EntityValue>>
) => void;
export type SelectOptionsArgs = {
  callback: FetchFksCallback;
  cancelToken?: CancelToken;
};
export type SelectOptionsType<T = any> = (
  props: SelectOptionsArgs,
  customProps?: T
) => Promise<unknown>;

export type EntityAclType = {
  iden?: string;
  create: boolean;
  read: boolean;
  detail: boolean;
  update: boolean;
  delete: boolean;
};

export interface ViewProps {
  entityService: EntityService;
  row: EntityValues;
  groups?: any;
}
export type ViewType = (props: ViewProps) => JSX.Element | null;

export type EntityValidatorResponse = Record<string, string | JSX.Element>;
export type EntityValidator = (
  values: EntityValues,
  properties: PartialPropertyList,
  visualToggles: VisualToggleStates,
  validateEmbeddables?: boolean
) => EntityValidatorResponse;

export enum OrderDirection {
  asc = 'asc',
  desc = 'desc',
}

export type CustomActionsType = Record<string, ActionItem>;

export type DetailedColumnSpec = {
  name: string;
  size: number;
};

export default interface EntityInterface {
  initialValues: any;
  validator: EntityValidator;
  marshaller: (
    T: any,
    properties: PartialPropertyList,
    whitelist?: string[]
  ) => any;
  unmarshaller: (T: any, properties: PartialPropertyList) => any;
  fetchFks: fetchFksType;
  foreignKeyResolver: () => Promise<foreignKeyResolverType>;
  foreignKeyGetter: () => Promise<ForeignKeyGetterType>;
  selectOptions?: () => Promise<SelectOptionsType>;
  Form: () => Promise<React.FunctionComponent<EntityFormProps>>;
  View: () => Promise<ViewType>;
  ListDecorator: ListDecoratorType;
  ChildDecorator: ChildDecoratorType;
  customActions: CustomActionsType;
  acl: EntityAclType;
  iden: string;
  title: string | JSX.Element;
  path: string;
  localPath?: string;
  columns: Array<string | DetailedColumnSpec>;
  properties: PartialPropertyList;
  toStr: (row: EntityValues) => string;
  defaultOrderBy: string;
  defaultOrderDirection: OrderDirection;
  icon: React.FunctionComponent;
  link?: string;
  deleteDoubleCheck?: boolean;
}

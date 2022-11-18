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
import { EntityFormProps } from './DefaultEntityBehavior';
import { ActionItem, RouteMapItem } from '../router/routeMapParser';
import { DropdownChoices } from 'services';

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
  fullResponse?: undefined | Record<string | number, unknown>
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
  row: any;
  groups: any;
}
export type ViewType = (props: ViewProps) => JSX.Element | null;

export interface EntityValidatorValues {
  [label: string]: string;
}
export type EntityValidatorResponse = Record<string, string | JSX.Element>;
export type EntityValidator = (
  values: EntityValidatorValues,
  properties: PartialPropertyList,
  visualToggles: VisualToggleStates
) => EntityValidatorResponse;

export enum OrderDirection {
  asc = 'asc',
  desc = 'desc',
}

export type CustomActionsType = Record<string, ActionItem>;

export default interface EntityInterface {
  initialValues: any;
  validator: EntityValidator;
  marshaller: (T: any, properties: PartialPropertyList) => any;
  unmarshaller: (T: any, properties: PartialPropertyList) => any;
  foreignKeyResolver: foreignKeyResolverType;
  foreignKeyGetter: ForeignKeyGetterType;
  selectOptions?: SelectOptionsType;
  Form: React.FunctionComponent<EntityFormProps>;
  View: ViewType;
  ListDecorator: ListDecoratorType;
  ChildDecorator: ChildDecoratorType;
  customActions: CustomActionsType;
  acl: EntityAclType;
  iden: string;
  title: string | JSX.Element;
  path: string;
  localPath?: string;
  columns: Array<string>;
  properties: PartialPropertyList;
  toStr: (row: EntityValues) => string;
  defaultOrderBy: string;
  defaultOrderDirection: OrderDirection;
  icon: React.FunctionComponent;
}

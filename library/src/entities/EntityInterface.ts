import { CancelToken } from 'axios';
import React from 'react';
import { PathMatch } from 'react-router-dom';
import { DropdownChoices } from 'services';
import { EntityList } from '../router/parseRoutes';
import { ActionItem, RouteMapItem } from '../router/routeMapParser';
import {
  PartialPropertyList,
  PropertySpec,
} from '../services/api/ParsedApiSpecInterface';
import EntityService, {
  EntityValues,
  VisualToggleStates,
} from '../services/entity/EntityService';
import {
  EntityFormProps,
  FkChoices,
  fetchFksType,
} from './DefaultEntityBehavior';
import { IvozStoreState } from 'store';

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
  entityService: EntityService;
  variant: 'icon' | 'text';
  disabled?: boolean | undefined;
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
  headers?: Record<string, string>
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

export type calculateAclType = (
  acl: EntityAclType,
  parentRow: EntityValues
) => EntityAclType;

export type ViewProps = {
  entityService: EntityService;
  row: EntityValues;
  groups?: any;
  create?: false;
  edit?: false;
  fkChoices?: FkChoices;
  match: PathMatch;
} & Pick<EntityInterface, 'foreignKeyResolver' | 'foreignKeyGetter'>;

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

export type EntityColumnsArrayType = Array<string | DetailedColumnSpec>;
export type EntityColumnsFuncType = <T extends IvozStoreState = IvozStoreState>(
  store: T
) => Array<string | DetailedColumnSpec>;
export type EntityColumnsType = EntityColumnsArrayType | EntityColumnsFuncType;

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
  calculateAclByParentRow: calculateAclType;
  iden: string;
  title: string | JSX.Element;
  path: string;
  localPath?: string;
  columns: EntityColumnsType;
  properties: PartialPropertyList;
  toStr: (row: EntityValues) => string;
  defaultOrderBy: string;
  defaultOrderDirection: OrderDirection;
  icon: React.FunctionComponent;
  link?: string;
  deleteDoubleCheck?: boolean;
  disableMultiDelete?: boolean;
}

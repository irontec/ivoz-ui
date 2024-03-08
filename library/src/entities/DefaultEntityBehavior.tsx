import { CancelToken } from 'axios';
import * as React from 'react';
import { EntityValues } from '../services/entity/EntityService';
import {
  ChildDecoratorProps,
  ChildDecoratorType,
  EntityAclType,
  FetchFksCallback,
  OrderDirection,
  calculateAclType,
} from './EntityInterface';

import { fetchAllPages } from '../helpers/fechAllPages';
import { EntityItem, isEntityItem } from '../router';
import autoForeignKeyResolver from './DefaultEntityBehavior/AutoForeignKeyResolver';
import autoSelectOptions from './DefaultEntityBehavior/AutoSelectOptions';
import filterFieldsetGroups, {
  FieldsetGroups,
} from './DefaultEntityBehavior/FilterFieldsetGroups';
import foreignKeyGetter from './DefaultEntityBehavior/ForeignKeyGetter';
import foreignKeyResolver from './DefaultEntityBehavior/ForeignKeyResolver';
import {
  EntityFormProps,
  EntityFormType,
  FkChoices,
  Form,
  NullablePropertyFkChoices,
  PropertyFkChoices,
} from './DefaultEntityBehavior/Form/index';
import ListDecorator from './DefaultEntityBehavior/ListDecorator';
import marshaller, {
  MarshallerValues,
} from './DefaultEntityBehavior/Marshaller';
import unmarshaller from './DefaultEntityBehavior/Unmarshaller';
import validator from './DefaultEntityBehavior/Validator';
import View from './DefaultEntityBehavior/View';

export const initialValues = {};

export const columns = [];

export const properties = {};

export const acl: EntityAclType = {
  create: true,
  read: true,
  detail: true,
  update: true,
  delete: true,
};

export const calculateAclByParentRow: calculateAclType = (acl) => acl;

export const ChildDecorator: ChildDecoratorType = (props) => {
  const Children = props.children;
  if (!Children) {
    return null;
  }

  return Children as React.ReactElement;
};

export const ChildDecoratorMemo = React.memo(
  ChildDecorator,
  (prev: ChildDecoratorProps, next: ChildDecoratorProps): boolean => {
    const areEntityItems =
      isEntityItem(prev.routeMapItem) && isEntityItem(next.routeMapItem);

    const sameRoute =
      areEntityItems &&
      (prev.routeMapItem as EntityItem).route ===
        (next.routeMapItem as EntityItem).route;
    const sameId = prev.row.id === next.row.id;

    const sameState = prev.disabled === next.disabled;

    return sameRoute && sameId && sameState;
  }
);

export type FormOnChangeEvent = React.ChangeEvent<{ name: string; value: any }>;

/** deprecated, use fetchAllPages instead */
const fetchFks = async (
  endpoint: string,
  properties:
    | Array<EntityValues>
    | Array<string> /* Array<string> is deprecated */,
  setter: FetchFksCallback,
  cancelToken?: CancelToken
): Promise<unknown> => {
  return fetchAllPages({
    endpoint,
    params: {
      properties,
    },
    setter,
    cancelToken,
  });
};

export type fetchFksType = typeof fetchFks;

const DefaultEntityBehavior = {
  initialValues,
  validator,
  marshaller,
  unmarshaller,
  foreignKeyResolver: async () => {
    const module = await import('./DefaultEntityBehavior/ForeignKeyResolver');
    return module.default;
  },
  foreignKeyGetter: async () => {
    const module = await import('./DefaultEntityBehavior/ForeignKeyGetter');
    return module.default;
  },
  columns,
  properties,
  acl,
  calculateAclByParentRow,
  ListDecorator,
  ChildDecorator: ChildDecoratorMemo,
  customActions: {},
  toStr: (row: EntityValues): string => {
    return (row.id as string) || '[*]';
  },
  Form: async () => {
    const module = await import('./DefaultEntityBehavior/Form/Form');
    return module.Form;
  },
  View: async () => {
    const module = await import('./DefaultEntityBehavior/View');
    return module.default;
  },
  fetchFks,
  fetchAllFks: fetchAllPages,
  defaultOrderBy: 'id',
  defaultOrderDirection: OrderDirection.asc,
};

export default DefaultEntityBehavior;
export {
  Form,
  ListDecorator,
  View,
  autoForeignKeyResolver,
  autoSelectOptions,
  filterFieldsetGroups,
  foreignKeyGetter,
  foreignKeyResolver,
  marshaller,
  unmarshaller,
  validator,
};
export type {
  EntityFormProps,
  EntityFormType,
  FieldsetGroups,
  FkChoices,
  MarshallerValues,
  NullablePropertyFkChoices,
  PropertyFkChoices,
};

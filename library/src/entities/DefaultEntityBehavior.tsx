import { CancelToken } from 'axios';
import * as React from 'react';
import { EntityValues } from '../services/entity/EntityService';
import { StoreContainer } from '../store';
import {
  ChildDecoratorProps,
  ChildDecoratorType,
  EntityAclType,
  FetchFksCallback,
  OrderDirection,
  calculateAclType,
} from './EntityInterface';

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
import { DropdownArrayChoice, DropdownChoices } from 'services';

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

const fetchFks = async (
  endpoint: string,
  properties:
    | Array<EntityValues>
    | Array<string> /* Array<string> is deprecated */,
  setter: FetchFksCallback,
  cancelToken?: CancelToken
): Promise<unknown> => {
  const getAction = StoreContainer.store.getActions().api.get;

  let keepGoing = true;
  let _page: number = parseInt(
    endpoint.match(/_page=([0-9]+)/)?.[1] || '1',
    10
  );

  const response: DropdownChoices = [];
  let loopCount = 0;
  while (keepGoing) {
    try {
      if (loopCount > 100) {
        console.error('Too much requests');
        break;
      }

      loopCount++;
      const result = await getAction({
        path: endpoint,
        silenceErrors: false,
        params: {
          _pagination: false,
          _itemsPerPage: 100,
          _properties: properties,
          _page,
        },
        successCallback: async (data, headers: Record<string, string>) => {
          response.push(...(data as Array<DropdownArrayChoice>));

          const totalItems = parseInt(
            headers?.['x-total-items'] || `${response.length}`,
            10
          );

          if (
            response.length >= totalItems ||
            !(data as Array<DropdownArrayChoice>).length
          ) {
            keepGoing = false;
          }
          _page++;
        },
        cancelToken,
      });

      if (!result) {
        // Cancel token or 403
        break;
      }
    } catch (error) {
      console.error(error);
      break;
    }
  }

  setter(response);

  return response;
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
  defaultOrderBy: 'id',
  defaultOrderDirection: OrderDirection.asc,
};

export default DefaultEntityBehavior;
export {
  validator,
  marshaller,
  unmarshaller,
  autoForeignKeyResolver,
  autoSelectOptions,
  ListDecorator,
  foreignKeyResolver,
  foreignKeyGetter,
  filterFieldsetGroups,
  Form,
  View,
};
export type {
  PropertyFkChoices,
  EntityFormType,
  FkChoices,
  NullablePropertyFkChoices,
  EntityFormProps,
  MarshallerValues,
  FieldsetGroups,
};

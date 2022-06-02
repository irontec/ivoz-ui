import * as React from 'react';
import { EntityValues } from '../services/entity/EntityService';
import { StoreContainer } from "../store";
import {
    ChildDecoratorType, OrderDirection, EntityAclType, FetchFksCallback, ChildDecoratorProps,
} from './EntityInterface';
import _ from '../services/translations/translate';
import { CancelToken } from 'axios';

import validator from './DefaultEntityBehavior/Validator';
import marshaller, { MarshallerValues } from './DefaultEntityBehavior/Marshaller';
import unmarshaller from './DefaultEntityBehavior/Unmarshaller';
import autoForeignKeyResolver from './DefaultEntityBehavior/AutoForeignKeyResolver';
import autoSelectOptions from './DefaultEntityBehavior/AutoSelectOptions';
import ListDecorator from './DefaultEntityBehavior/ListDecorator';
import foreignKeyResolver from './DefaultEntityBehavior/ForeignKeyResolver';
import filterFieldsetGroups, { FieldsetGroups } from './DefaultEntityBehavior/FilterFieldsetGroups';
import Form, {
    PropertyFkChoices, EntityFormType, FkChoices, NullablePropertyFkChoices, EntityFormProps
} from './DefaultEntityBehavior/Form';
import View from './DefaultEntityBehavior/View';

export const initialValues = {};

export const foreignKeyGetter = async (): Promise<any> => {
    return {};
};

export const columns = [];

export const properties = {};

export const acl: EntityAclType = {
    create: true,
    read: true,
    detail: true,
    update: true,
    delete: true,
};

export const ChildDecorator: ChildDecoratorType = (props) => {

    const Children = props.children;
    if (!Children) {
        return null;
    }

    return Children as React.ReactElement;
}

export const ChildDecoratorMemo = React.memo(
    ChildDecorator,
    (prev: ChildDecoratorProps, next: ChildDecoratorProps): boolean => {
        return prev.row.id === next.row.id;
    }
  );

export type FormOnChangeEvent = React.ChangeEvent<{ name: string, value: any }>;

const fetchFks = (endpoint: string, properties: Array<string>, setter: FetchFksCallback, cancelToken?: CancelToken): Promise<unknown> => {

    const getAction = StoreContainer.store.getActions().api.get;
    return getAction({
        path: endpoint,
        params: {
            '_pagination': false,
            '_itemsPerPage': 100,
            '_properties': properties
        },
        successCallback: async (data: any) => {
            setter(data);
        },
        cancelToken
    });
}

const DefaultEntityBehavior = {
    initialValues,
    validator,
    marshaller,
    unmarshaller,
    foreignKeyResolver,
    foreignKeyGetter,
    columns,
    properties,
    acl,
    ListDecorator,
    ChildDecorator: ChildDecoratorMemo,
    customActions: {},
    toStr: (row: EntityValues): string => {
        return (row.id as string || '[*]');
    },
    Form,
    View,
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
    filterFieldsetGroups,
    Form
}

export type {
    PropertyFkChoices,
    EntityFormType,
    FkChoices,
    NullablePropertyFkChoices,
    EntityFormProps,
    MarshallerValues,
    FieldsetGroups,
}
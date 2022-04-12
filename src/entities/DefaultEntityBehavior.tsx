import * as React from 'react';
import EntityService, { EntityValues, VisualToggleStates } from '../services/entity/EntityService';
import FormFieldFactory from '../services/form/FormFieldFactory';
import { useFormikType } from '../services/form/types';
import { StoreContainer } from "../store";
import { Alert, AlertTitle, Grid } from '@mui/material';
import { isPropertyScalar, PartialPropertyList, PropertySpec, ScalarProperty } from '../services/api/ParsedApiSpecInterface';
import EntityInterface, {
    EntityValidator, EntityValidatorValues, EntityValidatorResponse, ViewProps, ListDecoratorType, ChildDecoratorType,
    OrderDirection, foreignKeyResolverProps, foreignKeyResolverType, EntityAclType, FetchFksCallback,
} from './EntityInterface';
import ViewFieldValue from '../services/form/Field/ViewFieldValue';
import { StyledGroupLegend, StyledGroupGrid } from './DefaultEntityBehavior.styles';
import _ from '../services/translations/translate';
import { CancelToken } from 'axios';
import { CustomFunctionComponentContext } from '../services/form/Field/CustomComponentWrapper';
import genericForeignKeyResolver from '../services/api/genericForeigKeyResolver';
import { EntityList } from 'router/parseRoutes';
import { match } from 'react-router-dom';

export const initialValues = {};

export const validator: EntityValidator = (
    values: EntityValidatorValues,
    properties: PartialPropertyList,
    visualToggle: VisualToggleStates
): EntityValidatorResponse => {

    const response: EntityValidatorResponse = {};
    for (const idx in values) {

        if (!visualToggle[idx]) {
            continue;
        }

        const pattern: RegExp | undefined = (properties[idx] as ScalarProperty)?.pattern;
        if (pattern && !(values[idx] + '').match(pattern)) {
            response[idx] = _('invalid pattern');
        }

        const required = (properties[idx] as ScalarProperty)?.required;
        const isEmpty = ['', '__null__', null].includes(values[idx]);

        if (required && isEmpty) {
            response[idx] = _('required value');
        }
    }

    for (const fld in visualToggle) {

        if (!visualToggle[fld]) {
            continue;
        }

        if (values[fld] !== undefined) {
            continue;
        }

        const required = (properties[fld] as ScalarProperty)?.required;
        if (!required) {
            continue;
        }

        response[fld] = _('required value');
    }

    return response;
}

export type MarshallerValues = { [key: string]: any };
export const marshaller = (values: MarshallerValues, properties: PartialPropertyList): MarshallerValues => {

    values = { ...values };
    for (const idx in values) {

        const property: any = properties[idx];

        if (!property) {
            delete values[idx];
            continue;
        }

        if (property?.type === 'file') {

            if (values[idx].file) {
                values[idx] = values[idx].file;
            }

            continue;
        }

        if (property?.type === 'boolean') {
            continue;
        }

        if (property?.$ref && values[idx] === '') {
            values[idx] = null;

            continue;
        }

        if (values[idx] === '__null__') {
            values[idx] = null;
        }

        if (property?.type === 'integer' && values[idx] === '') {
            values[idx] = null;

            continue;
        }
    }

    return values;
}

// API Response format => formik compatible format
export const unmarshaller = (row: MarshallerValues, properties: PartialPropertyList): MarshallerValues => {

    const normalizedData: any = {};

    // eslint-disable-next-line
    const dateTimePattern = `^[0-9]{4}\-[0-9]{2}\-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$`;
    const dateTimeRegExp = new RegExp(dateTimePattern);

    for (const idx in row) {
        if (row[idx] == null) {

            // formik doesn't like null values
            const property = properties[idx];
            normalizedData[idx] = property?.null
                ? '__null__'
                : '';

        } else if (typeof row[idx] === 'object' && row[idx].id) {
            // flatten foreign keys
            const hasCustomComponent = properties[idx]?.component !== undefined;

            normalizedData[idx] = hasCustomComponent
                ? row[idx]
                : row[idx].id;

        } else if (typeof row[idx] === 'string' && row[idx].match(dateTimeRegExp)) {
            // formik datetime format: "yyyy-MM-ddThh:mm" followed by optional ":ss" or ":ss.SSS"
            normalizedData[idx] = row[idx].replace(' ', 'T');
        } else if (properties[idx] && (properties[idx] as ScalarProperty).type === "boolean") {
            normalizedData[idx] = (row[idx] === true || row[idx] === 1)
                ? true
                : false;
        } else {
            normalizedData[idx] = row[idx];
        }
    }

    return normalizedData;
};

export const autoForeignKeyResolver = (
    props: foreignKeyResolverProps
): Array<Promise<EntityValues | EntityValues[]>> => {

    const { data, cancelToken, entityService, entities, skip } = props;
    if (!entities) {
        return [];
    }

    const promises = [];
    const fkProperties = entityService?.getFkProperties();

    for (const idx in fkProperties) {

        if (skip && skip.includes(idx)) {
            continue;
        }

        const ref = fkProperties[idx].$ref.replace('#/definitions/', '');
        const entity = entities[ref];

        if (!entity) {
            if (ref) {
                console.log('foreignKeyResolver', `${ref} not found`);
            }
            continue;
        }

        promises.push(
            genericForeignKeyResolver({
                data,
                fkFld: idx,
                entity: entity,
                cancelToken,
            })
        );
    }

    return promises;
};

type AutoForeignKeyResolverArgs = {
    cancelToken?: CancelToken,
    entities: EntityList,
    entityService: EntityService,
    skip?: string[],
    response: Record<string, Array<unknown>> | any,
}

export const autoSelectOptions = (
    props: AutoForeignKeyResolverArgs
): Array<Promise<unknown>> => {

    const { cancelToken, response, entityService, entities } = props;
    const skip = props.skip || [];

    if (!entities) {
        return [];
    }

    const promises = [];
    const fkProperties = entityService?.getFkProperties();

    const alreadyRequested: string[] = [];
    for (const idx in fkProperties) {

        if (skip && skip.includes(idx)) {
            continue;
        }

        const ref = fkProperties[idx].$ref;
        const cleanRef = fkProperties[idx].$ref.replace('#/definitions/', '');
        const entity = entities[cleanRef];

        if (alreadyRequested.includes(cleanRef)) {
            continue;
        }
        alreadyRequested.push(cleanRef);

        if (!entity) {
            if (cleanRef) {
                console.log('autoSelectOptions', `${cleanRef} not found`);
            }
            continue;
        }

        if (!entity.selectOptions) {
            if (cleanRef) {
                console.log('autoSelectOptions', `${cleanRef} selectOption is not defined`);
            }
            continue;
        }

        promises.push(
            entity.selectOptions({
                callback: (options: any) => {
                    for (const k in fkProperties) {

                        if (skip.includes(k)) {
                            continue;
                        }

                        if (fkProperties[k].$ref === ref) {
                            response[k] = options;
                        }
                    }
                },
                cancelToken
            })
        );
    }

    return promises;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const foreignKeyResolver: foreignKeyResolverType = async (
    props: foreignKeyResolverProps
): Promise<EntityValues> => {

    const promises = autoForeignKeyResolver(props);
    await Promise.all(promises);

    return props.data
};

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

export const ListDecorator: ListDecoratorType = (props) => {

    const { field, row, property, ignoreCustomComponent } = props;
    let value = row[field];

    if (property.component && !ignoreCustomComponent) {
        return (
            <property.component
                _columnName={field}
                _context={CustomFunctionComponentContext.read}
                values={row}
                property={property}
                disabled={false}
                changeHandler={() => { return null; }}
                onBlur={() => { return null; }}
            />
        );
    }

    if (property.type === 'file') {
        return value.baseName;
    }

    if (isPropertyScalar(property) && property.enum) {

        let idx = value;
        if (typeof value == 'boolean') {
            idx = value
                ? 1
                : 0;
        }

        if (property.enum[idx]) {
            value = property.enum[idx];
        }
    }

    if (!value && property.null) {
        value = property.null;
    }

    return (value !== null && value !== undefined)
        ? value
        : '';
}

export const ChildDecorator: ChildDecoratorType = (props) => {

    const Children = props.children;
    if (!Children) {
        return null;
    }

    return Children as React.ReactElement;
}

export type FieldsetGroups = {
    legend: string | React.ReactElement,
    fields: Array<string | false | undefined>
}

export type FormOnChangeEvent = React.ChangeEvent<{ name: string, value: any }>;

const filterFieldsetGroups = (groups: Array<FieldsetGroups | false>): Array<FieldsetGroups> => {

    const resp: Array<FieldsetGroups> = [];
    for (const idx in groups) {
        const group = groups[idx];

        if (!group) {
            continue;
        }

        const fields = group.fields.filter(
            (item) => typeof item === 'string'
        ) as Array<string>;

        if (!fields.length) {
            continue;
        }

        resp.push({
            legend: group.legend,
            fields
        });
    }

    return resp;
}

export type PropertyFkChoices = {
    [key: string]: string | React.ReactElement<any>
};

export type NullablePropertyFkChoices = null | PropertyFkChoices;

export type FkChoices = {
    [key: string]: NullablePropertyFkChoices
};

type ReadOnlyProperties = { [attribute: string]: boolean };

export type EntityFormProps = EntityInterface & {
    create?: boolean,
    edit?: boolean,
    entityService: EntityService,
    formik: useFormikType,
    groups?: Array<FieldsetGroups | false>,
    fkChoices?: FkChoices,
    readOnlyProperties?: ReadOnlyProperties,
    validationErrors: Record<string, JSX.Element>,
    row?: EntityValues,
    match: match,
    filterBy?: string | undefined,
};

export type EntityFormType = (props: EntityFormProps) => JSX.Element;
const Form: EntityFormType = (props) => {

    const {
        entityService, formik, readOnlyProperties, validationErrors, fkChoices, filterBy
    } = props;

    const columns = entityService.getProperties();
    const columnNames = Object.keys(columns);

    let groups: Array<FieldsetGroups> = [];
    if (props.groups) {

        groups = filterFieldsetGroups(props.groups);

    } else {
        groups.push({
            legend: "",
            fields: columnNames
        });
    }

    const visualToggles = entityService.getVisualToggles(
        formik.values
    );

    const formFieldFactory = new FormFieldFactory(
        entityService,
        formik,
        formik.handleChange,
        formik.handleBlur
    );

    return (
        <React.Fragment>
            {groups.map((group, idx: number) => {

                const fields = group.fields as Array<string>;
                const visible = fields.reduce(
                    (acc: boolean, fld: string) => {
                        return acc || visualToggles[fld];
                    },
                    false
                );

                if (!visible) {
                    return null;
                }

                const visibilityStyles = visible
                    ? { display: 'block' }
                    : { display: 'none' };

                return (
                    <div key={idx} style={visibilityStyles}>
                        <StyledGroupLegend>
                            {group.legend}
                        </StyledGroupLegend>
                        <StyledGroupGrid>
                            {fields.map((columnName: string, idx: number) => {

                                if (columnName === filterBy) {
                                    return null;
                                }

                                return (
                                    <FormField
                                        key={idx}
                                        columnName={columnName}
                                        fkChoices={fkChoices}
                                        visualToggles={visualToggles}
                                        readOnlyProperties={readOnlyProperties}
                                        formFieldFactory={formFieldFactory}
                                    />
                                );
                            })}
                        </StyledGroupGrid>
                    </div>
                );
            })}

            {Object.keys(validationErrors).length > 0 && (
                <>
                    <br />
                    <Alert severity="error">
                        <AlertTitle>{_("Validation error")}</AlertTitle>
                        <ul>
                            {Object.values(validationErrors).map((error) => error)}
                        </ul>
                    </Alert>
                    <br />
                </>
            )}
        </React.Fragment>
    );
};

export type EntityFormFieldProps = {
    columnName: string,
    fkChoices?: FkChoices,
    visualToggles: VisualToggleStates,
    readOnlyProperties?: ReadOnlyProperties,
    formFieldFactory: FormFieldFactory,
};

export type EntityFormFieldType = (props: EntityFormFieldProps) => JSX.Element | null;
export const FormField: EntityFormFieldType = (props) => {

    const { columnName, fkChoices, visualToggles, readOnlyProperties, formFieldFactory } = props;

    const choices: NullablePropertyFkChoices = fkChoices
        ? fkChoices[columnName]
        : null;

    if (!visualToggles[columnName]) {
        return null;
    }

    const visibilityStyles = visualToggles[columnName]
        ? { display: 'block' }
        : { display: 'none' };

    const readOnly = readOnlyProperties && readOnlyProperties[columnName]
        ? true
        : false;

    return (
        <Grid item xs={12} md={6} lg={4} xl={3} style={visibilityStyles}>
            {formFieldFactory.getFormField(columnName, choices, readOnly)}
        </Grid>
    );

}

const View = (props: ViewProps): JSX.Element | null => {

    const { entityService, row } = props;

    const columns = entityService.getColumns();
    const columnNames = Object.keys(columns);

    let groups: Array<FieldsetGroups> = [];
    if (props.groups) {
        groups = filterFieldsetGroups(props.groups);
    } else {
        groups.push({
            legend: "",
            fields: columnNames
        });
    }

    return (
        <React.Fragment>
            {groups.map((group, idx: number) => {

                const fields = group.fields as Array<string>;

                return (
                    <div key={idx}>
                        <StyledGroupLegend>
                            {group.legend}
                        </StyledGroupLegend>
                        <StyledGroupGrid>
                            {fields.map((columnName: string, idx: number) => {

                                const properties = entityService.getProperties();
                                const property = (properties[columnName] as PropertySpec);
                                return (
                                    <Grid item xs={12} md={6} lg={4} key={idx}>
                                        <ViewFieldValue
                                            entityService={entityService}
                                            property={property}
                                            values={row}
                                            columnName={columnName}
                                        />
                                    </Grid>
                                );
                            })}
                        </StyledGroupGrid>
                    </div>
                );
            })}
        </React.Fragment>
    );
};

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
    ChildDecorator,
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
import { IvozStoreState } from 'store';
import { SearchFilterType } from '../../components/List/Filter/icons/FilterIconFactory';
import EntityInterface, {
  EntityAclType,
  ForeignKeyGetterType,
  OrderDirection,
} from '../../entities/EntityInterface';
import {
  ActionModelList,
  ActionModelSpec,
  ActionsSpec,
  FkProperty,
  PropertyList,
  ScalarProperty,
  fkPropertyList,
  isPropertyFk,
  visualToggleList,
} from '../../services/api/ParsedApiSpecInterface';

export type VisualToggleStates = { [key: string]: boolean };
export type ScalarEntityValue = string | number | boolean | null;
export type EntityValue = ScalarEntityValue | File | Array<string>;
export type EntityValues = {
  [key: string]: EntityValue | EntityValues;
};

export default class EntityService<T extends IvozStoreState = IvozStoreState> {
  constructor(
    private actions: ActionsSpec,
    private properties: PropertyList,
    private entityConfig: EntityInterface
  ) {}

  public getEntity(): EntityInterface {
    return this.entityConfig;
  }

  // Properties declared explicitly in the entity
  public getProperties(): PropertyList {
    const response: PropertyList = {};
    const properties = this.entityConfig.properties;

    for (const idx in properties) {
      const propertyOverwrite = properties[idx] || {};
      const label = properties[idx].label || '';

      response[idx] = {
        ...this.properties[idx],
        ...propertyOverwrite,
        label,
      };
    }

    return response;
  }

  // All API spec properties + properties declared in entity
  public getAllProperties(): PropertyList {
    const response = { ...this.properties };
    const entityProperties = this.entityConfig.properties;

    for (const idx in entityProperties) {
      const propertyOverwrite = entityProperties[idx] || {};
      const label = entityProperties[idx].label || '';

      response[idx] = {
        ...this.properties[idx],
        ...propertyOverwrite,
        label,
      };
    }

    return response;
  }

  public replaceProperties(properties: PropertyList): void {
    this.entityConfig.properties = properties;
  }

  public getFkProperties(): fkPropertyList {
    const response: fkPropertyList = {};
    const properties = this.getProperties();

    for (const idx in properties) {
      if (!isPropertyFk(properties[idx])) {
        continue;
      }

      response[idx] = properties[idx] as FkProperty;
    }

    return response;
  }

  public getColumns(store: T): PropertyList {
    const response: PropertyList = {};
    const properties = this.entityConfig.properties;

    const columns = Array.isArray(this.entityConfig.columns)
      ? this.entityConfig.columns
      : this.entityConfig.columns(store);

    let columnNames = columns.map((column) => {
      return typeof column === 'string' ? column : column.name;
    });
    columnNames = columnNames.length ? columnNames : Object.keys(properties);

    for (const idx of columnNames) {
      if (!this.properties[idx] && !properties[idx]) {
        continue;
      }

      const propertyOverwrite = properties[idx] || {};
      const label = properties[idx].label || '';

      response[idx] = {
        ...this.properties[idx],
        ...propertyOverwrite,
        label,
      };
    }

    return response;
  }

  public getCollectionColumns(store: T): PropertyList {
    const allColumns = this.getColumns(store);
    const collectionAction = this.getFromModelList(
      this.actions?.get?.collection || {},
      this.entityConfig.path
    );
    const collectionActionFields = Object.keys(
      collectionAction?.properties || {}
    );
    const response: PropertyList = {};

    const columns = Array.isArray(this.entityConfig.columns)
      ? this.entityConfig.columns
      : this.entityConfig.columns(store);

    const columnNames = columns.map((column) => {
      return typeof column === 'string' ? column : column.name;
    });
    const restrictedColumns = columnNames.length
      ? columnNames
      : collectionActionFields;

    for (const colName in allColumns) {
      if (!restrictedColumns.includes(colName)) {
        continue;
      }

      response[colName] = allColumns[colName];
    }

    return response;
  }

  public getColumnSize(columnName: string, store: T): number {
    const columns = Array.isArray(this.entityConfig.columns)
      ? this.entityConfig.columns
      : this.entityConfig.columns(store);

    let customSizeColumns = 0;
    let sizeSum = 0;
    for (const column of columns) {
      if (typeof column === 'string') {
        continue;
      }

      customSizeColumns++;
      if (column.name === columnName) {
        return column.size;
      }

      sizeSum += column.size;
    }

    return Math.floor((100 - sizeSum) / (columns.length - customSizeColumns));
  }

  public getCollectionParamList(store: T): PropertyList {
    const collectionAction = this.getFromModelList(
      this.actions?.get?.collection || {},
      this.entityConfig.path
    );
    const collectionActionParameters = collectionAction?.parameters || {};

    const paramNames = Object.keys(collectionActionParameters).map(
      (key: string) => {
        return collectionActionParameters[key].name;
      }
    );

    const columns = this.getColumns(store);

    const filteredColumns: PropertyList = {};
    for (const columnName in columns) {
      if (!paramNames.includes(columnName)) {
        continue;
      }
      filteredColumns[columnName] = columns[columnName];
    }

    return filteredColumns;
  }

  public getVisualToggleRules(): visualToggleList {
    const rules: visualToggleList = {};
    const properties = this.entityConfig.properties;
    for (const idx in properties) {
      const visualToggle = (properties[idx] as ScalarProperty).visualToggle;
      if (!visualToggle) {
        continue;
      }

      rules[idx] = visualToggle;
    }

    return rules;
  }

  public getVisualToggles(values: Record<string, any>): VisualToggleStates {
    const properties = this.entityConfig.properties;
    const visualToggles = Object.keys(properties).reduce(
      (accumulator: any, fldName: string) => {
        accumulator[fldName] = true;
        return accumulator;
      },
      {}
    );

    for (const idx in values) {
      this.hideVisualToggle(idx, values[idx], visualToggles);
    }

    for (const idx in values) {
      this.showVisualToggle(idx, values[idx], visualToggles);
    }

    return visualToggles;
  }

  private hideVisualToggle(
    fld: string,
    value: string | number,
    visualToggles: VisualToggleStates
  ): VisualToggleStates {
    const rules = this.getVisualToggleRules();

    if (!rules[fld]) {
      return visualToggles;
    }

    if (value === '__null__' || value === null) {
      if (!rules[fld]['__null__']) {
        return visualToggles;
      }

      for (const hideFld of rules[fld]['__null__']['hide']) {
        visualToggles[hideFld] = false;
      }

      return visualToggles;
    }

    const normalizedValue = typeof value === 'boolean' ? value + 0 : value;

    if (!rules[fld][normalizedValue]) {
      if (rules[fld]['__default__']) {
        for (const hideFld of rules[fld]['__default__']['hide']) {
          visualToggles[hideFld] = false;
        }
      }

      return visualToggles;
    }

    for (const hideFld of rules[fld][normalizedValue]['hide']) {
      visualToggles[hideFld] = false;
    }

    return visualToggles;
  }

  private showVisualToggle(
    fld: string,
    value: string | number,
    visualToggles: VisualToggleStates
  ): VisualToggleStates {
    const rules = this.getVisualToggleRules();

    if (!visualToggles[fld]) {
      return visualToggles;
    }

    if (!rules[fld]) {
      return visualToggles;
    }

    if (value === '__null__' || value === null) {
      if (!rules[fld]['__null__']) {
        return visualToggles;
      }

      for (const hideFld of rules[fld]['__null__']['show']) {
        visualToggles[hideFld] = true;
      }

      return visualToggles;
    }

    const normalizedValue = typeof value === 'boolean' ? value + 0 : value;

    if (!rules[fld][normalizedValue]) {
      if (rules[fld]['__default__']) {
        for (const showFld of rules[fld]['__default__']['show']) {
          visualToggles[showFld] = true;
        }
      }

      return visualToggles;
    }

    for (const showFld of rules[fld][normalizedValue]['show']) {
      visualToggles[showFld] = true;
    }

    return visualToggles;
  }

  public getDefultValues(): EntityValues {
    const response: EntityValues = {};
    const properties = this.getAllProperties();

    for (const idx in properties) {
      const property: ScalarProperty = properties[idx];
      if (property.default === undefined && !property.enum) {
        if (property.type === 'array') {
          response[idx] = [];
        } else if (idx.indexOf('.') > 0) {
          response[idx] = '';
        }
        continue;
      }

      if (property.default === undefined) {
        response[idx] = Object.keys(property.enum as any)[0];
      } else if (property.type === 'boolean') {
        response[idx] = parseInt(property.default, 10);
      } else {
        response[idx] = property.default;
      }
    }

    const embeddables: Record<string, EntityValues> = {};
    for (const idx in response) {
      if (idx.indexOf('.') < 0) {
        continue;
      }

      const nameSegments = idx.split('.');
      const parent = nameSegments[0] as string;
      const property = nameSegments[1] as string;

      if (!embeddables[parent]) {
        embeddables[parent] = {};
      }

      embeddables[parent][property] = response[idx];
      delete response[idx];
    }

    return {
      ...response,
      ...embeddables,
    };
  }

  public prepareFormData(payload: EntityValues): FormData | EntityValues {
    const files: { [idx: string]: File } = {};
    for (const idx in payload) {
      if (payload[idx] instanceof File) {
        files[idx] = payload[idx] as File;
        delete payload[idx];
      }
    }

    const isMultiPart = Object.keys(files).length > 0;
    if (!isMultiPart) {
      return payload;
    }

    const formData = new FormData();

    formData.append(this.getIden(true), JSON.stringify(payload));

    for (const idx in files) {
      formData.append(idx, files[idx]);
    }

    return formData;
  }

  public getCollectionPath(path: string | null = null): string | null {
    const collectionAction = this.actions?.get?.collection || {};

    const action = this.getFromModelList(collectionAction, path);

    return action?.paths[0];
  }

  public getItemPath(path: string | null = null): string | null {
    const itemActions = this.actions?.get?.item || {};

    const action = this.getFromModelList(itemActions, path);

    return action?.paths[0];
  }

  public getItemByModel(model: string): ActionModelSpec | null {
    const itemActions = this.actions?.get?.item || {};

    if (!itemActions[model]) {
      return null;
    }

    return JSON.parse(JSON.stringify(itemActions[model]));
  }

  public getPostPath(path: string | null = null): string | null {
    const itemActions = this.actions?.post || {};

    const action = this.getFromModelList(itemActions, path);

    return action?.paths[0];
  }

  public getPutPath(path: string | null = null): string | null {
    const itemActions = this.actions?.put || {};

    const action = this.getFromModelList(itemActions, path);

    return action?.paths[0];
  }

  public getDeletePath(path: string | null = null): string | null {
    const itemActions = this.actions?.delete || {};

    const action = this.getFromModelList(itemActions, path);

    return action?.paths[0];
  }

  public getTitle(): string | JSX.Element {
    return this.entityConfig.title;
  }

  public getOrderBy(): string {
    return this.entityConfig?.defaultOrderBy || '';
  }

  public getOrderDirection(): OrderDirection {
    return this.entityConfig?.defaultOrderDirection || OrderDirection.asc;
  }

  public getAcls(): EntityAclType {
    const create: boolean =
      this.entityConfig.acl.create && this.actions.post ? true : false;

    const read: boolean =
      this.entityConfig.acl.read && this.actions.get ? true : false;

    const detail: boolean =
      this.entityConfig.acl.detail && this.actions.get?.item ? true : false;

    const update: boolean =
      this.entityConfig.acl.update && this.actions.put ? true : false;

    const remove: boolean =
      this.entityConfig.acl.delete && this.actions.delete ? true : false;

    const acl = {
      create,
      read,
      detail,
      update,
      delete: remove,
    };

    return acl;
  }

  public getForeignKeyGetter(): ForeignKeyGetterType {
    return this.entityConfig.foreignKeyGetter;
  }

  public getListDecorator() {
    return this.entityConfig.ListDecorator;
  }

  public getPropertyFilters(
    propertyName: string,
    path?: string
  ): Array<SearchFilterType> {
    const filters = this.getFilters(path);

    return filters[propertyName] || [];
  }

  private getIden(lcFirst = false) {
    const response = this.entityConfig.iden;

    if (lcFirst) {
      return response.charAt(0).toLowerCase() + response.slice(1);
    }

    return response;
  }

  private getFilters(path?: string): any {
    const collectionAction = this.actions?.get?.collection || {};
    const action = this.getFromModelList(collectionAction, path);
    if (!action) {
      return {};
    }

    const filters: any = {};
    // eslint-disable-next-line
        const filterRegExp = new RegExp(/^([^\[]+)\[?([^\]]*)\]?/);
    const parameters: any = action.parameters || {};

    for (const idx in parameters) {
      const name = parameters[idx].name;
      const match = name.match(filterRegExp);
      const fieldName = match[1];
      let modifier = match[2] || null;
      if (!modifier) {
        if (name.indexOf('[]') >= 0) {
          modifier = 'in';
        } else if (parameters[idx].type === 'boolean') {
          modifier = '';
        } else {
          modifier = parameters[idx].type === 'string' ? 'exact' : 'eq';
        }
      }

      if (!filters[fieldName]) {
        filters[fieldName] = [];
      }

      if (filters[fieldName].includes(modifier)) {
        continue;
      }

      if (modifier === 'in' && filters[fieldName].includes('exact')) {
        const index = filters[fieldName].indexOf('exact');
        if (index > -1) {
          filters[fieldName].splice(index, 1);
        }
      }

      filters[fieldName].push(modifier);
    }

    return filters;
  }

  private getFromModelList(
    modelList: ActionModelList,
    path: string | null = null
  ): ActionModelSpec | null {
    if (path) {
      const filteresModelList: ActionModelList = {};
      for (const idx in modelList) {
        if (!modelList[idx].paths.includes(path)) {
          continue;
        }

        filteresModelList[idx] = modelList[idx];
      }

      return this.getFromModelList(filteresModelList, null);
    }

    const collectionModels = Object.keys(modelList);

    if (collectionModels.length) {
      return modelList[collectionModels[0]];
    }

    return null;
  }
}

import { CancelToken } from 'axios';
import { StoreContainer } from '../../store';
import { EntityValues } from '../entity/EntityService';
import EntityInterface from '../../entities/EntityInterface';

export interface GenericForeignKeyResolverProps {
  data: Array<EntityValues> | EntityValues;
  fkFld: string;
  entity: EntityInterface;
  addLink?: boolean;
  dataPreprocesor?: (data: Record<string, any>) => Promise<void>;
  cancelToken?: CancelToken;
}

export const entityObject2ListLink = async (
  props: GenericForeignKeyResolverProps,
  data: EntityValues[],
  response: any
) => {
  const { fkFld, entity, addLink = true, dataPreprocesor } = props;
  const { localPath, path, toStr } = entity;

  try {
    if (dataPreprocesor) {
      await dataPreprocesor(response);
    }
  } catch {}

  const entityReducer = async (accumulator: any, value: any) => {
    accumulator[value.id] = toStr(value);

    return accumulator;
  };

  const entities: any = {};
  for (const idx in response) {
    await entityReducer(entities, response[idx]);
  }

  for (const idx in data as EntityValues[]) {
    if (data[idx][fkFld]) {
      let fk = data[idx][fkFld];
      if (Array.isArray(fk)) {
        for (const key in fk) {
          fk[key] = entities[fk[key]];
        }

        data[idx][fkFld] = fk.join(', ');
        continue;
      } else if (typeof fk === 'object') {
        fk = (fk as EntityValues).id;
      }

      const scalarFk = fk as string | number;
      data[idx][`${fkFld}Id`] = data[idx][fkFld];
      if (addLink) {
        data[idx][`${fkFld}Link`] = `${localPath || path}/${scalarFk}/update`;
      }
      data[idx][fkFld] = entities[scalarFk];
    }
  }
};

export default async function genericForeignKeyResolver(
  props: GenericForeignKeyResolverProps
): Promise<Array<EntityValues> | EntityValues> {
  const { data, fkFld, entity, dataPreprocesor, cancelToken } = props;

  const { path, toStr } = entity;

  if (typeof data !== 'object') {
    return data;
  }

  if (
    !Array.isArray(data) &&
    (typeof data[fkFld] !== 'object' || data[fkFld] === null)
  ) {
    return data;
  }

  if (!Array.isArray(data)) {
    // Just flat view's detailed model

    try {
      if (dataPreprocesor && typeof data[fkFld] === 'object') {
        await dataPreprocesor(data[fkFld] as EntityValues);
      }
    } catch {}

    data[fkFld] = toStr(data[fkFld] as EntityValues);

    return data;
  }

  const ids: Array<number> = [];
  const embeded: Array<Record<string, unknown>> = [];
  for (const idx in data) {
    if (data[idx][fkFld]) {
      const val = data[idx][fkFld];
      const iterableValues: Array<any> = Array.isArray(val) ? val : [val];

      for (const value of iterableValues) {
        if (typeof value === 'object') {
          embeded.push(value);
          continue;
        }

        if (ids.includes(value)) {
          continue;
        }

        ids.push(value);
      }
    }
  }

  if (embeded.length) {
    await entityObject2ListLink(props, data, embeded);
  } else if (ids.length) {
    const getAction = StoreContainer.store.getActions().api.get;

    await getAction({
      path,
      params: {
        id: ids,
        _pagination: false,
        _itemsPerPage: 1000,
      },
      cancelToken: cancelToken,
      successCallback: async (response) =>
        await entityObject2ListLink(props, data, response),
    });
  }

  return data;
}

export const remapFk = (row: EntityValues, from: string, to: string): void => {
  row[to] = row[from];
  row[`${to}Id`] = row[`${from}Id`];
  row[`${to}Link`] = row[`${from}Link`];
};

import EntityService from '../../services/entity/EntityService';
import { CancelToken } from 'axios';
import { EntityList } from 'router/parseRoutes';
import { StoreContainer } from '../../store';
import { SelectOptionsType } from 'entities/EntityInterface';

type AutoSelectOptionsArgs = {
  cancelToken?: CancelToken;
  entities?: EntityList; // Deprecated
  entityService: EntityService;
  skip?: string[];
  response: Record<string, Array<unknown>> | any;
};

export const autoSelectOptions = (
  props: AutoSelectOptionsArgs
): Array<Promise<unknown>> => {
  const { cancelToken, response, entityService } = props;
  let { entities } = props;

  if (!entities) {
    entities = StoreContainer.store.getState().entities.entities;
  }

  if (!entities) {
    return [];
  }

  const skip = props.skip || [];

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
      if (cleanRef && cleanRef.indexOf('_') < 0) {
        console.log('autoSelectOptions', `${cleanRef} not found`);
      }
      continue;
    }

    if (!entity.selectOptions) {
      if (cleanRef && cleanRef.indexOf('_') < 0) {
        console.log(
          'autoSelectOptions',
          `${cleanRef} selectOption is not defined`
        );
      }
      continue;
    }

    promises.push(
      entity.selectOptions().then((selectOptions) =>
        selectOptions({
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
          cancelToken,
        })
      )
    );
  }

  return promises;
};

type AutoSelectOptionHandlersArgs = {
  entityService: EntityService;
  skip?: string[];
};

export const autoSelectOptionHandlers = async (
  props: AutoSelectOptionHandlersArgs
): Promise<Record<string, SelectOptionsType>> => {
  const { entityService } = props;
  const entities = StoreContainer.store.getState().entities.entities;

  const handlers: Record<string, SelectOptionsType> = {};

  if (!entities) {
    return handlers;
  }

  const skip = props.skip || [];

  const fkProperties = entityService?.getFkProperties();

  const promises: Array<Promise<void>> = [];

  for (const idx in fkProperties) {
    if (skip.includes(idx)) {
      continue;
    }

    const cleanRef = fkProperties[idx].$ref.replace('#/definitions/', '');
    const entity = entities[cleanRef];

    if (!entity) {
      if (cleanRef && cleanRef.indexOf('_') < 0) {
        console.log('autoSelectOptionsHandlers', `${cleanRef} not found`);
      }
      continue;
    }

    if (!entity.selectOptions) {
      if (cleanRef && cleanRef.indexOf('_') < 0) {
        console.log(
          'autoSelectOptionsHandlers',
          `${cleanRef} selectOption is not defined`
        );
      }
      continue;
    }

    if (!entity.dynamicSelectOptions) {
      continue;
    }

    const selectOptionsLoader = entity.selectOptions;

    if (!selectOptionsLoader) {
      continue;
    }

    promises.push(
      selectOptionsLoader().then((handler) => {
        handlers[cleanRef] = handler;
      })
    );
  }

  await Promise.all(promises);

  return handlers;
};

export default autoSelectOptions;

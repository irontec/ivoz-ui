import EntityService from '../../services/entity/EntityService';
import { CancelToken } from 'axios';
import { EntityList } from 'router/parseRoutes';
import { StoreContainer } from '../../store';

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
      if (cleanRef) {
        console.log('autoSelectOptions', `${cleanRef} not found`);
      }
      continue;
    }

    if (!entity.selectOptions) {
      if (cleanRef) {
        console.log(
          'autoSelectOptions',
          `${cleanRef} selectOption is not defined`
        );
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
        cancelToken,
      })
    );
  }

  return promises;
};

export default autoSelectOptions;

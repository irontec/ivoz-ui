import { ForeignKeyGetterType } from '@irontec/ivoz-ui/entities/EntityInterface';
import { autoSelectOptions } from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import { ClientPropertyList } from './ClientProperties';
import entities from '../index';

export const foreignKeyGetter: ForeignKeyGetterType = async ({
  cancelToken,
  entityService,
}): Promise<any> => {
  const response: ClientPropertyList<unknown> = {};

  const promises = autoSelectOptions({
    entities,
    entityService,
    cancelToken,
    response,
    skip: [],
  });

  await Promise.all(promises);

  return response;
};

import { autoForeignKeyResolver } from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import { foreignKeyResolverType } from '@irontec/ivoz-ui/entities/EntityInterface';
import genericForeignKeyResolver from '@irontec/ivoz-ui/services/api/genericForeigKeyResolver';

import entities from '../index';
import { PlatformPropertiesList } from '../Platform/PlatformProperties';
import { ClientPropertiesList } from './ClientProperties';

const foreignKeyResolver: foreignKeyResolverType = async function ({
  data,
  cancelToken,
  entityService,
}): Promise<ClientPropertiesList> {
  const promises = autoForeignKeyResolver({
    data,
    cancelToken,
    entityService,
    entities,
    skip: ['platform'],
  });

  promises.push(
    genericForeignKeyResolver({
      data,
      fkFld: 'platform',
      entity: entities.Platform,
      cancelToken,
      dataPreprocesor: async (rows) => {
        for (const idx in data) {
          const platform = (rows as PlatformPropertiesList).find(
            (row) => row.id === data[idx].platform
          );
          data[idx].platformType = platform?.type;
        }
      },
    })
  );

  await Promise.all(promises);

  return data;
};

export default foreignKeyResolver;

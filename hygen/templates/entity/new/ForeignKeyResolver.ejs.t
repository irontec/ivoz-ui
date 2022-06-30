---
to: src/entities/<%= Name %>/ForeignKeyResolver.tsx
---
import { autoForeignKeyResolver } from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import { foreignKeyResolverType } from '@irontec/ivoz-ui/entities/EntityInterface';
import entities from '../index';
import { <%= Name %>PropertiesList } from './<%= Name %>Properties';

const foreignKeyResolver: foreignKeyResolverType = async function (
  { data, cancelToken, entityService },
): Promise<<%= Name %>PropertiesList> {

  const promises = autoForeignKeyResolver({
    data, cancelToken, entityService, entities,
  });

  await Promise.all(promises);

  return data;
};

export default foreignKeyResolver;
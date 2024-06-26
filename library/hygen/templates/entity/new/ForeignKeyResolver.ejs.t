---
to: src/entities/<%= Name %>/ForeignKeyResolver.tsx
---
import { autoForeignKeyResolver } from '@irontec-voip/ivoz-ui/entities/DefaultEntityBehavior';
import { foreignKeyResolverType } from '@irontec-voip/ivoz-ui/entities/EntityInterface';
import { <%= Name %>PropertiesList } from './<%= Name %>Properties';

/** TODO remove this file unless you need to change default behaviour **/
const foreignKeyResolver: foreignKeyResolverType = async function (
  { data, cancelToken, entityService },
): Promise<<%= Name %>PropertiesList> {

  const promises = autoForeignKeyResolver({
    data, cancelToken, entityService,
  });

  await Promise.all(promises);

  return data;
};

export default foreignKeyResolver;
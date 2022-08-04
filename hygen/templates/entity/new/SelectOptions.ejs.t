---
to: src/entities/<%= Name %>/SelectOptions.ts
---
import defaultEntityBehavior from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import { SelectOptionsType } from '@irontec/ivoz-ui/entities/EntityInterface';
import store from 'store';

const <%= Name %>SelectOptions: SelectOptionsType = ({ callback, cancelToken }): Promise<unknown> => {

  const entities = store.getState().entities.entities;
  const <%= name %> = entities.<%= name %>;

  return defaultEntityBehavior.fetchFks(
    <%= name %>.path,
    ['id'],
    (data: any) => {

      const options: any = {};
      for (const item of data) {
        options[item.id] = item.id;
      }

      callback(options);
    },
    cancelToken,
  );
};

export default <%= Name %>SelectOptions;
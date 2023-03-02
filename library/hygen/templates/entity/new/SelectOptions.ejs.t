---
to: src/entities/<%= Name %>/SelectOptions.ts
---
import defaultEntityBehavior from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import { SelectOptionsType } from '@irontec/ivoz-ui/entities/EntityInterface';
import { <%= Name %>PropertiesList } from './<%= Name %>Properties';
import { DropdownChoices } from '@irontec/ivoz-ui';
import store from 'store';

const <%= Name %>SelectOptions: SelectOptionsType = ({ callback, cancelToken }): Promise<unknown> => {

  const entities = store.getState().entities.entities;
  const <%= Name %> = entities.<%= Name %>;

  return defaultEntityBehavior.fetchFks(
    <%= Name %>.path,
    ['id', 'name'],
    (data: <%= Name %>PropertiesList) => {

      const options: DropdownChoices = [];
      for (const item of data) {
        options.push({ id: item.id as number, label: item.name as string });
      }

      callback(options);
    },
    cancelToken,
  );
};

export default <%= Name %>SelectOptions;
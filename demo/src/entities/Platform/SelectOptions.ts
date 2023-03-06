import { DropdownChoices } from '@irontec/ivoz-ui';
import defaultEntityBehavior from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import { SelectOptionsType } from '@irontec/ivoz-ui/entities/EntityInterface';
import platform from './Platform';

const PlatformSelectOptions: SelectOptionsType = ({
  callback,
  cancelToken,
}): Promise<unknown> => {
  return defaultEntityBehavior.fetchFks(
    platform.path + '?_order[name]=ASC',
    ['id', 'name'],
    (data: any) => {
      const options: DropdownChoices = [];
      for (const item of data) {
        options.push({ id: item.id, label: item.name });
      }

      callback(options);
    },
    cancelToken
  );
};

export default PlatformSelectOptions;

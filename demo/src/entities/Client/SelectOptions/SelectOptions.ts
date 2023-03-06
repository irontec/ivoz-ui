import { DropdownChoices } from '@irontec/ivoz-ui';
import defaultEntityBehavior from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import { SelectOptionsType } from '@irontec/ivoz-ui/entities/EntityInterface';
import client from '../Client';
import { ClientPropertiesList } from '../ClientProperties';

const ClientSelectOptions: SelectOptionsType = ({
  callback,
  cancelToken,
}): Promise<unknown> => {
  return defaultEntityBehavior.fetchFks(
    client.path,
    ['id', 'iden'],
    (data: ClientPropertiesList) => {
      const options: DropdownChoices = [];
      for (const item of data) {
        options.push({ id: item.id as number, label: item.iden as string });
      }

      callback(options, data);
    },
    cancelToken
  );
};

export default ClientSelectOptions;

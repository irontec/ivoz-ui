import { DropdownChoices } from '@irontec/ivoz-ui';
import { SelectOptionsType } from '@irontec/ivoz-ui/entities/EntityInterface';
import store from 'store';

import Client from '../Client';

interface CustomProps {
  platformId: number | string;
}

const RemoteIdSelectOptions: SelectOptionsType<CustomProps> = (
  { callback, cancelToken },
  customProps
): Promise<unknown> => {
  const platformId = customProps?.platformId;

  const params: Record<string, unknown> = {
    _platformId: platformId,
  };

  const getAction = store.getActions().api.get;

  return getAction({
    path: `${Client.path}/available`,
    params,
    successCallback: async (data) => {
      const hintedData = data as Array<{
        id: number;
        name: string;
        domain: string;
      }>;
      const choices: DropdownChoices = [];
      for (const item of hintedData) {
        choices.push({
          id: item.id,
          label: item.name,
        });
      }

      callback(choices, hintedData);
    },
    cancelToken,
    silenceErrors: true,
  });
};

export default RemoteIdSelectOptions;

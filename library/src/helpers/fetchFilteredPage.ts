import { CancelToken } from 'axios';
import { StoreContainer } from '../store';
import { FetchFksCallback } from '../entities/EntityInterface';

import { DropdownArrayChoice, DropdownChoices } from '../services';

export type fetchFilteredPageProps = {
  endpoint: string;
  params: Record<string, unknown>;
  setter: FetchFksCallback;
  cancelToken?: CancelToken;
};

export const fetchFilteredPage = async (
  props: fetchFilteredPageProps
): Promise<unknown> => {
  const { endpoint, params, setter, cancelToken } = props;

  const getAction = StoreContainer.store.getActions().api.get;

  const response: DropdownChoices = [];
  try {
    await getAction({
      path: endpoint,
      silenceErrors: false,
      params: {
        _itemsPerPage: 20,
        ...params,
        _pagination: true,
        _page: 1,
      },
      successCallback: async (data) => {
        response.push(...(data as Array<DropdownArrayChoice>));
      },
      cancelToken,
    });
  } catch (error) {
    console.error(error);
  }

  setter(response);

  return response;
};

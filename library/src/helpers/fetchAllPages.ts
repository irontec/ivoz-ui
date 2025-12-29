import { CancelToken } from 'axios';
import { StoreContainer } from '../store';
import { FetchFksCallback } from '../entities/EntityInterface';

import { DropdownArrayChoice, DropdownChoices } from '../services';

export type fetchAllPagesProps = {
  endpoint: string;
  params: Record<string, unknown>;
  setter: FetchFksCallback;
  cancelToken?: CancelToken;
};

export const fetchAllPages = async (
  props: fetchAllPagesProps
): Promise<unknown> => {
  const { endpoint, params, setter, cancelToken } = props;

  const getAction = StoreContainer.store.getActions().api.get;

  let keepGoing = true;
  let _page: number = parseInt(
    endpoint.match(/_page=([0-9]+)/)?.[1] || '1',
    10
  );

  const response: DropdownChoices = [];
  while (keepGoing) {
    try {
      const result = await getAction({
        path: endpoint,
        silenceErrors: false,
        params: {
          _itemsPerPage: 200,
          ...params,
          _page,
        },
        successCallback: async (data, headers: Record<string, string>) => {
          response.push(...(data as Array<DropdownArrayChoice>));

          const totalItems = parseInt(
            headers?.['x-total-items'] || `${response.length}`,
            10
          );
          const totalPages = parseInt(headers?.['x-total-pages'] || '1', 10);
          const isLastPage = _page >= totalPages;
          const hasAllItems = response.length >= totalItems;
          const isEmptyResponse = !(data as Array<DropdownArrayChoice>).length;

          if (isLastPage || hasAllItems || isEmptyResponse) {
            keepGoing = false;
          }
          _page++;
        },
        cancelToken,
      });

      if (!result) {
        // Cancel token or 403
        break;
      }
    } catch (error) {
      console.error(error);
      break;
    }
  }

  setter(response);

  return response;
};

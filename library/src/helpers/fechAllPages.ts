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
  let loopCount = 0;
  while (keepGoing) {
    try {
      if (loopCount > 5) {
        console.error('Too much requests');
        break;
      }

      loopCount++;
      const result = await getAction({
        path: endpoint,
        silenceErrors: false,
        params: {
          ...params,
          _pagination: false,
          _itemsPerPage: 200,
          _page,
        },
        successCallback: async (data, headers: Record<string, string>) => {
          response.push(...(data as Array<DropdownArrayChoice>));

          const totalItems = parseInt(
            headers?.['x-total-items'] || `${response.length}`,
            10
          );

          if (
            response.length >= totalItems ||
            !(data as Array<DropdownArrayChoice>).length
          ) {
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

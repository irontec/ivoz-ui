import useCancelToken from '@irontec/ivoz-ui/hooks/useCancelToken';
import { useEffect, useState } from 'react';
import { useStoreActions } from 'store';

import Client from '../../Client/Client';
import { ClientPropertyList } from '../../Client/ClientProperties';
import Platform from '../../Platform/Platform';
import { PlatformPropertyList } from '../../Platform/PlatformProperties';

type ClientPlatformType = { id: number };

const useParents = (clientId: number) => {
  const [parent, setParent] =
    useState<ClientPropertyList<ClientPlatformType> | null>(null);
  const [grandParent, setGrandParent] =
    useState<PlatformPropertyList<unknown> | null>(null);

  const [, cancelToken] = useCancelToken();
  const apiGet = useStoreActions((actions) => {
    return actions.api.get;
  });

  useEffect(() => {
    apiGet({
      path: `${Client.path}/${clientId}`,
      params: {},
      successCallback: async (client) => {
        setParent(client as PlatformPropertyList<ClientPlatformType>);
      },
      cancelToken,
    });
  }, [apiGet, clientId, cancelToken]);

  useEffect(() => {
    if (!parent || !parent.platform?.id) {
      return;
    }

    apiGet({
      path: `${Platform.path}/${parent.platform.id}`,
      params: {},
      successCallback: async (platform) => {
        setGrandParent(platform as PlatformPropertyList<unknown>);
      },
      cancelToken,
    });
  }, [apiGet, parent, cancelToken]);

  return [parent, grandParent] as const;
};

export default useParents;

import { useState, useEffect } from 'react';
import Client from '../../Client/Client';
import { ClientPropertyList } from '../../Client/ClientProperties';
import Platform from '../../Platform/Platform';
import { PlatformPropertyList } from '../../Platform/PlatformProperties';
import { useStoreActions } from 'store';
import useCancelToken from '@irontec/ivoz-ui/hooks/useCancelToken';

const useParents = (clientId: number) => {
  const [parent, setParent] = useState<ClientPropertyList<any> | null>(null);
  const [grandParent, setGrandParent] =
    useState<PlatformPropertyList<any> | null>(null);

  const [, cancelToken] = useCancelToken();
  const apiGet = useStoreActions((actions) => {
    return actions.api.get;
  });

  useEffect(() => {
    apiGet({
      path: Client.path + `/${clientId}`,
      params: {},
      successCallback: async (client) => {
        setParent(client);
      },
      cancelToken,
    });
  }, [apiGet, clientId, cancelToken]);

  useEffect(() => {
    if (!parent || !parent.platform?.id) {
      return;
    }

    apiGet({
      path: Platform.path + `/${parent.platform.id}`,
      params: {},
      successCallback: async (platform) => {
        setGrandParent(platform);
      },
      cancelToken,
    });
  }, [apiGet, parent, cancelToken]);

  return [parent, grandParent] as const;
};

export default useParents;

import { useFormikType } from '@irontec/ivoz-ui';
import { useEffect, useState } from 'react';
import { PathMatch } from 'react-router-dom';
import { useStoreActions } from 'store';

import Platform from '../../Platform/Platform';
import { PlatformPropertyList } from '../../Platform/PlatformProperties';

interface useShowRemoteIdProps {
  create: boolean | undefined;
  filterBy: string | undefined;
  formik: useFormikType;
  match: PathMatch;
}

const useShowRemoteId = (props: useShowRemoteIdProps): boolean => {
  const { create, filterBy, formik, match } = props;

  const platformId = filterBy
    ? (match.params as Record<string, unknown>).parent_id_1
    : formik.values.platform;

  const hasPlatformId = platformId !== '';

  const [isRemotePlatform, setIsRemotePlatform] = useState(false);
  const apiGet = useStoreActions((actions) => {
    return actions.api.get;
  });

  useEffect(() => {
    if (!hasPlatformId) {
      return;
    }

    if (!create) {
      return;
    }

    apiGet({
      path: `${Platform.path}/${platformId}`,
      params: {
        _properties: ['type'],
      },
      successCallback: async (data) => {
        setIsRemotePlatform(
          (data as PlatformPropertyList<string>).type !== 'other'
        );
      },
    });
  }, [platformId, create, hasPlatformId, apiGet, setIsRemotePlatform]);

  return isRemotePlatform;
};

export default useShowRemoteId;

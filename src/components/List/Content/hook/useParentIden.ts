import { useEffect, useState } from 'react';
import { Location } from 'history';
import { match } from 'react-router-dom';
import { CancelToken } from 'axios';
import { useStoreActions, useStoreState } from '../../../../store';
import EntityInterface from '../../../../entities/EntityInterface';

type useParentIden = {
  match: match;
  location: Location<Record<string, string> | undefined>;
  parentEntity?: EntityInterface;
  cancelToken: CancelToken;
};

const useParentIden = (props: useParentIden): string | undefined => {
  const { location, parentEntity, match, cancelToken } = props;
  const { state: locationState } = location;

  const parentId = Object.values(match.params).pop();

  const [iden, setIden] = useState<string | undefined>(
    locationState?.referrerIden
  );
  const parentRow = useStoreState((state) => state.list.parentRow);

  const apiGet = useStoreActions((actions) => {
    return actions.api.get;
  });
  const setParentRow = useStoreActions((actions) => {
    return actions.list.setParentRow;
  });

  useEffect(() => {

    if (
      iden
      && parentRow
      && (!locationState?.referrerIden || iden === locationState?.referrerIden)
    ) {
      return;
    }

    if (!parentEntity) {
      setIden(undefined);
      setParentRow(undefined);
      return;
    }

    if (!parentId) {
      setIden(undefined);
      setParentRow(undefined);
      return;
    }

    apiGet({
      path: parentEntity.path + `/${parentId}`,
      params: {},
      successCallback: async (data: any) => {
        setParentRow(data);
        setIden(parentEntity.toStr(data));
      },
      cancelToken,
    });
  }, [
    locationState,
    parentId,
    parentRow,
    iden,
    parentEntity,
    apiGet,
    cancelToken,
  ]);

  return iden;
};

export default useParentIden;

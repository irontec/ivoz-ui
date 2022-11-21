import { CancelToken } from 'axios';
import { useEffect, useState } from 'react';
import { EntityValues } from '../services';
import EntityInterface from '../entities/EntityInterface';
import { useStoreActions } from '../store';
import useCancelToken from './useCancelToken';
import { PathMatch, useParams } from 'react-router-dom';

type useParentRowProps = {
  parentEntity: EntityInterface;
  match: PathMatch;
  parentId?: string | number | undefined;
  cancelToken?: CancelToken;
};

const useParentRow = <T extends {} = EntityValues>(
  props: useParentRowProps
): T | null | undefined => {
  const { parentEntity, match } = props;
  let { parentId } = props;

  const params = useParams();

  let { cancelToken } = props;
  if (!cancelToken) {
    [, cancelToken] = useCancelToken();
  }

  if (!parentId) {
    const myParams = { ...params } as Record<string, string>;
    for (const idx in myParams) {
      if (idx.indexOf('parent_id') === 0) {
        continue;
      }

      delete myParams[idx];
    }

    parentId = Object.values(myParams).pop() || '';
  }

  const [row, setRow] = useState<T | null | undefined>(undefined);
  const apiGet = useStoreActions((actions) => {
    return actions.api.get;
  });

  useEffect(() => {
    if (!parentId) {
      setRow(null);
      return;
    }

    apiGet({
      path: parentEntity.path + `/${parentId}`,
      params: {},
      successCallback: async (data: any) => {
        setRow(data);
      },
      cancelToken,
    });
  }, [parentId, parentEntity]);

  return row;
};

export default useParentRow;

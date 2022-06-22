import { CancelToken } from 'axios';
import { useEffect, useState } from 'react';
import { EntityValues } from '../services';
import EntityInterface from "../entities/EntityInterface";
import { useStoreActions } from '../store';
import useCancelToken from './useCancelToken';
import { match } from 'react-router-dom';

type useParentRowProps = {
    parentEntity: EntityInterface,
    match: match,
    cancelToken?: CancelToken,
}

const useParentRow = <T = EntityValues>(props: useParentRowProps): T | undefined => {

    const { parentEntity, match } = props;

    let { cancelToken } = props;
    if (!cancelToken) {
        [,cancelToken] = useCancelToken();
    }

    const params = {...match.params} as Record<string, string>;
    for (const idx in params) {

      if (idx.indexOf('parent_id') === 0) {
        continue;
      }

      delete params[idx];
    }

    const parentId = Object.values(params).pop() || '';

    const [row, setRow] = useState<T | undefined>(undefined);
    const apiGet = useStoreActions((actions) => {
        return actions.api.get;
    });

    useEffect(
        () => {

            if (!parentId) {
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
        },
        [parentId, parentEntity]
    );

    return row;
}

export default useParentRow;
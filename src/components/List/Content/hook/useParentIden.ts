import { useEffect, useState } from 'react';
import { Location } from 'history';
import { match } from 'react-router-dom';
import { CancelToken } from 'axios';
import { useStoreActions } from '../../../../store';
import EntityInterface from "../../../../entities/EntityInterface";

type useParentIden = {
    match: match,
    location: Location<Record<string, string> | undefined>,
    parentEntity?: EntityInterface,
    cancelToken: CancelToken,
}

const useParentIden = (props: useParentIden): string | undefined => {

    const { location, parentEntity, match, cancelToken } = props;
    const parentId = Object.values(match.params).pop();

    const [iden, setIden] = useState<string | undefined>(location.state?.referrerIden);
    const apiGet = useStoreActions((actions) => {
        return actions.api.get;
      });

    useEffect(
        () => {
            if (iden) {
                return;
            }

            if (!parentEntity) {
                return;
            }

            if (!parentId) {
                return;
            }

            apiGet({
                path: parentEntity.path + `/${parentId}`,
                params: {},
                successCallback: async (data: any) => {
                    setIden(
                        parentEntity.toStr(data)
                    );
                },
                cancelToken,
            });
        },
        [parentId, iden, parentEntity, apiGet, cancelToken]
    );

    return iden;
}

export default useParentIden;
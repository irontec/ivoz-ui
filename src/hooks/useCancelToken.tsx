/* eslint-disable no-script-url */

import { useState, useEffect } from 'react';
import { useStoreState } from '../store';
import { CancelTokenSource, CancelToken } from 'axios';

const useCancelToken = function (): [boolean, CancelToken] {

    const cancelTokenSourceFactory = useStoreState(
        (store) => store.api.reqCancelTokenSourceFactory
    );
    const [cancelTokenSource,] = useState<CancelTokenSource>(cancelTokenSourceFactory());
    const [mounted, setMounted] = useState<boolean>(true);
    const cancelToken = cancelTokenSource.token;

    useEffect(
        () => {
            // Make this compatible with react strict mode
            setMounted(true);

            return () => {
                setMounted(false);
                cancelTokenSource.cancel();
            }
        },
        [cancelTokenSource]
    );

    return [mounted, cancelToken];
}

export default useCancelToken;


import { useState, useEffect, FunctionComponent, ComponentClass } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { useStoreActions } from '../store';
import EntityService from '../services/entity/EntityService';
import useCancelToken from '../hooks/useCancelToken';
import { useLocation, useParams } from 'react-router-dom';

const withRowData = (
  Component: FunctionComponent | ComponentClass
): FunctionComponent => {
  const displayName = `withRowData(${Component.displayName || Component.name})`;
  const C: any = (props: any): JSX.Element | null => {
    const { entityService }: { entityService: EntityService } = props;

    const location = useLocation();
    const params = useParams();
    const entityId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [row, setRow] = useState({});

    const apiGet = useStoreActions((actions) => {
      return actions.api.get;
    });
    const [, cancelToken] = useCancelToken();

    useEffect(
      () => {
        setLoading(true);
      },
      [location, setLoading]
    );

    useEffect(() => {
      const mounted = true;
      if (loading) {
        const itemPath = entityService.getItemPath();
        if (!itemPath) {
          throw new Error('Unknown item path');
        }

        apiGet({
          path: itemPath.replace('{id}', entityId),
          params: {},
          successCallback: async (data: any) => {
            if (!mounted) {
              return;
            }

            setRow(data);
            setLoading(false);
          },
          cancelToken,
        });
      }
    }, [loading, entityId, entityService, apiGet]);

    if (loading) {
      return null;
    }

    return <Component row={row} {...props} />;
  };

  C.displayName = displayName;
  C.WrappedComponent = Component;

  return hoistStatics(C, Component);
};

export default withRowData;

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EntityFormType } from '../entities/DefaultEntityBehavior';
import EntityInterface from '../entities/EntityInterface';
import useCancelToken from '../hooks/useCancelToken';
import useCurrentPathMatch from '../hooks/useCurrentPathMatch';
import findRoute from '../router/findRoute';
import { RouteMap } from '../router/routeMapParser';
import EntityService, { EntityValues } from '../services/entity/EntityService';
import { useStoreActions } from '../store';
import ErrorBoundary from './ErrorBoundary';
import { getMarshallerWhiteList } from './form.helper';
import withRowData from './withRowData';
import { Box } from '@mui/material';
import _ from '../services/translations/translate';

type EditProps = EntityInterface & {
  entityService: EntityService;
  routeMap: RouteMap;
  row: Record<string, any>;
  Form: () => Promise<EntityFormType>;
};

const Edit: any = (props: EditProps) => {
  const { marshaller, unmarshaller, row, routeMap, entityService } = props;

  const { Form: EntityFormLoader } = props;
  const [EntityForm, setEntityForm] = useState<EntityFormType | null>(null);

  useEffect(() => {
    EntityFormLoader().then((Form) => {
      setEntityForm(() => Form);
    });
  }, []);

  const setFlashMsg = useStoreActions(actions => actions.flashMsg.setFlashMsg);
  const location = useLocation();
  const match = useCurrentPathMatch();
  const navigate = useNavigate();

  const parentRoute = findRoute(routeMap, match);
  const filterBy = parentRoute?.filterBy;
  const fixedValues = parentRoute?.fixedValues;
  const filterValues = parentRoute?.filterValues;

  const baseUrl = process.env.BASE_URL || '/';
  let parentPath = parentRoute
    ? `${baseUrl}${parentRoute?.route?.substring(1)}`
    : null;

  if (parentPath) {
    for (const idx in match.params) {
      parentPath = parentPath.replace(`:${idx}`, match.params[idx] as string);
    }
  }

  const entityId = match.params.id as string;

  const apiPut = useStoreActions((actions) => actions.api.put);
  const [, cancelToken] = useCancelToken();

  const properties = entityService.getProperties();

  const initialValues = {
    ...entityService.getDefultValues(),
    ...unmarshaller(row, properties),
  };

  const onSubmit = async (values: EntityValues) => {
    const putPath = entityService.getPutPath();
    if (!putPath) {
      throw new Error('Unknown item path');
    }

    const whitelist = getMarshallerWhiteList({
      filterBy,
      fixedValues,
      filterValues,
    });
    const payload = marshaller(
      values,
      entityService.getAllProperties(),
      whitelist
    );
    const formData = entityService.prepareFormData(payload);

    try {
      const resp = await apiPut({
        path: putPath.replace('{id}', entityId),
        values: formData,
        cancelToken,
      });

      if (resp !== undefined) {
        const referrer = location.state?.referrer || '';
        const targetPath =
          referrer.search(parentPath) === 0 ? referrer : parentPath;

        if (targetPath === null) {
          setFlashMsg({
            msg: _('Entity sucessfully updated'),
            type: 'success',
          });

          return;
        }

        navigate(targetPath, {
          state: {
            referrer: location.pathname,
          },
        });
      } else {
        console.info('unexpected form response', resp);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!EntityForm) {
    return null;
  }

  return (
    <Box className='card'>
      <ErrorBoundary>
        <EntityForm
          {...props}
          initialValues={initialValues}
          filterBy={filterBy}
          fixedValues={fixedValues}
          filterValues={filterValues}
          onSubmit={onSubmit}
          edit={true}
          match={match}
        />
      </ErrorBoundary>
    </Box>
  );
};

export default withRowData(Edit);

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { EntityFormType } from '../entities/DefaultEntityBehavior';
import EntityInterface from '../entities/EntityInterface';
import useCancelToken from '../hooks/useCancelToken';
import useCurrentPathMatch from '../hooks/useCurrentPathMatch';
import findRoute from '../router/findRoute';
import { RouteMap } from '../router/routeMapParser';
import { ScalarProperty } from '../services/api/ParsedApiSpecInterface';
import EntityService, { EntityValues } from '../services/entity/EntityService';
import _ from '../services/translations/translate';
import { useStoreActions } from '../store';
import ErrorBoundary from './ErrorBoundary';
import { getMarshallerWhiteList } from './form.helper';
import { FormikHelpers } from 'formik';

type CreateProps = EntityInterface & {
  entityService: EntityService;
  routeMap: RouteMap;
  Form: () => Promise<EntityFormType>;
};

const Create = (props: CreateProps) => {
  const { marshaller, unmarshaller, path, routeMap, entityService } = props;

  const { Form: EntityFormLoader } = props;
  const [EntityForm, setEntityForm] = useState<EntityFormType | null>(null);

  useEffect(() => {
    EntityFormLoader()
      .then((Form) => {
        setEntityForm(() => Form);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const setFlashMsg = useStoreActions(
    (actions) => actions.flashMsg.setFlashMsg
  );
  const location = useLocation();
  const match = useCurrentPathMatch();
  const params = useParams();
  const navigate = useNavigate();

  const parentRoute = findRoute(routeMap, match);
  const filterBy = parentRoute?.filterBy;
  const fixedValues = parentRoute?.fixedValues;
  const filterValues = parentRoute?.filterValues;
  const sanitizedInitialFilterValues = Object.fromEntries(
    Object.entries(filterValues || {}).filter(([key, value]) => {
      return key.indexOf('[') === -1 && !Array.isArray(value);
    })
  );

  const baseUrl = process.env.BASE_URL || '/';
  let parentPath = `${baseUrl}${parentRoute?.route?.substring(1)}` || '';
  for (const idx in params) {
    parentPath = parentPath.replace(`:${idx}`, params[idx] as string);
  }

  const apiPost = useStoreActions((actions) => actions.api.post);
  const [, cancelToken] = useCancelToken();

  const properties = entityService.getProperties();

  let initialValues: EntityValues = {
    ...entityService.getDefultValues(),
    ...props.initialValues,
    ...fixedValues,
    ...sanitizedInitialFilterValues,
  };

  for (const idx in properties) {
    if (initialValues[idx] !== undefined) {
      continue;
    }

    const isBoolean = (properties[idx] as ScalarProperty)?.type === 'boolean';
    initialValues[idx] = isBoolean ? 0 : '';
  }

  initialValues = unmarshaller(initialValues, properties);

  const onSubmit = async (
    values: EntityValues,
    actions: FormikHelpers<EntityValues>
  ) => {
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
      const resp = await apiPost({
        path,
        values: formData,
        contentType: 'application/json',
        cancelToken,
      });

      if (resp !== undefined) {
        const referrer = location.state?.referrer || '';
        const targetPath =
          referrer.search(parentPath) === 0 ? referrer : parentPath;

        if (targetPath === null || targetPath === location.pathname) {
          setFlashMsg({
            msg: _('Entity sucessfully created'),
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
    } finally {
      actions.setSubmitting(false);
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
          filterBy={filterBy}
          fixedValues={fixedValues}
          filterValues={filterValues}
          initialValues={initialValues}
          onSubmit={onSubmit}
          entityService={entityService}
          create={true}
          match={match}
        />
      </ErrorBoundary>
    </Box>
  );
};

export default Create;

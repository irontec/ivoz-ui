import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { EntityFormType } from '../entities/DefaultEntityBehavior';
import EntityInterface from '../entities/EntityInterface';
import useCancelToken from '../hooks/useCancelToken';
import useCurrentPathMatch from '../hooks/useCurrentPathMatch';
import findRoute from '../router/findRoute';
import { RouteMap } from '../router/routeMapParser';
import { ScalarProperty } from '../services/api/ParsedApiSpecInterface';
import EntityService, { EntityValues } from '../services/entity/EntityService';
import { getMarshallerWhiteList } from './form.helper';
import { useStoreActions } from '../store';
import ErrorBoundary from './ErrorBoundary';
import { useEffect, useState } from 'react';

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
    EntityFormLoader().then((Form) => {
      setEntityForm(() => Form);
    });
  }, []);

  const location = useLocation();
  const match = useCurrentPathMatch();
  const params = useParams();
  const navigate = useNavigate();

  const parentRoute = findRoute(routeMap, match);
  const filterBy = parentRoute?.filterBy;
  const fixedValues = parentRoute?.fixedValues;
  const filterValues = parentRoute?.filterValues;

  let parentPath = parentRoute?.route || '';
  for (const idx in params) {
    parentPath = parentPath.replace(`:${idx}`, params[idx] as string);
  }

  const apiPost = useStoreActions((actions) => actions.api.post);
  const [, cancelToken] = useCancelToken();

  const properties = entityService.getProperties();

  let initialValues: EntityValues = {
    ...entityService.getDefultValues(),
    ...props.initialValues,
  };

  for (const idx in properties) {
    if (initialValues[idx] !== undefined) {
      continue;
    }

    const isBoolean = (properties[idx] as ScalarProperty)?.type === 'boolean';
    initialValues[idx] = isBoolean ? 0 : '';
  }

  initialValues = unmarshaller(initialValues, properties);

  const onSubmit = async (values: EntityValues) => {
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
        const referrer = location.state.referrer;
        const targetPath =
          referrer.search(parentPath) === 0 ? referrer : parentPath;

        navigate(targetPath, {
          state: {
            referrer: location.pathname,
          },
        });
      }
    } catch {}
  };

  if (!EntityForm) {
    return null;
  }

  return (
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
  );
};

export default Create;

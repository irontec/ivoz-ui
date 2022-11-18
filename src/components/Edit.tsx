import { useEffect, useState } from 'react';
import {
  useMatch,
  useLocation,
  useNavigate,
  PathMatch,
} from 'react-router-dom';
import { useFormik } from 'formik';
import { useStoreActions, useStoreState } from '../store';
import ErrorMessage from '../components/shared/ErrorMessage';
import EntityService from '../services/entity/EntityService';
import EntityInterface from '../entities/EntityInterface';
import { useFormikType } from '../services/form/types';
import withRowData from './withRowData';
import { KeyValList } from '../services/api/ParsedApiSpecInterface';
import useCancelToken from '../hooks/useCancelToken';
import SaveButton from './shared/Button/SaveButton';
import { RouteMap } from '../router/routeMapParser';
import findRoute from '../router/findRoute';
import { EntityFormType } from '../entities/DefaultEntityBehavior';
import useRememberedValues from './shared/useRememberedValues';

type EditProps = EntityInterface & {
  entityService: EntityService;
  routeMap: RouteMap;
  row: Record<string, any>;
  Form: EntityFormType;
};

const Edit: any = (props: EditProps) => {
  const { marshaller, unmarshaller, row, routeMap, entityService } = props;

  const { Form: EntityForm } = props;

  const location = useLocation();
  const match = useMatch(location.pathname) as PathMatch;
  const navigate = useNavigate();

  const parentRoute = findRoute(routeMap, match);
  const filterBy = parentRoute?.filterBy;
  const fixedValues = parentRoute?.fixedValues;

  let parentPath = parentRoute?.route || '';
  for (const idx in match.params) {
    parentPath = parentPath.replace(`:${idx}`, match.params[idx] as string);
  }

  const entityId = match.params.id as string;

  const reqError = useStoreState((store) => store.api.errorMsg);
  const apiPut = useStoreActions((actions) => actions.api.put);
  const [, cancelToken] = useCancelToken();
  const [validationError, setValidationError] = useState<KeyValList>({});

  const properties = entityService.getProperties();

  const initialValues = unmarshaller(row, properties);

  const formik: useFormikType = useFormik({
    initialValues,
    validate: (values: any) => {
      if (fixedValues) {
        for (const idx in fixedValues) {
          values[idx] = fixedValues[idx];
        }
      }

      const visualToggles = entityService.getVisualToggles(values);

      const validationErrors = props.validator(
        values,
        properties,
        visualToggles
      );
      setValidationError(validationErrors);

      return validationErrors;
    },
    onSubmit: async (values: any) => {
      const putPath = entityService.getPutPath();
      if (!putPath) {
        throw new Error('Unknown item path');
      }

      const payload = marshaller(values, properties);
      const formData = entityService.prepareFormData(payload);

      try {
        const resp = await apiPut({
          path: putPath.replace('{id}', entityId),
          values: formData,
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
    },
  });

  const rememberedValues = useRememberedValues(formik);

  useEffect(() => {
    for (const idx in rememberedValues) {
      formik.setFieldValue(idx, rememberedValues[idx]);
    }
  }, [rememberedValues]);

  const errorList: { [k: string]: JSX.Element } = {};
  for (const idx in validationError) {
    if (!formik.touched[idx]) {
      continue;
    }

    errorList[idx] = (
      <li key={idx}>
        <>
          {properties[idx].label}: {validationError[idx]}
        </>
      </li>
    );
  }

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <EntityForm
          {...props}
          formik={formik}
          edit={true}
          validationErrors={errorList}
          match={match}
          filterBy={filterBy}
        />

        <SaveButton />
        {reqError && <ErrorMessage message={reqError} />}
      </form>
    </div>
  );
};

export default withRowData(Edit);

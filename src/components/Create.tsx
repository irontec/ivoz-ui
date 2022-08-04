import { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../store';
import { useFormik } from 'formik';
import ErrorMessage from './shared/ErrorMessage';
import EntityService, { EntityValues } from '../services/entity/EntityService';
import EntityInterface from '../entities/EntityInterface';
import { useFormikType } from '../services/form/types';
import {
  KeyValList,
  ScalarProperty,
} from '../services/api/ParsedApiSpecInterface';
import useCancelToken from '../hooks/useCancelToken';
import SaveButton from './shared/Button/SaveButton';
import findRoute from '../router/findRoute';
import { RouteMap } from '../router/routeMapParser';
import { EntityFormType } from '../entities/DefaultEntityBehavior';
import useRememberedValues from './shared/useRememberedValues';

type CreateProps = RouteComponentProps<any, any, Record<string, string>> &
  EntityInterface & {
    entityService: EntityService;
    routeMap: RouteMap;
    Form: EntityFormType;
  };

const Create = (props: CreateProps) => {
  const {
    marshaller,
    unmarshaller,
    path,
    history,
    routeMap,
    match,
    entityService,
  } = props;

  const parentRoute = findRoute(routeMap, match);
  const filterBy = parentRoute?.filterBy;
  const fixedValues = parentRoute?.fixedValues;

  let parentPath = parentRoute?.route || '';
  for (const idx in match.params) {
    parentPath = parentPath.replace(`:${idx}`, match.params[idx]);
  }

  const { Form: EntityForm } = props;
  const reqError = useStoreState((store) => store.api.errorMsg);
  const [validationError, setValidationError] = useState<KeyValList>({});
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

  const formik: useFormikType = useFormik({
    initialValues,
    validate: (values: any) => {
      if (filterBy) {
        values[filterBy] = Object.values(match.params).pop();
      }

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
      const payload = marshaller(values, properties);
      const formData = entityService.prepareFormData(payload);

      try {
        const resp = await apiPost({
          path,
          values: formData,
          contentType: 'application/json',
          cancelToken,
        });

        if (resp !== undefined) {
          const referrer = history.location.state.referrer;
          const targetPath =
            referrer.search(parentPath) === 0 ? referrer : parentPath;

          history.push(targetPath, { referrer: history.location.pathname });
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
        <>{properties[idx].label}: {validationError[idx]}</>
      </li>
    );
  }

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <EntityForm
          {...props}
          entityService={entityService}
          formik={formik}
          create={true}
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

export default withRouter<any, any>(Create);

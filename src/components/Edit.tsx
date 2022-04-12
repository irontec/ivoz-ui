import { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { useFormik } from 'formik';
import { useStoreActions, useStoreState } from '../store';
import ErrorMessage from '../components/shared/ErrorMessage';
import EntityService from '../services/entity/EntityService';
import EntityInterface from '../entities/EntityInterface';
import { useFormikType } from '../services/form/types';
import withRowData from './withRowData';
import { KeyValList } from "../services/api/ParsedApiSpecInterface";
import useCancelToken from "../hooks/useCancelToken";
import SaveButton from "./shared/Button/SaveButton";
import { RouteMap } from '../router/routeMapParser';
import findRoute from "../router/findRoute";
import { EntityFormType } from "../entities/DefaultEntityBehavior";

type EditProps = RouteComponentProps<Record<string, string>> & EntityInterface & {
  entityService: EntityService,
  routeMap: RouteMap,
  row: Record<string, any>,
  Form: EntityFormType,
}

const Edit: any = (props: EditProps & RouteComponentProps) => {

  const {
    marshaller, unmarshaller, history, match, row, properties, routeMap, entityService
  } = props;

  const { Form: EntityForm } = props;

  const parentRoute = findRoute(routeMap, match);
  const filterBy = parentRoute?.filterBy;

  let returnPath = parentRoute?.route || '';
  for (const idx in match.params) {
    returnPath = returnPath.replace(`:${idx}`, match.params[idx]);
  }

  const entityId = match.params.id;

  const reqError = useStoreState((store) => store.api.errorMsg);
  const apiPut = useStoreActions((actions) => actions.api.put);
  const [, cancelToken] = useCancelToken();
  const [validationError, setValidationError] = useState<KeyValList>({});

  const initialValues = unmarshaller(
    row,
    properties
  );

  const formik: useFormikType = useFormik({
    initialValues,
    validate: (values: any) => {

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
          cancelToken
        });

        if (resp !== undefined) {
          history.push(returnPath);
        }

      } catch { }
    },
  });

  const errorList: { [k: string]: JSX.Element } = {};
  for (const idx in validationError) {

    if (!formik.touched[idx]) {
      continue;
    }

    errorList[idx] = (
      <li key={idx}>{properties[idx].label}: {validationError[idx]}</li>
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
  )
};

export default withRouter<any, any>(
  withRowData(Edit)
);

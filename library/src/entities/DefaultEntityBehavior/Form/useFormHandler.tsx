import { useFormik } from 'formik';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  EntityValues,
  PropertyList,
  ScalarEntityValue,
  useFormikType,
} from '../../../services';
import { EntityFormProps } from './Form';

type UseFormHandlerProps = Pick<
  EntityFormProps,
  | 'create'
  | 'entityService'
  | 'fixedValues'
  | 'filterValues'
  | 'filterBy'
  | 'initialValues'
  | 'onSubmit'
  | 'validator'
>;

const useFormHandler = (props: UseFormHandlerProps): useFormikType => {
  const {
    create,
    entityService,
    fixedValues,
    filterValues,
    filterBy,
    initialValues,
    onSubmit: onSubmitCallback,
  } = props;

  const params = useParams();
  const instanceRef = useRef<useFormikType | undefined>();

  const formik: useFormikType = useFormik({
    initialValues,
    validate: (values: EntityValues) => {
      const visibleFields = instanceRef.current?.visibleFields || [];

      if (filterValues) {
        for (const idx in filterValues) {
          // Sanitize values like type[exact]
          const sanitizedIdx = idx.match(/^[^[]+/)?.[0] || '';
          if (!sanitizedIdx) {
            continue;
          }

          if (Array.isArray(filterValues[idx])) {
            continue;
          }

          values[sanitizedIdx] = filterValues[idx] as ScalarEntityValue;
        }
      }

      if (fixedValues) {
        for (const idx in fixedValues) {
          values[idx] = fixedValues[idx];
        }
      }

      if (create && filterBy) {
        const paramValue = Object.values(params).pop() as unknown;
        values[filterBy] = isNaN(paramValue as number)
          ? (paramValue as string)
          : Number(paramValue);
      }

      const visualToggles = entityService.getVisualToggles(values);

      const allProperties = entityService.getAllProperties();
      const properties: PropertyList = {};

      for (const name in allProperties) {
        if (name.includes('.')) {
          const rootPropertyName = name.split('.').shift() || '';
          if (!visibleFields.includes(rootPropertyName)) {
            continue;
          }

          const rootProperty = allProperties[rootPropertyName];

          if (rootProperty?.required) {
            allProperties[name].required = true;
          }
        } else {
          if (!visibleFields.includes(name)) {
            continue;
          }
        }

        properties[name] = allProperties[name];
      }

      const validationErrors = props.validator(
        values,
        properties,
        visualToggles
      );

      return validationErrors;
    },
    onSubmit: (values, imperativeMethods) => {
      const visibleFields = instanceRef.current?.visibleFields || [];

      const filteredValues: EntityValues = {};
      for (const idx in values) {
        if (!visibleFields.includes(idx)) {
          continue;
        }
        filteredValues[idx] = values[idx];
      }

      onSubmitCallback(filteredValues, imperativeMethods);
    },
  });

  instanceRef.current = formik;
  return formik;
};

export { useFormHandler };

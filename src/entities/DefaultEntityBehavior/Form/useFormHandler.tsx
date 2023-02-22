import { useFormik } from 'formik';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { EntityValues, PropertyList, useFormikType } from '../../../services';
import { EntityFormProps } from './Form';

const useFormHandler = (props: EntityFormProps): useFormikType => {
  const {
    create,
    entityService,
    fixedValues,
    filterBy,
    initialValues,
    onSubmit,
  } = props;

  const params = useParams();
  const instanceRef = useRef<useFormikType | undefined>();

  const formik: useFormikType = useFormik({
    initialValues,
    validate: (values: EntityValues) => {
      const visibleFields = instanceRef.current?.visibleFields || [];

      if (create && filterBy) {
        values[filterBy] = Object.values(params).pop() as string;
      }

      if (fixedValues) {
        for (const idx in fixedValues) {
          values[idx] = fixedValues[idx];
        }
      }

      const visualToggles = entityService.getVisualToggles(values);

      const allProperties = entityService.getAllProperties();
      const properties: PropertyList = {};
      for (const name in allProperties) {
        if (!visibleFields.includes(name)) {
          continue;
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
    onSubmit,
  });

  instanceRef.current = formik;
  return formik;
};

export { useFormHandler };

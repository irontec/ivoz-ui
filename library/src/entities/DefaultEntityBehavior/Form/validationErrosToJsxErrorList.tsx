import {
  EmbeddableProperty,
  isPropertyScalar,
  PropertyList,
  ScalarProperty,
  useFormikType,
} from '../../../services';

type ResponseType = Record<string, JSX.Element>;

const validationErrosToJsxErrorList = (
  formik: useFormikType,
  properties: PropertyList
): ResponseType => {
  const errorList: ResponseType = {};
  for (const idx in formik.errors) {
    const nameSegments = idx.split('.');
    const embeddable = nameSegments.length > 1;

    if (!embeddable && !formik.touched[idx]) {
      continue;
    }

    if (
      embeddable &&
      !(formik.touched[nameSegments[0]] as Record<string, unknown>)?.[
        nameSegments[1]
      ]
    ) {
      continue;
    }

    const multilang =
      embeddable &&
      properties[nameSegments[0]] &&
      isPropertyScalar(properties[nameSegments[0]]) &&
      (properties[nameSegments[0]] as EmbeddableProperty).multilang;

    const property = multilang ? properties[nameSegments[0]] : properties[idx];

    const label = multilang ? (
      <>
        {property.label} [{nameSegments[1]}]
      </>
    ) : (
      property.label
    );

    errorList[idx] = (
      <li key={idx}>
        <>
          {label}: {formik.errors[idx]}
        </>
      </li>
    );
  }

  return errorList;
};

export { validationErrosToJsxErrorList };

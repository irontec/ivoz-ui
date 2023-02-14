import {
  isPropertyEmbeddable,
  PartialPropertyList,
  PropertySpec,
  ScalarProperty,
} from '../../services/api/ParsedApiSpecInterface';
import { MarshallerValues } from './Marshaller';

// API Response format => formik compatible format
const unmarshaller = (
  row: MarshallerValues,
  properties: PartialPropertyList
): MarshallerValues => {
  let normalizedData: any = {};

  // eslint-disable-next-line
  const dateTimePattern = `^[0-9]{4}\-[0-9]{2}\-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$`;
  const dateTimeRegExp = new RegExp(dateTimePattern);

  for (const idx in row) {
    if (row[idx] == null) {
      // formik doesn't like null values
      const property = properties[idx];
      normalizedData[idx] = property?.null ? '__null__' : '';
    } else if (typeof row[idx] === 'object' && row[idx].id) {
      // flatten foreign keys
      const hasCustomComponent = properties[idx]?.component !== undefined;

      normalizedData[idx] = hasCustomComponent ? row[idx] : row[idx].id;
    } else if (typeof row[idx] === 'string' && row[idx].match(dateTimeRegExp)) {
      // formik datetime format: "yyyy-MM-ddThh:mm" followed by optional ":ss" or ":ss.SSS"
      normalizedData[idx] = row[idx].replace(' ', 'T');
    } else if (
      properties[idx] &&
      (properties[idx] as ScalarProperty).type === 'boolean'
    ) {
      normalizedData[idx] = row[idx] === true || row[idx] === 1 ? true : false;

    } else if (
      typeof row[idx] === 'object'
      && properties[idx]
      && isPropertyEmbeddable(properties[idx] as PropertySpec)
    ) {
      //embeddables
      const subset: Record<string, unknown> = {};
      for (const subkey in row[idx]) {
        subset[`${idx}.${subkey}`] = row[idx][subkey];
      }

      const unmarshalledEmbeddable = unmarshaller(subset, properties);
      const unmarshalledSubset: Record<string, unknown> = {};
      for (const subkey in unmarshalledEmbeddable) {
        const propertyName = subkey.split('.').pop() as string;
        unmarshalledSubset[propertyName] = unmarshalledEmbeddable[subkey];
      }
      normalizedData[idx] = unmarshalledSubset;

    } else {
      normalizedData[idx] = row[idx];
    }
  }

  return normalizedData;
};

export default unmarshaller;

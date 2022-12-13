import {
  PartialPropertyList,
  ScalarProperty,
} from '../../services/api/ParsedApiSpecInterface';
import { MarshallerValues } from './Marshaller';

// API Response format => formik compatible format
const unmarshaller = (
  row: MarshallerValues,
  properties: PartialPropertyList
): MarshallerValues => {
  const normalizedData: any = {};

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
    } else {
      normalizedData[idx] = row[idx];
    }
  }

  return normalizedData;
};

export default unmarshaller;

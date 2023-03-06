import {
  EntityValues,
  VisualToggleStates,
} from '../../services/entity/EntityService';
import {
  isPropertyEmbeddable,
  PropertySpec,
  ScalarProperty,
} from '../../services/api/ParsedApiSpecInterface';
import { EntityValidator, EntityValidatorResponse } from '../EntityInterface';
import _ from '../../services/translations/translate';

const validator: EntityValidator = (
  values,
  properties,
  visualToggle,
  validateEmbeddables = false
): EntityValidatorResponse => {
  let response: EntityValidatorResponse = {};
  for (const idx in values) {
    if (!visualToggle[idx]) {
      continue;
    }

    if (!properties[idx]) {
      continue;
    }

    if (!validateEmbeddables && idx.indexOf('.') > 0) {
      continue;
    }

    if (isPropertyEmbeddable(properties[idx] as PropertySpec)) {
      const value = values[idx] as EntityValues;
      const embeddedValues: EntityValues = {};
      const embeddedVisualToggle: VisualToggleStates = {};
      for (const subName in value) {
        embeddedValues[`${idx}.${subName}`] = value[subName];
        embeddedVisualToggle[`${idx}.${subName}`] = true;
      }

      const embeddedErrors = validator(
        embeddedValues,
        properties,
        embeddedVisualToggle,
        true
      );

      response = {
        ...response,
        ...embeddedErrors,
      };
      continue;
    }

    const required = (properties[idx] as ScalarProperty)?.required;
    const pattern: RegExp | undefined = (properties[idx] as ScalarProperty)
      ?.pattern;
    if (pattern && !(values[idx] + '').match(pattern)) {
      if (!values[idx] && !required) {
        continue;
      }
      response[idx] = _('invalid pattern');
    }

    const isEmpty = ['', '__null__', null].includes(
      values?.[idx]?.toString() || ''
    );

    if (required && isEmpty) {
      response[idx] = _('required value');
    }
  }

  for (const fld in visualToggle) {
    if (!validateEmbeddables && fld.indexOf('.') > 0) {
      continue;
    }

    if (!visualToggle[fld]) {
      continue;
    }

    if (values[fld] !== undefined) {
      continue;
    }

    const required = (properties[fld] as ScalarProperty)?.required;
    if (!required) {
      continue;
    }

    response[fld] = _('required value');
  }

  return response;
};

export default validator;

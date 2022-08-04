import { VisualToggleStates } from '../../services/entity/EntityService';
import {
  PartialPropertyList,
  ScalarProperty,
} from '../../services/api/ParsedApiSpecInterface';
import {
  EntityValidator,
  EntityValidatorValues,
  EntityValidatorResponse,
} from '../EntityInterface';
import _ from '../../services/translations/translate';

const validator: EntityValidator = (
  values: EntityValidatorValues,
  properties: PartialPropertyList,
  visualToggle: VisualToggleStates
): EntityValidatorResponse => {
  const response: EntityValidatorResponse = {};
  for (const idx in values) {
    if (!visualToggle[idx]) {
      continue;
    }

    const pattern: RegExp | undefined = (properties[idx] as ScalarProperty)
      ?.pattern;
    if (pattern && !(values[idx] + '').match(pattern)) {
      response[idx] = _('invalid pattern');
    }

    const required = (properties[idx] as ScalarProperty)?.required;
    const isEmpty = ['', '__null__', null].includes(values[idx]);

    if (required && isEmpty) {
      response[idx] = _('required value');
    }
  }

  for (const fld in visualToggle) {
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

import {
  DynamicAutocompleteGetterType,
  DynamicAutocompleteGetterTypeArgs,
  SelectOptionsType,
} from '../EntityInterface';
import { autoSelectOptionHandlers } from './AutoSelectOptions';

const dynamicAutocompleteGetters: DynamicAutocompleteGetterType = async (
  props: DynamicAutocompleteGetterTypeArgs
): Promise<Record<string, SelectOptionsType>> => {
  const { entityService } = props;
  const getters = await autoSelectOptionHandlers({
    entityService,
    skip: [],
  });

  return getters;
};

export default dynamicAutocompleteGetters;

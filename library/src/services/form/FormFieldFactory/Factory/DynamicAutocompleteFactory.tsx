import { PropertySpec } from '../../../api';
import { ScalarEntityValue } from '../../../entity';
import { DynamicAutocomplete } from '../../Field/DynamicAutocomplete';
import { NullableFormFieldFactoryChoices } from '../FormFieldFactory';
import { SelectOptionsType } from 'entities/EntityInterface';
import { FormOnChangeEvent } from 'entities/DefaultEntityBehavior/Form/Form';

type DynamicAutocompleteFactoryPropsType = {
  fld: string;
  property: PropertySpec;
  disabled: boolean;
  multiSelect: boolean;
  value: ScalarEntityValue | Array<ScalarEntityValue>;
  hasChanged: boolean;
  error: React.ReactNode;
  touched: boolean | undefined;
  changeHandler: (event: FormOnChangeEvent) => void;
  choices: NullableFormFieldFactoryChoices;
  handleBlur: (event: React.FocusEvent) => void;
  selectOptions: (() => Promise<SelectOptionsType>) | undefined;
};

export const DynamicAutocompleteFactory = (
  props: DynamicAutocompleteFactoryPropsType
): JSX.Element => {
  const {
    selectOptions,
    fld,
    disabled,
    multiSelect,
    value,
    hasChanged,
    error,
    touched,
    property,
    changeHandler,
    handleBlur,
  } = props;

  return (
    <DynamicAutocomplete
      name={fld}
      label={property.label}
      value={value}
      multiple={multiSelect}
      nullOption={property.null}
      required={property.required}
      disabled={disabled}
      onBlur={handleBlur}
      error={touched && Boolean(error)}
      errorMsg={touched && error}
      helperText={property.helpText}
      hasChanged={hasChanged}
      onChange={changeHandler}
      selectOptions={selectOptions}
    />
  );
};

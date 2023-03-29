import {
  FormOnChangeEvent,
  PropertyFkChoices,
} from '../../../../entities/DefaultEntityBehavior/Form/Form';
import { ScalarProperty } from '../../../api';
import { ScalarEntityValue } from '../../../entity';
import { Dropdown } from '../../../form/Field/Dropdown';
import {
  DropdownChoices,
  DropdownObjectChoices,
} from '../../../form/Field/Dropdown/Dropdown';
import { NullableFormFieldFactoryChoices } from '../FormFieldFactory';

type DropdownFactoryPropsType = {
  fld: string;
  property: ScalarProperty;
  disabled: boolean;
  value: ScalarEntityValue | Array<ScalarEntityValue>;
  hasChanged: boolean;
  error: React.ReactNode;
  touched: boolean | undefined;
  choices: NullableFormFieldFactoryChoices;
  changeHandler: (event: FormOnChangeEvent) => void;
  handleBlur: (event: React.FocusEvent) => void;
};

export const DropdownFactory = (
  props: DropdownFactoryPropsType
): JSX.Element => {
  const {
    fld,
    disabled,
    value,
    hasChanged,
    error,
    touched,
    property,
    changeHandler,
    handleBlur,
  } = props;

  let { choices } = props;

  const enumValues = property.enum as DropdownObjectChoices;
  if (Array.isArray(enumValues)) {
    choices = choices || {};
    for (const enumValue of enumValues) {
      choices[enumValue] = enumValue;
    }
  } else {
    choices = enumValues;
  }

  if (property.null) {
    if (Array.isArray(choices)) {
      choices.unshift({
        id: '__null__',
        label: property.null,
      });
    } else {
      choices = {
        __null__: property.null,
        ...(choices as PropertyFkChoices),
      };
    }
  }

  let booleanValue = typeof value === 'boolean' ? +value : value;
  if (booleanValue === null) {
    booleanValue = '__null__';
  }

  return (
    <Dropdown
      name={fld}
      label={property.label}
      value={booleanValue}
      required={property.required}
      disabled={disabled}
      onChange={changeHandler}
      onBlur={handleBlur}
      choices={choices as DropdownChoices}
      error={touched && Boolean(error)}
      errorMsg={touched && error}
      helperText={property.helpText}
      hasChanged={hasChanged}
    />
  );
};

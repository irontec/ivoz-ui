import { Skeleton } from '@mui/material';
import { FormOnChangeEvent } from '../../../../entities/DefaultEntityBehavior/Form/Form';
import { PropertySpec } from '../../../api';
import { ScalarEntityValue } from '../../../entity';
import { Autocomplete } from '../../Field/Autocomplete';
import { NullableFormFieldFactoryChoices } from '../FormFieldFactory';

type AutocompleteFactoryPropsType = {
  fld: string;
  property: PropertySpec;
  disabled: boolean;
  multiSelect: boolean;
  value: ScalarEntityValue | Array<ScalarEntityValue>;
  hasChanged: boolean;
  error: React.ReactNode;
  touched: boolean | undefined;
  choices: NullableFormFieldFactoryChoices;
  changeHandler: (event: FormOnChangeEvent) => void;
  handleBlur: (event: React.FocusEvent) => void;
};

export const AutocompleteFactory = (
  props: AutocompleteFactoryPropsType
): JSX.Element => {
  const {
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

  let { choices } = props;

  if (!choices) {
    return (
      <>
        <Skeleton width='50%' />
        <Skeleton variant='rectangular' height={42} />
      </>
    );
  }

  if (property.null && !multiSelect) {
    if (Array.isArray(choices)) {
      const nullAlreadyAssigned = choices.find((item) => item.id == '__null__');
      if (!nullAlreadyAssigned) {
        choices = [{ label: property.null, id: '__null__' }, ...choices];
      }
    } else {
      choices = {
        __null__: property.null,
        ...choices,
      };
    }
  }

  return (
    <Autocomplete
      name={fld}
      label={property.label}
      value={value}
      multiple={multiSelect}
      required={property.required}
      disabled={disabled}
      onChange={changeHandler}
      onBlur={handleBlur}
      choices={choices}
      error={touched && Boolean(error)}
      errorMsg={touched && error}
      helperText={property.helpText}
      hasChanged={hasChanged}
    />
  );
};

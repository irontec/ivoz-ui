import { isPropertyFk, PropertySpec } from '../../../api';
import { ScalarEntityValue } from '../../../entity';
import { DynamicAutocomplete } from '../../Field/DynamicAutocomplete';
import { SelectOptionsType } from 'entities/EntityInterface';
import { FormOnChangeEvent } from 'entities/DefaultEntityBehavior/Form/Form';
import { Skeleton } from '@mui/material';
import { DropdownArrayChoices } from 'services/form/Field/Dropdown/Dropdown';
import EntityService from 'services/entity/EntityService';
import { useEffect, useState } from 'react';
import { NullableFormFieldFactoryChoices } from 'services/form';

type DynamicAutocompleteFactoryPropsType = {
  fld: string;
  property: PropertySpec;
  disabled: boolean;
  multiSelect: boolean;
  value: ScalarEntityValue | Array<ScalarEntityValue>;
  choices: NullableFormFieldFactoryChoices;
  hasChanged: boolean;
  error: React.ReactNode;
  touched: boolean | undefined;
  changeHandler: (event: FormOnChangeEvent) => void;
  handleBlur: (event: React.FocusEvent) => void;
  entityService: EntityService;
};

export const DynamicAutocompleteFactory = (
  props: DynamicAutocompleteFactoryPropsType
): JSX.Element => {
  const {
    entityService,
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
  const [selectOptionsLoader, setSelectOptionsLoader] = useState<
    { selectOptions: SelectOptionsType } | undefined
  >(undefined);

  const cleanRef = isPropertyFk(property)
    ? property.$ref.replace('#/definitions/', '')
    : '';

  useEffect(() => {
    if (!cleanRef) {
      return;
    }

    const selectOptionsGetter = entityService.getDynamicAutocompleteGetters({
      entityService,
      skip: [],
    });

    selectOptionsGetter.then((getters) => {
      const selectOptions = getters[cleanRef];
      if (selectOptions) {
        setSelectOptionsLoader({ selectOptions: selectOptions });
      }
    });
  }, [cleanRef, entityService]);

  if (!selectOptionsLoader || !choices) {
    return (
      <>
        <Skeleton width='50%' />
        <Skeleton variant='rectangular' height={42} />
      </>
    );
  }

  if (property.null) {
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
    <DynamicAutocomplete
      name={fld}
      label={property.label}
      value={value}
      choices={choices as DropdownArrayChoices}
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
      selectOptions={selectOptionsLoader.selectOptions}
    />
  );
};

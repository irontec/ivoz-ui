import { FormControlLabel, Switch } from '@mui/material';
import { StyledSwitchFormControl } from '../../../form/Field/SwitchFormControl';
import { FormOnChangeEvent } from '../../../../entities/DefaultEntityBehavior/Form/Form';
import { ScalarProperty } from '../../../api';
import { ScalarEntityValue } from '../../../entity';
import { NullableFormFieldFactoryChoices } from '../FormFieldFactory';

type SwitchFactoryPropsType = {
  fld: string;
  property: ScalarProperty;
  disabled: boolean;
  value: ScalarEntityValue | Array<ScalarEntityValue>;
  hasChanged: boolean;
  choices: NullableFormFieldFactoryChoices;
  changeHandler: (event: FormOnChangeEvent) => void;
  handleBlur: (event: React.FocusEvent) => void;
};

export const SwitchFactory = (props: SwitchFactoryPropsType): JSX.Element => {
  const {
    fld,
    disabled,
    value,
    hasChanged,
    property,
    changeHandler,
    handleBlur,
  } = props;

  const checked = Array.isArray(value) ? value.includes('1') : Boolean(value);

  return (
    <StyledSwitchFormControl hasChanged={hasChanged}>
      <FormControlLabel
        disabled={disabled}
        control={
          <Switch
            name={fld}
            checked={checked}
            onChange={changeHandler}
            onBlur={handleBlur}
            value={true}
          />
        }
        label={property.label}
      />
    </StyledSwitchFormControl>
  );
};

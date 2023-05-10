import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { FormControlLabel, Switch } from '@mui/material';
import { FormOnChangeEvent } from '../../../../entities/DefaultEntityBehavior/Form/Form';
import { ScalarProperty } from '../../../api';
import { ScalarEntityValue } from '../../../entity';
import { SwitchFormControl } from '../../../form/Field/SwitchFormControl';
import { StyledHelpTextTooltip } from '../../Field/Shared/HelpText.styles';
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
  const helpText = property.helpText;

  const label = helpText ? (
    <>
      {property.label}
      <StyledHelpTextTooltip
        title={helpText}
        placement='top'
        arrow
        className='help-tooltip'
      >
        <HelpOutlineIcon />
      </StyledHelpTextTooltip>
    </>
  ) : (
    property.label
  );

  return (
    <SwitchFormControl hasChanged={hasChanged}>
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
        label={label}
      />
    </SwitchFormControl>
  );
};

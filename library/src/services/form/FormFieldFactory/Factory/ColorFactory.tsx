import { InputBaseComponentProps, OutlinedInputProps } from '@mui/material';
import { FormOnChangeEvent } from '../../../../entities/DefaultEntityBehavior/Form/Form';
import { ScalarProperty } from '../../../api';
import { ScalarEntityValue } from '../../../entity';
import { StyledColorField } from '../../Field/TextField/TextField.styles';
import { SketchPicker } from 'react-color';
import { useState } from 'react';
import { StyledColorPickerButton } from '../../../../components/shared/Button/Button.styles';
import {
  StyledColorFactoryContainer,
  StyledSketchPickerContainer,
} from '../FormFieldFactory.styles';
import ColorLensRoundedIcon from '@mui/icons-material/ColorLensRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
type ColorFactoryPropsType = {
  fld: string;
  property: ScalarProperty;
  disabled: boolean;
  value: ScalarEntityValue | Array<ScalarEntityValue>;
  hasChanged: boolean;
  error: React.ReactNode;
  touched: boolean | undefined;
  inputProps: InputBaseComponentProps;
  InputProps: Partial<OutlinedInputProps>;
  changeHandler: (event: FormOnChangeEvent) => void;
  handleBlur: (event: React.FocusEvent) => void;
};

export const ColorFactory = (props: ColorFactoryPropsType): JSX.Element => {
  const {
    fld,
    property,
    value,
    hasChanged,
    error,
    touched,
    inputProps,
    InputProps,
    changeHandler,
    handleBlur,
  } = props;

  const [display, setDisplay] = useState<'hidden' | 'initial'>('hidden');
  return (
    <StyledColorFactoryContainer>
      <StyledColorPickerButton
        variant='contained'
        style={{ color: value as string }}
        onClick={() => {
          display === 'hidden' ? setDisplay('initial') : setDisplay('hidden');
        }}
      >
        {display === 'hidden' ? <ColorLensRoundedIcon /> : <CloseRoundedIcon />}
      </StyledColorPickerButton>
      <StyledColorField
        name={fld}
        type='text'
        multiline={false}
        value={value}
        disabled={true}
        required={property.required}
        onBlur={handleBlur}
        error={touched && Boolean(error)}
        errorMsg={touched && error}
        helperText={property.helpText}
        InputProps={InputProps}
        inputProps={inputProps}
        hasChanged={hasChanged}
      />

      <StyledSketchPickerContainer visibility={display}>
        <SketchPicker
          color={value as string}
          onChange={(color, event) => {
            changeHandler({
              ...event,
              target: {
                ...event.target,
                name: fld,
                value: color.hex,
              },
            });
          }}
          disableAlpha={true}
          presetColors={property.presets}
        />
      </StyledSketchPickerContainer>
    </StyledColorFactoryContainer>
  );
};

import { Box, InputBaseProps, OutlinedInputProps } from '@mui/material';
import { PartialPropertyList, ScalarProperty } from 'services/api';
import { useStoreState } from 'store';
import { Language } from 'store/i18n';
import { PropertyCustomFunctionComponentProps } from './CustomComponentWrapper';
import {
  StyledFieldset,
  StyledFieldsetRoot,
} from './CustomComponentWrapper.styles';
import { StyledMultilangTextField } from './TextField/TextField.styles';

type Languages = { [k: string]: Language };
interface MultilangPropsInterface
  extends PropertyCustomFunctionComponentProps<Languages> {
  properties: PartialPropertyList;
  InputProps?: Partial<OutlinedInputProps>;
  inputProps: InputBaseProps['inputProps'];
}

const Multilang: React.FC<MultilangPropsInterface> = (props): JSX.Element => {
  const { _columnName, properties, formik, inputProps, onBlur, changeHandler } =
    props;

  let { InputProps } = props;

  const languages = useStoreState((state) => state.i18n.languages);
  const mlValue: Record<string, string> = formik?.values[_columnName] || {};
  const property = properties[_columnName] as ScalarProperty;

  return (
    <StyledFieldsetRoot
      label={property.label} //properties[name].label
      hasChanged={false} //TODO
      disabled={false}
      className={'multilang'}
    >
      <StyledFieldset>
        <Box sx={{ padding: '5px' }}>
          {languages?.map((lng) => {
            const locale = lng.locale.split('-').shift() ?? 'en';

            const value = mlValue[locale];
            const name = `${_columnName}.${locale}`;
            const property = properties[name] as ScalarProperty;
            const multiline = property.format === 'textarea';
            const required = property?.required || false;
            const touched =
              formik?.touched[_columnName] &&
              (formik?.touched[_columnName] as Record<string, boolean>)[locale];
            const error = formik?.errors[name] as string | undefined;

            InputProps = InputProps ?? {};
            InputProps.startAdornment = (
              <span className='preffix'>
                {lng.name.substring(0, 3).toUpperCase()}
              </span>
            );

            return (
              <StyledMultilangTextField
                key={name}
                name={name}
                type='text'
                multiline={multiline}
                value={value}
                disabled={false}
                label={undefined}
                required={required}
                onChange={changeHandler}
                onBlur={onBlur}
                error={touched && Boolean(error)}
                errorMsg={touched && error}
                helperText={property.helpText}
                InputProps={{ ...InputProps }}
                inputProps={inputProps}
                hasChanged={false} //TODO
                margin='dense'
                size='small'
              />
            );
          })}
        </Box>
      </StyledFieldset>
    </StyledFieldsetRoot>
  );
};

export default Multilang;

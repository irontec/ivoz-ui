import { Box, InputBaseProps, OutlinedInputProps, TextField } from '@mui/material';
import { PartialPropertyList, ScalarProperty } from 'services/api';
import { useStoreState } from 'store';
import { Language } from 'store/i18n';
import { StyledSubTextField } from '../FormFieldFactory.styles';
import withCustomComponentWrapper, {
  PropertyCustomFunctionComponentProps,
} from './CustomComponentWrapper';

type Languages = { [k: string]: Language };
interface MultilangPropsInterface extends PropertyCustomFunctionComponentProps<Languages> {
  properties: PartialPropertyList;
  InputProps?: Partial<OutlinedInputProps>;
  inputProps?: InputBaseProps['inputProps'];
}

const Multilang: React.FC<MultilangPropsInterface> = (props): JSX.Element => {
  const { _columnName, properties, formik, InputProps, inputProps, onBlur, changeHandler } = props;
  const languages = useStoreState((state) => state.i18n.languages);
  const mlValue: Record<string, string> = formik?.values[_columnName] || {};

  return (
    <Box sx={{ padding: '5px' }}>
      {languages?.map((lng, idx) => {
        const locale = lng.locale.split('-').shift() ?? 'en';

        const value = mlValue[locale];
        const name = `${_columnName}.${locale}`;
        const property = properties[name] as ScalarProperty;
        const multiline = property.format === 'textarea';
        const required = property?.required || false;
        const touched = formik?.touched[_columnName] && (formik?.touched[_columnName] as Record<string, boolean>)[locale];
        const error = formik?.errors[name];

        const inputProps: Record<string, unknown> = {};
        if (property.maxLength) {
          inputProps.maxLength = property.maxLength;
        }

        return (
          <StyledSubTextField
            key={name}
            name={name}
            type='text'
            multiline={multiline}
            value={value}
            disabled={false}
            label={lng.name}
            required={required}
            onChange={changeHandler}
            onBlur={onBlur}
            error={touched && Boolean(error)}
            helperText={
              touched && (error as React.ReactNode)
            }
            InputProps={InputProps}
            inputProps={inputProps}
            hasChanged={false} //TODO
            margin='dense'
            size='small'
          />
        );
      })}
    </Box>
  );
};

export default withCustomComponentWrapper<
  Languages,
  MultilangPropsInterface
>(Multilang);

import { Box, TextField } from '@mui/material';
import { useStoreState } from 'store';
import { Language } from 'store/i18n';
import withCustomComponentWrapper, {
  PropertyCustomFunctionComponentProps,
} from './CustomComponentWrapper';

type MultilangPropsType = PropertyCustomFunctionComponentProps<{ [k: string]: Language }>;

const Multilang: React.FC<MultilangPropsType> = (props): JSX.Element => {
  const { _columnName, formik, changeHandler } = props;
  const languages = useStoreState((state) => state.i18n.languages);
  const mlValue: Record<string, string> = formik?.values[_columnName] || {};

  return (
    <Box sx={{ padding: '5px' }}>
      {languages?.map((lng, idx) => {
        const locale = lng.locale.split('-').shift() ?? 'en';

        const value = mlValue[locale];
        const name = `${_columnName}.${locale}`;

        return (
          <TextField
            margin='dense'
            size='small'
            key={name}
            label={lng.name}
            fullWidth
            multiline
            name={name}
            value={value}
            onChange={changeHandler}
          />
        );
      })}
    </Box>
  );
};

export default withCustomComponentWrapper<
  MultilangPropsType,
  PropertyCustomFunctionComponentProps<MultilangPropsType>
>(Multilang);

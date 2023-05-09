import {
  PropertyCustomFunctionComponent,
  PropertyCustomFunctionComponentProps,
} from '@irontec/ivoz-ui/services/form/Field/CustomComponentWrapper';
import FlagIcon from '@mui/icons-material/Flag';

import { ClientPropertyList } from '../ClientProperties';

type RouteTypeValues = ClientPropertyList<string>;
type RouteTypeProps = PropertyCustomFunctionComponent<
  PropertyCustomFunctionComponentProps<RouteTypeValues>
>;
const CustomLanguageFld: RouteTypeProps = (props): JSX.Element | null => {
  const {
    _context,
    values,
    readOnly,
    _columnName,
    property,
    formFieldFactory,
    choices = null,
  } = props;
  const { language } = values;

  if (_context !== 'read') {
    if (!formFieldFactory) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { component: _component = null, ...modifiedProperty } = {
      ...property,
    };

    return formFieldFactory.getInputField(
      _columnName,
      modifiedProperty,
      choices,
      readOnly
    );
  }

  return (
    <>
      {language} <FlagIcon />
    </>
  );
};
export default CustomLanguageFld;

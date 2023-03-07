import { PartialPropertyList } from '@irontec/ivoz-ui';
import { MarshallerValues } from '@irontec/ivoz-ui/entities/DefaultEntityBehavior/Marshaller';
import defaultEntityBehavior from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import EntityInterface, {
  EntityValidator,
} from '@irontec/ivoz-ui/entities/EntityInterface';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import PersonIcon from '@mui/icons-material/Person';
import Password from './Field/Password';
import { foreignKeyGetter } from './ForeignKeyGetter';
import foreignKeyResolver from './ForeignKeyResolver';
import Form from './Form';
import { UserProperties } from './UserProperties';
import Actions from './Action';

const properties: UserProperties = {
  iden: {
    label: _('Name'),
    required: true,
    pattern: new RegExp('^[^\\s]+$'),
    helpText: _(
      'Used at login screen in username field followed by @client_name. Cannot contain whitespaces.'
    ),
  },
  title: {
    label: _('Title'),
    helpText: _('Optional, shown at various places in Ivoz softphone GUI'),
  },
  terminal: {
    label: _('SIP username'),
    prefix: '@|'
  },
  enabled: {
    label: _('Licence'),
    helpText: _('Dual licence is valid for both mobile and desktop'),
    enum: {
      no: _('None'),
      desktop: _('Desktop'),
      mobile: _('Mobile'),
      dual: _('Dual'),
    },
    default: 'no',
  },
  client: {
    label: _('Client'),
  },
  email: {
    label: _('Email'),
    helpText: _('Optional, used for credentials email notification'),
  },
  sipPassword: {
    label: _('SIP password'),
    component: Password,
  },
  acrobitsPassword: {
    label: _('Password'),
    pattern: new RegExp(
      '^(?=.*[A-Z].*[A-Z].*[A-Z])(?=.*[+*_-])(?=.*[0-9].*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{10,}$'
    ),
    helpText: _(
      "Used at login screen in password field. Minimal length 10, including 3 uppercase letters, 3 lowercase letters, 3 digits and one character in '+*_-'"
    ),
    component: Password,
    required: true,
  },
  lastProvisionDate: {
    label: _('Last provision date'),
  },
};

const validator: EntityValidator = (values, properties, visualToggle) => {
  const response = defaultEntityBehavior.validator(
    values,
    properties,
    visualToggle
  );

  if (values.enabled === 'no') {
    delete response.acrobitsPassword;
  }

  return response;
};

const marshaller = (
  values: MarshallerValues,
  properties: PartialPropertyList
): MarshallerValues => {
  values = defaultEntityBehavior.marshaller(values, properties);
  if (values.enabled === 'no') {
    delete values.acrobitsPassword;
  }

  if (properties.acrobitsPassword.required === false) {
    delete values.acrobitsPassword;
  }

  return values;
};

const user: EntityInterface = {
  ...defaultEntityBehavior,
  icon: PersonIcon,
  iden: 'User',
  title: 'Users',
  path: '/users',
  defaultOrderBy: '',
  toStr: (row: any) => row.id,
  properties,
  columns: ['client', 'iden', 'enabled', 'email', 'lastProvisionDate'],
  customActions: Actions,
  foreignKeyResolver,
  foreignKeyGetter,
  Form,
  validator,
  marshaller,
};

export default user;

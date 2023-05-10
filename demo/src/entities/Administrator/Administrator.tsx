import { PartialPropertyList } from '@irontec/ivoz-ui';
import defaultEntityBehavior, {
  MarshallerValues,
} from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import EntityInterface from '@irontec/ivoz-ui/entities/EntityInterface';
import { EntityValues } from '@irontec/ivoz-ui/services/entity/EntityService';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { AdministratorProperties } from './AdministratorProperties';

const properties: AdministratorProperties = {
  username: {
    label: _('Username'),
    helpText: _('Used to log into this web portal'),
  },
  active: {
    label: _('Active'),
    helpText: _('Enable / Disable admin'),
  },
  name: {
    label: _('Name'),
  },
  lastname: {
    label: _('Last name'),
  },
  email: {
    label: _('Email'),
  },
  pass: {
    label: _('Password'),
    helpText: _('Used to log into this web portal'),
  },
  avatar: {
    label: _('Logo'),
    type: 'file',
    accept: 'image/*',
  },
  greeting: {
    label: _('Greeting'),
    type: 'file',
    accept: '.mp3, audio/*',
  },
};

const administrator: EntityInterface = {
  ...defaultEntityBehavior,
  icon: AdminPanelSettingsIcon,
  iden: 'Administrator',
  title: 'Administrators',
  path: '/administrators',
  properties,
  toStr: (row: EntityValues) => row?.username as string | '',
  Form: async () => {
    const module = await import('./Form');

    return module.default;
  },
  marshaller: (
    values: MarshallerValues,
    properties: PartialPropertyList
  ): MarshallerValues => {
    if (values.pass === '*****') {
      delete values.pass;
    }

    const email: string = values?.email.trim();
    const name: string = values?.name.trim();
    const lastname: string = values?.lastname.trim();

    values.email = email || null;
    values.name = name || null;
    values.lastname = lastname || null;

    return defaultEntityBehavior.marshaller(values, properties);
  },
};

export default administrator;

import CastleIcon from '@mui/icons-material/Castle';
import EntityInterface from '@irontec/ivoz-ui/entities/EntityInterface';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import defaultEntityBehavior from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import selectOptions from './SelectOptions';
import Form from './Form';
import { PlatformProperties } from './PlatformProperties';

const properties: PlatformProperties = {
  name: {
    label: _('Name'),
  },
  type: {
    label: _('Type'),
    helpText: _('Choose Other if no user sync is needed/supported'),
    enum: {
      isbc: _('ISBC'),
      'ivozprovider-v2': _('Ivoz Provider v2'),
      'ivozprovider-v3': _('Ivoz Provider v3'),
      other: _('Other'),
    },
    visualToggle: {
      isbc: {
        show: ['apiUrl', 'refreshToken'],
        hide: [],
      },
      other: {
        show: [],
        hide: ['apiUrl', 'refreshToken'],
      },
      'ivozprovider-v2': {
        show: ['apiUrl', 'refreshToken'],
        hide: [],
      },
      'ivozprovider-v3': {
        show: ['apiUrl', 'refreshToken'],
        hide: [],
      },
    },
  },
  apiUrl: {
    label: _('API URL'),
    helpText: _(
      'Used to sync users, must start with https:// and end with /api/'
    ),
  },
  tlsPort: {
    label: _('TLS port'),
    helpText: _('Overridable at client level'),
  },
  tcpPort: {
    label: _('TCP port'),
    helpText: _('Overridable at client level'),
  },
  udpPort: {
    label: _('UDP port'),
    helpText: _('Overridable at client level'),
  },
  refreshToken: {
    label: _('Refresh token'),
    helpText: _('Make sure it does not expire'),
  },
};

const platform: EntityInterface = {
  ...defaultEntityBehavior,
  icon: CastleIcon,
  iden: 'Platform',
  title: 'Platforms',
  path: '/platforms',
  defaultOrderBy: '',
  toStr: (row: any) => row.name,
  properties,
  columns: ['name', 'type'],
  selectOptions,
  Form,
};

export default platform;

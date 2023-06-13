import defaultEntityBehavior from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import EntityInterface from '@irontec/ivoz-ui/entities/EntityInterface';
import { EntityValue } from '@irontec/ivoz-ui/services';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import CastleIcon from '@mui/icons-material/Castle';

import CustomActions from './Action';
import { PlatformProperties, PlatformPropertyList } from './PlatformProperties';

const properties: PlatformProperties = {
  name: {
    label: _('Name'),
    prefix: <CastleIcon />,
    suffix: <CastleIcon />,
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
  features: {
    label: _('Feature', { count: 2 }),
    $ref: '#/definitions/Feature',
  },
};

const platform: EntityInterface = {
  ...defaultEntityBehavior,
  icon: CastleIcon,
  link: 'https://halliday-test.irontec.com/doc/en/administration_portal/platform/brands.html',
  iden: 'Platform',
  title: 'Platforms',
  path: '/platforms',
  defaultOrderBy: '',
  toStr: (row: PlatformPropertyList<EntityValue>) => row.name as string,
  properties,
  acl: {
    create: true,
    update: true,
    detail: true,
    read: true,
    delete: true,
  },
  customActions: CustomActions,
  disableMultiDelete: true,
  columns: [
    'name',
    { name: 'type', size: 10 },
    'features',
  ],
  selectOptions: async () => {
    const module = await import('./SelectOptions');

    return module.default;
  },
  Form: async () => {
    const module = await import('./Form');

    return module.default;
  },
  View: async () => {
    const module = await import('./View');

    return module.default;
  },
  deleteDoubleCheck: true,
};

export default platform;

import { EntityValues } from '@irontec/ivoz-ui';
import defaultEntityBehavior from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import EntityInterface from '@irontec/ivoz-ui/entities/EntityInterface';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { getI18n } from 'react-i18next';

import { FeatureProperties, FeaturePropertyList } from './FeatureProperties';

const properties: FeatureProperties = {
  iden: {
    label: _('Iden'),
  },
  name: {
    label: _('Name'),
    multilang: true,
    required: true,
  },
};

const Feature: EntityInterface = {
  ...defaultEntityBehavior,
  icon: AccountTreeIcon,
  iden: 'Feature',
  title: _('Feature', { count: 2 }),
  path: '/features',
  toStr: (row: FeaturePropertyList<EntityValues>) => {
    const language = getI18n().language.substring(0, 2);
    const name = row?.name as Record<string, string>;

    return name?.[language] || '';
  },
  properties,
  columns: ['name', 'iden'],
  selectOptions: async () => {
    const module = await import('./SelectOptions');

    return module.default;
  },
  Form: async () => {
    const module = await import('./Form');

    return module.default;
  },
};

export default Feature;

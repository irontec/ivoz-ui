import { EntityValues } from '@irontec/ivoz-ui';
import defaultEntityBehavior from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import EntityInterface from '@irontec/ivoz-ui/entities/EntityInterface';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { getI18n } from 'react-i18next';

import Actions from './Action';
import { LanguageProperties, LanguagePropertyList } from './LanguageProperties';

const properties: LanguageProperties = {
  iden: {
    label: _('Iden'),
  },
  id: {
    label: _('Id'),
  },
  name: {
    label: _('Name'),
    multilang: true,
  },
};

const Language: EntityInterface = {
  ...defaultEntityBehavior,
  icon: AccountTreeIcon,
  iden: 'Language',
  title: _('Language', { count: 2 }),
  path: '/languages',
  toStr: (row: LanguagePropertyList<EntityValues>) => {
    const language = getI18n().language.substring(0, 2);
    const name = row.name as Record<string, string>;

    return name[language];
  },
  properties,
  columns: [
    'id',
    {
      name: 'iden',
      size: 50,
    },
    {
      name: 'name',
      size: 50,
    },
  ],
  customActions: Actions,
  selectOptions: async () => {
    const module = await import('./SelectOptions');

    return module.default;
  },
  View: async () => {
    const module = await import('./View');

    return module.default;
  },
};

export default Language;

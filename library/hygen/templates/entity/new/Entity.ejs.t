---
to: src/entities/<%= Name %>/<%= Name %>.tsx
---
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import EntityInterface from '@irontec/ivoz-ui/entities/EntityInterface';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import defaultEntityBehavior from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import { EntityValue } from '@irontec/ivoz-ui';
import { <%= Name %>Properties, <%= Name %>PropertyList } from './<%= Name %>Properties';

const properties: <%= Name %>Properties = {
<%- h.formattedEntity(h.url(), Name)%>
};

const <%= Name %>: EntityInterface = {
  ...defaultEntityBehavior,
  icon: AccountTreeIcon,
  iden: '<%= Name %>',
  title: _('<%= Name %>', { count: 2 }),
  path: '/<%= h.inflection.pluralize(name) %>',
  toStr: (row: <%= Name %>PropertyList<EntityValue>) => String(row.id),
  properties,
  selectOptions: async () => {
    const module = await import('./SelectOptions');

    return module.default;
  },
  foreignKeyResolver: async () => {
    const module = await import('./ForeignKeyResolver');

    return module.default;
  },
  foreignKeyGetter: async () => {
    const module = await import('./ForeignKeyGetter');

    return module.foreignKeyGetter;
  },
  Form: async () => {
    const module = await import('./Form');

    return module.default;
  },
};

export default <%= Name %>;
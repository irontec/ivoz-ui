---
to: src/entities/<%= Name %>/<%= Name %>.tsx
---
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import EntityInterface from '@irontec/ivoz-ui/entities/EntityInterface';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import defaultEntityBehavior from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import selectOptions from './SelectOptions';
import Form from './Form';
import { foreignKeyGetter } from './ForeignKeyGetter';
import { <%= Name %>Properties } from './<%= Name %>Properties';
import foreignKeyResolver from './ForeignKeyResolver';

const properties: <%= Name %>Properties = {
<%- h.formattedEntity(h.url(), Name)%>
};

const <%= name %>: EntityInterface = {
  ...defaultEntityBehavior,
  icon: AccountTreeIcon,
  iden: '<%= Name %>',
  title: _('<%= Name %>', { count: 2 }),
  path: '/<%= h.inflection.pluralize(name) %>',
  toStr: (row: any) => row.id,
  properties,
  selectOptions,
  foreignKeyResolver,
  foreignKeyGetter,
  Form,
};

export default <%= name %>;
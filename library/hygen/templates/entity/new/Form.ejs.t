---
to: src/entities/<%= Name %>/Form.tsx
---
import { EntityFormProps, FieldsetGroups } from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import { Form as DefaultEntityForm } from '@irontec/ivoz-ui/entities/DefaultEntityBehavior/Form';

const Form = (props: EntityFormProps): JSX.Element => {

  const groups: Array<FieldsetGroups | false> = [
    {
      legend: _('Main'),
      fields: [
<%- h.properties(h.url(), Name)%>
      ],
    },
  ];

  return (
        <DefaultEntityForm {...props} groups={groups} />
  );
};

export default Form;

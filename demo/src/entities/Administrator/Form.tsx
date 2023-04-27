import {
  EntityFormProps,
  FieldsetGroups,
} from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import { Form as DefaultEntityForm } from '@irontec/ivoz-ui/entities/DefaultEntityBehavior/Form';
import _ from '@irontec/ivoz-ui/services/translations/translate';

const Form = (props: EntityFormProps): JSX.Element => {
  const groups: Array<FieldsetGroups | false> = [
    {
      legend: _('Basic info'),
      fields: ['username', 'pass', 'active'],
    },
    {
      legend: _('Additional info'),
      fields: ['name', 'lastname', 'email', 'avatar', 'greeting'],
    },
  ];

  return <DefaultEntityForm {...props} groups={groups} />;
};

export default Form;

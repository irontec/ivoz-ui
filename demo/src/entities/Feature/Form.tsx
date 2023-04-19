import {
  EntityFormProps,
  FieldsetGroups,
} from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import { Form as DefaultEntityForm } from '@irontec/ivoz-ui/entities/DefaultEntityBehavior/Form';

const Form = (props: EntityFormProps): JSX.Element => {
  const { edit } = props;

  const readOnly = {
    iden: edit || false,
  };

  const groups: Array<FieldsetGroups | false> = [
    {
      legend: '',
      fields: ['iden', 'name', 'madeUpErrorField'],
    },
  ];

  return (
    <DefaultEntityForm
      {...props}
      readOnlyProperties={readOnly}
      groups={groups}
    />
  );
};

export default Form;

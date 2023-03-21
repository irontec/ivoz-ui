import defaultEntityBehavior, {
  EntityFormProps,
  FieldsetGroups,
} from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import _ from '@irontec/ivoz-ui/services/translations/translate';

const Form = (props: EntityFormProps): JSX.Element => {
  const DefaultEntityForm = defaultEntityBehavior.Form;
  const { edit } = props;

  const readOnly = {
    iden: edit || false,
  };

  const groups: Array<FieldsetGroups | false> = [
    {
      legend: '',
      fields: ['iden', 'name'],
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

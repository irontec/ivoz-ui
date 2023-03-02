import { PropertyList } from '@irontec/ivoz-ui';
import { useFormHandler } from '@irontec/ivoz-ui/entities/DefaultEntityBehavior/Form/useFormHandler';
import useFkChoices from '@irontec/ivoz-ui/entities/data/useFkChoices';
import defaultEntityBehavior, {
  EntityFormProps,
  FieldsetGroups,
} from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import { foreignKeyGetter } from './ForeignKeyGetter';
import useParents from './hook/useParents';

const Form = (props: EntityFormProps): JSX.Element | null => {
  const { entityService, row, match, create } = props;
  let { readOnlyProperties } = props;
  readOnlyProperties = readOnlyProperties || {};

  const formik = useFormHandler(props);
  const values = formik.values;
  const DefaultEntityForm = defaultEntityBehavior.Form;
  const fkChoices = useFkChoices({
    foreignKeyGetter,
    entityService,
    row,
    match,
  });

  if (values.remoteId) {
    readOnlyProperties.terminal = true;
    readOnlyProperties.sipPassword = true;
  }

  const [parentRow, grandparentRow] = useParents(values.client);

  if (parentRow === undefined) {
    return null;
  }

  const ldapLogin = parentRow !== null && parentRow.authType === 'ldap';
  if (ldapLogin) {
    const newProperties = { ...entityService.getProperties() };
    newProperties.acrobitsPassword = {
      ...newProperties.acrobitsPassword,
      required: false,
      pattern: undefined,
    };

    entityService.replaceProperties(newProperties as PropertyList);
  }

  if (grandparentRow === undefined) {
    return null;
  }

  const ivozproviderv2 =
    grandparentRow !== null && grandparentRow.type === 'ivozprovider-v2';
  const ivozproviderv3 =
    grandparentRow !== null && grandparentRow.type === 'ivozprovider-v3';

  if (ivozproviderv2 || ivozproviderv3) {
    readOnlyProperties.title = true;
    readOnlyProperties.email = true;
  }

  const groups: Array<FieldsetGroups | false> = [
    {
      legend: _('Acrobits Login'),
      fields: [
        create && 'client',
        'iden',
        'enabled',
        values.enabled !== 'no' && !ldapLogin && 'acrobitsPassword',
      ],
    },
    {
      legend: _('SIP Device Info'),
      fields: ['terminal', 'sipPassword'],
    },
    {
      legend: _('User Info'),
      fields: ['email', 'title'],
    },
  ];

  return (
    <DefaultEntityForm
      {...props}
      formik={formik}
      fkChoices={fkChoices}
      groups={groups}
      readOnlyProperties={readOnlyProperties}
    />
  );
};

export default Form;

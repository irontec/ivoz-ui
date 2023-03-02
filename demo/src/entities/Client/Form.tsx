import useFkChoices from '@irontec/ivoz-ui/entities/data/useFkChoices';
import defaultEntityBehavior, {
  EntityFormProps,
  FieldsetGroups,
} from '@irontec/ivoz-ui/entities/DefaultEntityBehavior';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import { foreignKeyGetter } from './ForeignKeyGetter';
import useShowRemoteId from './hooks/useShowRemoteId';

const Form = (props: EntityFormProps): JSX.Element => {
  const { entityService, row, match, create, formik, filterBy } = props;
  const DefaultEntityForm = defaultEntityBehavior.Form;
  const fkChoices = useFkChoices({
    foreignKeyGetter,
    entityService,
    row,
    match,
  });

  const showRemoteId = useShowRemoteId({
    create,
    filterBy,
    formik,
    match,
  });

  const groups: Array<FieldsetGroups | false> = [
    {
      legend: _('Basic settings'),
      fields: [
        create && 'platform',
        showRemoteId && 'remoteId',
        'iden',
        'description',
        'desktopLicences',
        'mobileLicences',
        'cardDav',
      ],
    },
    {
      legend: _('SIP settings'),
      fields: ['domain', 'transport', 'proxyHost', 'proxyPort'],
    },
    {
      legend: _('Advanced settings'),
      fields: ['sdes', 'authType', 'ldapServer', 'ldapQuery'],
    },
  ];

  return <DefaultEntityForm {...props} fkChoices={fkChoices} groups={groups} />;
};

export default Form;

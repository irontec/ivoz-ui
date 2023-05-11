import { Link } from 'react-router-dom';
import EntityService from '../../../services/entity/EntityService';
import _ from '../../../services/translations/translate';
import { SolidButton } from '../../shared/Button/Button.styles';
import { useTranslation } from 'react-i18next';

export interface EmptyProps {
  entityService: EntityService;
  className?: string;
}

export const Empty = (props: EmptyProps): JSX.Element => {
  const { entityService, className } = props;
  const { t } = useTranslation();

  const entity = entityService.getEntity();
  const acls = entityService.getAcls();
  const { create = false } = acls;

  let singularTitle, pluralTitle;
  const title = entity.title;
  if (typeof title === 'string') {
    singularTitle = pluralTitle = title.toLowerCase();
  } else {
    const translationKey = title.props.defaults;
    singularTitle = t(translationKey, { count: 1 }).toLowerCase();
    pluralTitle = t(translationKey, { count: 2 }).toLowerCase();
  }

  return (
    <section className={className}>
      <img src='assets/img/empty.svg' alt='' />
      <h3>{_('No {{entity}} yet', { entity: pluralTitle })}</h3>
      <p>
        {_('You haven’t created any {{entity}} yet.', {
          entity: singularTitle,
        })}
      </p>
      {create && (
        <Link to={location.pathname + '/create'}>
          <SolidButton>
            {_('New {{entity}}', { entity: singularTitle })}
          </SolidButton>
        </Link>
      )}
    </section>
  );
};

export default Empty;

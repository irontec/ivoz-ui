import { Link } from 'react-router-dom';
import EntityService from '../../../services/entity/EntityService';
import _ from '../../../services/translations/translate';
import { SolidButton } from '../../shared/Button/Button.styles';

export interface EmptyProps {
  entityService: EntityService;
  className?: string;
}

export const Empty = (props: EmptyProps): JSX.Element => {
  const { entityService, className } = props;

  const entity = entityService.getEntity();
  const acls = entityService.getAcls();
  const { create = false } = acls;

  const title =
    typeof entity.title === 'string'
      ? entity.title
      : `$t(${entity.title.props.defaults}, {"count": 1})`;

  return (
    <section className={className}>
      <img src='assets/img/empty.svg' alt='' />
      <h3>No {entity.title} yet</h3>
      <p>
        You haven’t created any email template yet. Create and customize
        templates to send emails with credentials to users
      </p>
      {create && (
        <Link to={location.pathname + '/create'}>
          <SolidButton>{_('New {{entity}}', { entity: title })}</SolidButton>
        </Link>
      )}
    </section>
  );
};

export default Empty;

import { Link } from 'react-router-dom';
import EntityService from '../../../services/entity/EntityService';
import { LightButton } from '../../shared/Button/Button.styles';
import _ from '../../../services/translations/translate';

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
    <>
      <h3 className={className}>
        Empty
        <span> {entity.title}</span>
      </h3>
      {create && (
        <Link to={entity.path + '/create'}>
          <LightButton>{_('New {{entity}}', { entity: title })}</LightButton>
        </Link>
      )}
    </>
  );
};

export default Empty;

import { Link } from 'react-router-dom';
import EntityService from '../../../services/entity/EntityService';
import { LightButton } from '../../shared/Button/Button.styles';

export interface EmptyProps {
  entityService: EntityService;
  className?: string;
}

export const Empty = (props: EmptyProps): JSX.Element => {
  const { entityService, className } = props;

  const entity = entityService.getEntity();
  const acls = entityService.getAcls();
  const { create = false } = acls;

  return (
    <>
      <h3 className={className}>
        EMPTY
        <span>{entity.title}</span>
      </h3>
      {create && (
        <Link to={entity.path + '/create'}>
          <LightButton>New {entity.title}</LightButton>
        </Link>
      )}
    </>
  );
};

export default Empty;

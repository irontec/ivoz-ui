import ViewRowButton from '@irontec/ivoz-ui/components/List/Content/CTA/ViewRowButton';
import { MoreMenuItem } from '@irontec/ivoz-ui/components/List/Content/Shared/MoreChildEntityLinks';
import {
  ActionFunctionComponent,
  ActionItemProps,
} from '@irontec/ivoz-ui/router/routeMapParser';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import { useNavigate } from 'react-router-dom';

const Sync: ActionFunctionComponent = (props: ActionItemProps) => {
  const { row, variant = 'icon' } = props;

  const navigate = useNavigate();

  if (!row) {
    return null;
  }

  const path = `/platforms/${row.id}/detailed`;

  return (
    <>
      {variant === 'text' && (
        <MoreMenuItem onClick={() => navigate(path)}>
          {_('Detail')}
        </MoreMenuItem>
      )}
      {variant === 'icon' && <ViewRowButton row={row} path={path} />}
    </>
  );
};

export default Sync;

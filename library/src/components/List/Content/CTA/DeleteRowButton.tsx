import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStoreActions } from '../../../../store';
import { Tooltip } from '@mui/material';
import ConfirmDialog from '../../../../components/shared/ConfirmDialog';
import EntityService from '../../../../services/entity/EntityService';
import { StyledDeleteIcon } from '../Table/ContentTable.styles';
import _ from '../../../../services/translations/translate';

interface DeleteRowButtonProps {
  row: any;
  entityService: EntityService;
  variant?: 'icon' | 'text';
}

const DeleteRowButton = (props: DeleteRowButtonProps): JSX.Element => {
  const { row, entityService, variant = 'icon' } = props;
  const location = useLocation();
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const handleHideDelete = (): void => {
    setShowDelete(false);
  };
  const navigate = useNavigate();
  const apiDelete = useStoreActions((actions: any) => {
    return actions.api.delete;
  });

  const handleDelete = async (event: any): Promise<void> => {
    const path = entityService.getDeletePath();
    if (!path) {
      throw new Error('Unknown delete path');
    }

    event.preventDefault();
    try {
      const resp = await apiDelete({
        path: path.replace('{id}', row.id),
      });

      if (resp !== undefined) {
        const navOptions = { replace: true, preventScrollReset: true };
        navigate(`${location.pathname}/__reloading`, navOptions);
        setTimeout(() => {
          navigate(location.pathname, navOptions);
        });
      }
    } catch (error: unknown) {
      setShowDelete(false);
    }
  };

  const iden = entityService.getEntity().toStr(row);

  return (
    <>
      {variant === 'icon' && (
        <Tooltip
          title={_('Delete')}
          placement='bottom'
          enterTouchDelay={0}
          arrow
        >
          <a>
            <StyledDeleteIcon onClick={() => setShowDelete(true)} />
          </a>
        </Tooltip>
      )}
      {variant === 'text' && (
        <a onClick={() => setShowDelete(true)}>{_('Delete')}</a>
      )}
      <ConfirmDialog
        text={`You are about to remove ${iden}`}
        open={showDelete}
        handleClose={handleHideDelete}
        handleApply={handleDelete}
      />
    </>
  );
};

export default DeleteRowButton;

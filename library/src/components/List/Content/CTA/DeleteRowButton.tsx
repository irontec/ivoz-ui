import { Tooltip } from '@mui/material';
import { useState } from 'react';
import ConfirmDialog from '../../../../components/shared/ConfirmDialog';
import EntityService from '../../../../services/entity/EntityService';
import _ from '../../../../services/translations/translate';
import { useStoreActions } from '../../../../store';
import { StyledDeleteIcon } from '../Table/ContentTable.styles';
import { LightButton } from '../../../../components/shared/Button/Button.styles';
import { MoreMenuItem } from '../Shared/MoreChildEntityLinks';

interface DeleteRowButtonProps {
  row: any;
  entityService: EntityService;
  variant?: 'icon' | 'text';
  disabled?: boolean;
}

const DeleteRowButton = (props: DeleteRowButtonProps): JSX.Element => {
  const { row, entityService, disabled = false, variant = 'icon' } = props;
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const handleHideDelete = (): void => {
    setShowDelete(false);
  };
  const reloadPage = useStoreActions((actions) => {
    return actions.list.reload;
  });
  const apiDelete = useStoreActions((actions) => {
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
        setShowDelete(false);
        reloadPage();
      }
    } catch (error: unknown) {
      setShowDelete(false);
    }
  };

  const entity = entityService.getEntity();
  const iden = entity.toStr(row);

  return (
    <>
      {variant === 'icon' && (
        <Tooltip
          title={_('Delete')}
          placement='bottom'
          enterTouchDelay={0}
          arrow
        >
          <span>
            <LightButton
              disabled={disabled}
              onClick={() => !disabled && setShowDelete(true)}
            >
              <StyledDeleteIcon />
            </LightButton>
          </span>
        </Tooltip>
      )}
      {variant === 'text' && (
        <MoreMenuItem onClick={() => setShowDelete(true)}>
          {_('Delete')}
        </MoreMenuItem>
      )}
      <ConfirmDialog
        text={
          <span>
            You are about to remove <strong>{iden}</strong>
          </span>
        }
        open={showDelete}
        doubleCheck={entity.deleteDoubleCheck || false}
        doubleCheckExpectedStr={iden}
        handleClose={handleHideDelete}
        handleApply={handleDelete}
      />
    </>
  );
};

export default DeleteRowButton;

import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';
import { useState } from 'react';
import EntityService from '../../../../services/entity/EntityService';
import _ from '../../../../services/translations/translate';
import { useStoreActions } from '../../../../store';
import ConfirmDialog from '../../../shared/ConfirmDialog';
import { LightButton } from '../../../../components/shared/Button/Button.styles';

interface DeleteRowsButtonProps {
  entityService: EntityService;
  selectedValues: Array<string | number>;
  variant?: 'icon' | 'text';
}

const DeleteRowsButton = (props: DeleteRowsButtonProps): JSX.Element => {
  const { entityService, selectedValues, variant = 'icon' } = props;
  const disabled = selectedValues.length === 0;

  const [showDelete, setShowDelete] = useState<boolean>(false);

  const handleShowDelete = () => {
    if (disabled) {
      return;
    }

    setShowDelete(true);
  };

  const handleHideDelete = (): void => {
    setShowDelete(false);
  };
  const reloadPage = useStoreActions((actions) => {
    return actions.list.reload;
  });
  const apiDelete = useStoreActions((actions: any) => {
    return actions.api.delete;
  });

  const selectedValuesCopy = [...selectedValues];
  let selectedValuesIds = selectedValuesCopy.pop();

  if (selectedValues.length > 1) {
    selectedValuesIds += `?_rmAlso[]=${selectedValuesCopy.join('&_rmAlso[]=')}`;
  }

  const handleDelete = async (event: any): Promise<void> => {
    const path = entityService.getDeletePath();
    if (!path) {
      throw new Error('Unknown delete path');
    }
    event.preventDefault();
    try {
      const resp = await apiDelete({
        path: path.replace('{id}', selectedValuesIds as string),
      });

      if (resp !== undefined) {
        reloadPage();
        setShowDelete(false);
      }
    } catch (error: unknown) {
      setShowDelete(false);
    }
  };

  return (
    <>
      {variant === 'text' && (
        <a className={disabled ? 'disabled' : ''} onClick={handleShowDelete}>
          {_('Delete')}
        </a>
      )}
      {variant === 'icon' && (
        <Tooltip
          title={_('Delete')}
          placement='bottom'
          enterTouchDelay={0}
          arrow
        >
          <span>
            <LightButton
              onClick={handleShowDelete}
              disabled={selectedValues.length < 1}
            >
              <DeleteIcon />
            </LightButton>
          </span>
        </Tooltip>
      )}
      <ConfirmDialog
        text={`${selectedValues.length} elements will be removed. Are you sure?`}
        open={showDelete}
        handleClose={handleHideDelete}
        handleApply={handleDelete}
      />
    </>
  );
};

export default DeleteRowsButton;

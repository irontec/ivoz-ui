import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStoreActions } from '../../../../store';
import { Tooltip } from '@mui/material';
import ConfirmDialog from '../../../shared/ConfirmDialog';
import EntityService from '../../../../services/entity/EntityService';
import DeleteIcon from '@mui/icons-material/Delete';
import _ from '../../../../services/translations/translate';

interface DeleteRowsButtonProps {
  entityService: EntityService;
  selectedValues: Array<string | number>;
}

const DeleteRowsButton = (props: DeleteRowsButtonProps): JSX.Element => {
  const { entityService, selectedValues } = props;
  const location = useLocation();
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const handleHideDelete = (): void => {
    setShowDelete(false);
  };
  const navigate = useNavigate();
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

  return (
    <>
      <Tooltip title={_('Delete')} placement='bottom' enterTouchDelay={0}>
        <a>
          <DeleteIcon onClick={() => setShowDelete(true)} />
        </a>
      </Tooltip>
      <ConfirmDialog
        text={`You're about to remove items #${selectedValues.join(', ')}`}
        open={showDelete}
        handleClose={handleHideDelete}
        handleApply={handleDelete}
      />
    </>
  );
};

export default DeleteRowsButton;

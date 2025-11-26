import React, { ChangeEventHandler, useCallback, useState } from 'react';
import { StyledSearchTextField } from '../../services/form/Field/TextField/TextField.styles';
import _ from '../../services/translations/translate';
import { StyledDialogContentText } from './ConfirmDialog.styles';
import Modal from './Modal/Modal';

interface ConfirmDialogProps {
  text: React.ReactNode;
  open: boolean;
  doubleCheck?: boolean;
  doubleCheckExpectedStr?: string;
  handleClose: () => void;
  handleApply: (event: React.MouseEvent) => void;
}

export default function ConfirmDialog(props: ConfirmDialogProps): JSX.Element {
  const {
    text,
    open,
    doubleCheck,
    doubleCheckExpectedStr,
    handleClose,
    handleApply,
  } = props;

  const [inputVal, setInputVal] = useState<string>('');
  const onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const val = event.target.value as string | undefined;
      setInputVal(val || '');
    },
    []
  );

  const submitEnabled = !doubleCheck || inputVal == doubleCheckExpectedStr;

  const customButtons = [
    {
      label: _('No, keep it'),
      onClick: () => handleClose(),
      variant: 'outlined' as const,
      autoFocus: false,
    },
    {
      label: _('Yes, delete it'),
      onClick: (event: React.MouseEvent) => handleApply(event),
      variant: 'solid' as const,
      autoFocus: true,
      disabled: !submitEnabled,
    },
  ];

  return (
    <Modal
      title={_('Remove element')}
      description={text}
      open={open}
      onClose={handleClose}
      buttons={customButtons}
      icon='assets/img/delete-dialog.svg'
      keepMounted={true}
    >
      {doubleCheck && (
        <>
          <StyledDialogContentText id='alert-dialog-double-check-description'>
            {_(
              'Please type the item name, as shown in bold font above, to continue'
            )}
          </StyledDialogContentText>
          <StyledSearchTextField
            type='text'
            hasChanged={false}
            defaultValue={inputVal}
            onChange={onChangeHandler}
          />
        </>
      )}
    </Modal>
  );
}

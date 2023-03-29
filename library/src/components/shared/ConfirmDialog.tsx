import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide, { SlideProps } from '@mui/material/Slide';
import React, {
  ChangeEventHandler,
  ComponentType,
  forwardRef,
  useCallback,
  useState,
} from 'react';
import { StyledSearchTextField } from '../../services/form/Field/TextField/TextField.styles';
import _ from '../../services/translations/translate';
import { StyledDialogContentText } from './ConfirmDialog.styles';

const Transition: ComponentType<any> = forwardRef(function (
  props: SlideProps,
  ref: React.Ref<unknown>
) {
  return <Slide {...props} direction='up' ref={ref} />;
});
Transition.displayName = 'ConfirmDialogTransition';

interface ConfirmDialogProps {
  text: React.ReactNode;
  open: boolean;
  doubleCheck?: boolean;
  doubleCheckExpectedStr?: string;
  handleClose: (event: unknown) => void;
  handleApply: (event: unknown) => void;
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

  const sumbitEnabled = !doubleCheck || inputVal == doubleCheckExpectedStr;

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
    >
      <DialogTitle id='alert-dialog-slide-title'>
        {_('Remove element')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-slide-description'>
          {text}
        </DialogContentText>
        {doubleCheck && (
          <StyledDialogContentText id='alert-dialog-double-check-description'>
            {_(
              'Please type the item name, as shown in bold font above, to continue'
            )}
          </StyledDialogContentText>
        )}
        {doubleCheck && (
          <StyledSearchTextField
            type='text'
            hasChanged={false}
            defaultValue={inputVal}
            onChange={onChangeHandler}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{_('Cancel')}</Button>
        <Button disabled={!sumbitEnabled} onClick={handleApply}>
          {_('Delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

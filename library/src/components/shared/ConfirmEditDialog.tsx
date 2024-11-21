import React, {
  useState,
  useEffect,
  forwardRef,
  ComponentType,
  FormEvent,
} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import { DialogContentText, Slide, SlideProps } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import _ from '../../services/translations/translate';

const Transition: ComponentType<any> = forwardRef(function (
  props: SlideProps,
  ref: React.Ref<unknown>
) {
  return <Slide {...props} direction='up' ref={ref} />;
});
Transition.displayName = 'ConfirmDialogTransition';

interface ConfirmEditDialogProps {
  text: React.ReactNode;
  open: boolean;
  formEvent?: FormEvent<HTMLFormElement>;
  handleClose: () => void;
  handleSave: (e: FormEvent<HTMLFormElement>) => void;
}

export const ConfirmEditionDialog = (props: ConfirmEditDialogProps) => {
  const { open, handleClose, text, handleSave, formEvent } = props;
  const TOTAL_TIME = 100;
  const [progress, setProgress] = useState(TOTAL_TIME);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.stopPropagation();
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (open) {
      timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 0) {
            return 0;
          }
          return oldProgress - 5;
        });
      }, 250);
    }

    setProgress(TOTAL_TIME);

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [open]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      onKeyDown={handleKeyDown}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
    >
      <CloseRoundedIcon className='close-icon' onClick={handleClose} />
      <img src='assets/img/warning-dialog.svg' className='modal-icon' />
      <DialogTitle id='alert-dialog-slide-title'>
        {_('Save element')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-slide-description'>
          {text}
        </DialogContentText>
        <LinearProgress variant='determinate' value={progress} />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button
          hidden={progress !== 0}
          onClick={() => {
            if (formEvent) {
              handleSave(formEvent);
            }
          }}
          disabled={progress !== 0}
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

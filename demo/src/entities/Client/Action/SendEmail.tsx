import {
  ActionFunctionComponent,
  ActionItemProps,
} from '@irontec/ivoz-ui/router/routeMapParser';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import EmailIcon from '@mui/icons-material/Email';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { useStoreActions } from 'store';

import Client from '../Client';

const SendEmail: ActionFunctionComponent = (props: ActionItemProps) => {
  const { row, variant = 'icon' } = props;

  const [open, setOpen] = useState(false);
  const apiPost = useStoreActions((actions) => {
    return actions.api.post;
  });

  if (!row) {
    return null;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSend = () => {
    apiPost({
      path: `${Client.path}/${row.id}/notify_credentials`,
      values: {},
      contentType: 'text/plain',
    }).then(() => {
      setOpen(false);
    });
  };

  return (
    <>
      {variant === 'text' && (
        <span onClick={handleClickOpen}>{_('Send email')}</span>
      )}
      {variant === 'icon' && (
        <Tooltip
          title={_('Send email')}
          placement='bottom-start'
          enterTouchDelay={0}
        >
          <EmailIcon onClick={handleClickOpen} />
        </Tooltip>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>
          Send user credentials notification email?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            You&apos;re about to send an email with credentials to every enabled
            user with email address in <strong>{row.iden}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSend} autoFocus>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SendEmail;

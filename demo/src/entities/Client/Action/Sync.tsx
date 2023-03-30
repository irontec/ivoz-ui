import {
  ActionFunctionComponent,
  ActionItemProps,
} from '@irontec/ivoz-ui/router/routeMapParser';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useState } from 'react';
import { useStoreActions } from 'store';

import Client from '../Client';

const Sync: ActionFunctionComponent = (props: ActionItemProps) => {
  const { row, variant = 'icon' } = props;

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>();
  const apiPost = useStoreActions((actions) => {
    return actions.api.post;
  });

  if (!row) {
    return null;
  }

  const handleClickOpen = () => {
    setOpen(true);
    sendRequest();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendRequest = () => {
    apiPost({
      path: `${Client.path}/${row.id}/sync`,
      values: {},
      contentType: 'text/plain',
      silenceErrors: true,
    })
      .then(() => {
        setDone(true);
      })
      .catch((error: { statusText: string; status: number }) => {
        setErrorMsg(`${error.statusText} (${error.status})`);
        setError(true);
      });
  };

  if (row.platformType === 'other') {
    return null;
  }

  return (
    <>
      {variant === 'text' && (
        <span onClick={handleClickOpen}>{_('Sync client')}</span>
      )}
      {variant === 'icon' && (
        <Tooltip
          title={_('Sync client')}
          placement='bottom-start'
          enterTouchDelay={0}
        >
          <CloudSyncIcon onClick={handleClickOpen} />
        </Tooltip>
      )}
      <Dialog open={open} aria-labelledby='Syncing client'>
        <DialogTitle id='alert-dialog-title'>
          Syncing client <strong>{row.iden}</strong>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id='alert-dialog-description'
            sx={{
              textAlign: 'center',
            }}
          >
            {!error && !done && (
              <span>
                <CircularProgress />
              </span>
            )}
            {!error && done && (
              <span>
                <DoneAllIcon />
                <br />
                Client successfully synced
              </span>
            )}
            {error && (
              <span>
                <ErrorIcon />
                <br />
                There was a problem
                <br />
                {errorMsg}
              </span>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sync;

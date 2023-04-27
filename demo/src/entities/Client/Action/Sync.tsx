import { MoreMenuItem } from '@irontec/ivoz-ui/components/List/Content/Shared/MoreChildEntityLinks';
import { StyledTableRowCustomCta } from '@irontec/ivoz-ui/components/List/Content/Table/ContentTable.styles';
import { OutlinedButton } from '@irontec/ivoz-ui/components/shared/Button/Button.styles';
import {
  ActionFunctionComponent,
  ActionItemProps,
} from '@irontec/ivoz-ui/router/routeMapParser';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import ErrorIcon from '@mui/icons-material/Error';
import {
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
        <MoreMenuItem onClick={handleClickOpen}>
          {_('Sync client')}
        </MoreMenuItem>
      )}
      {variant === 'icon' && (
        <Tooltip
          title={_('Sync client')}
          placement='bottom-start'
          enterTouchDelay={0}
        >
          <StyledTableRowCustomCta>
            <CloudSyncIcon onClick={handleClickOpen} />
          </StyledTableRowCustomCta>
        </Tooltip>
      )}
      <Dialog open={open} aria-labelledby='Syncing client'>
        <CloseRoundedIcon className='close-icon' onClick={handleClose} />
        <img src='assets/img/success-dialog.svg' className='modal-icon' />
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
            {!error && done && <span>Client successfully synced</span>}
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
          <OutlinedButton
            onClick={handleClose}
            style={{ width: '50%', flexGrow: '0' }}
          >
            Close
          </OutlinedButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sync;

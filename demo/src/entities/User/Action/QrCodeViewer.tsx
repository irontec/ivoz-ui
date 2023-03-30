import {
  ActionFunctionComponent,
  ActionItemProps,
} from '@irontec/ivoz-ui/router/routeMapParser';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import { QrCode2 } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ImageListItem,
  Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useStoreActions, useStoreState } from 'store';

const QrCodeViewer: ActionFunctionComponent = (props: ActionItemProps) => {
  const { row, variant = 'icon' } = props;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | undefined>();
  const [authType, setAuthType] = useState<string | undefined>();

  const disabled = authType !== 'password' ? true : false;

  const [img, setImg] = useState<string>();

  const blobToBase64 = (blob: Blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => resolve(reader.result);
    });
  };

  const parentClient = useStoreState((state) => {
    return state.list.parentRow;
  });

  const entities = useStoreState((state) => {
    return state.entities.entities;
  });

  const apiDownload = useStoreActions((actions) => {
    return actions.api.download;
  });

  useEffect(() => {
    if (parentClient?.authType) {
      setAuthType(parentClient.authType as string);
    } else {
      setAuthType(undefined);
    }
  }, [parentClient]);

  const handleClickOpen = () => {
    if (disabled) {
      return;
    }

    apiDownload({
      path: `${entities.User.path}/${row.id}/login_qr`,
      params: {},
      handleErrors: false,
      successCallback: async (data) => {
        blobToBase64(data as Blob)
          .then((img) => {
            setImg(img as string);
            setError(false);
            setErrorMsg(undefined);
          })
          .catch((error: string) => {
            setErrorMsg(error);
            setError(true);
          });
      },
    }).catch((error: { statusText: string; status: number }) => {
      setErrorMsg(`${error.statusText} (${error.status})`);
      setError(true);
    });

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(false);
    setErrorMsg(undefined);
  };

  return (
    <>
      {variant === 'text' && (
        <span className={disabled ? 'disabled' : ''} onClick={handleClickOpen}>
          {_('QrCode')}
        </span>
      )}
      {variant === 'icon' && (
        <a className={disabled ? 'disabled' : ''}>
          <Tooltip title={_('QrCode')} placement='bottom' enterTouchDelay={0}>
            <QrCode2 onClick={handleClickOpen} />
          </Tooltip>
        </a>
      )}
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          keepMounted
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <DialogTitle id='alert-dialog-title'>QR Code</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              {!error && (
                <ImageListItem>
                  <img src={img} alt={'qr'} />
                </ImageListItem>
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
      )}
    </>
  );
};

export default QrCodeViewer;

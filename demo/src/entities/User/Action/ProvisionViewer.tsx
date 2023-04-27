import { MoreMenuItem } from '@irontec/ivoz-ui/components/List/Content/Shared/MoreChildEntityLinks';
import { StyledTableRowCustomCta } from '@irontec/ivoz-ui/components/List/Content/Table/ContentTable.styles';
import { SolidButton } from '@irontec/ivoz-ui/components/shared/Button/Button.styles';
import {
  ActionFunctionComponent,
  ActionItemProps,
} from '@irontec/ivoz-ui/router/routeMapParser';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { useStoreActions } from 'store';

import User from '../User';

const ProvisionViewer: ActionFunctionComponent = (props: ActionItemProps) => {
  const { row, variant = 'icon' } = props;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>();
  const [provision, setProvision] = useState<string>();

  const apiGet = useStoreActions((actions) => {
    return actions.api.get;
  });
  const apiPost = useStoreActions((actions) => {
    return actions.api.post;
  });

  const handleClickOpen = () => {
    apiGet({
      path: `${User.path}/${row.id}`,
      params: {},
      successCallback: async (user) => {
        const formData = {
          cloud_username: `${user?.iden}@${user?.client?.iden}`,
          cloud_password: `${user?.acrobitsPassword}`,
        };

        apiPost({
          path: '/provision/preview',
          values: formData,
          contentType: 'application/x-www-form-urlencoded',
          silenceErrors: true,
        })
          .then((data: { data: string }) => {
            setProvision(data.data);
          })
          .catch((error: { statusText: string; status: number }) => {
            setErrorMsg(`${error.statusText} (${error.status})`);
            setError(true);
          });
      },
    });

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (row.enable === 'no') {
    return null;
  }

  return (
    <>
      {variant === 'text' && (
        <MoreMenuItem onClick={handleClickOpen}>{_('Provision')}</MoreMenuItem>
      )}
      {variant === 'icon' && (
        <Tooltip title={_('Provision')} placement='bottom' enterTouchDelay={0}>
          <StyledTableRowCustomCta>
            <ContactPageIcon onClick={handleClickOpen} />
          </StyledTableRowCustomCta>
        </Tooltip>
      )}
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          keepMounted
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <CloseRoundedIcon className='close-icon' onClick={handleClose} />
          <img src='assets/img/qr-modal.svg' className='modal-icon' />
          <DialogTitle id='alert-dialog-title'>Provision User</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              {!error && <pre>{provision}</pre>}
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
            <SolidButton onClick={handleClose} sx={{ width: '100%' }}>
              Ok
            </SolidButton>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default ProvisionViewer;

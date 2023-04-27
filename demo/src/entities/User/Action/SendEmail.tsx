import { MoreMenuItem } from '@irontec/ivoz-ui/components/List/Content/Shared/MoreChildEntityLinks';
import { StyledTableRowCustomCta } from '@irontec/ivoz-ui/components/List/Content/Table/ContentTable.styles';
import {
  OutlinedButton,
  SolidButton,
} from '@irontec/ivoz-ui/components/shared/Button/Button.styles';
import {
  ActionFunctionComponent,
  CustomActionProps,
  isMultiSelectAction,
  isSingleRowAction,
} from '@irontec/ivoz-ui/router/routeMapParser';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EmailIcon from '@mui/icons-material/Email';
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
import { UserPropertiesList, UserPropertyList } from '../UserProperties';

interface SendEmailProps {
  error: boolean;
  children: JSX.Element;
  targetId: string;
  open: boolean;
  variant?: 'text' | 'icon';
  setOpen: (open: boolean) => void;
  disabled: boolean;
}

const SendEmail = (props: SendEmailProps) => {
  const { error, children, targetId, variant = 'icon', disabled } = props;
  const { open, setOpen } = props;

  const apiPost = useStoreActions((actions) => {
    return actions.api.post;
  });

  const handleClickOpen = () => {
    if (disabled) {
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSend = () => {
    apiPost({
      path: `${User.path}/${targetId}/notify_credentials`,
      values: {},
      contentType: 'text/plain',
    }).then(() => {
      setOpen(false);
    });
  };

  const dialogIcon = error
    ? 'assets/img/error-dialog.svg'
    : 'assets/img/send-dialog.svg';

  return (
    <>
      <a className={disabled ? 'disabled' : ''} onClick={handleClickOpen}>
        {variant === 'text' && <MoreMenuItem>{_('Send email')}</MoreMenuItem>}
        {variant === 'icon' && (
          <Tooltip
            title={_('Send email')}
            placement='bottom-start'
            enterTouchDelay={0}
          >
            <StyledTableRowCustomCta>
              <EmailIcon />
            </StyledTableRowCustomCta>
          </Tooltip>
        )}
      </a>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby='alert-dialog-title'
          aria-describedby='alert-dialog-description'
        >
          <CloseRoundedIcon className='close-icon' onClick={handleClose} />
          <img src={dialogIcon} className='modal-icon' />
          <DialogTitle id='alert-dialog-title'>
            {'Send user credentials notification email?'}
          </DialogTitle>
          <DialogContent>
            {error && (
              <DialogContentText id='alert-dialog-description'>
                Selected user(s) must be enabled and contain an email address
              </DialogContentText>
            )}
            {!error && children}
          </DialogContent>
          <DialogActions>
            {error && (
              <OutlinedButton onClick={handleClose}>Cancel</OutlinedButton>
            )}
            {!error && (
              <>
                <OutlinedButton onClick={handleClose}>Cancel</OutlinedButton>
                <SolidButton onClick={handleSend} autoFocus>
                  Send
                </SolidButton>
              </>
            )}
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

const SendEmailWrapper: ActionFunctionComponent = (
  props: CustomActionProps
) => {
  const { variant } = props;
  const [open, setOpen] = useState(false);

  let disabled = false;
  if (isSingleRowAction(props)) {
    const { row } = props;

    if (row.enabled === 'no') {
      disabled = true;
    }

    if (!row.email) {
      disabled = true;
    }

    const targetId = row.id;
    const error = !targetId;

    return (
      <SendEmail
        disabled={disabled}
        variant={variant}
        error={error}
        targetId={targetId}
        open={open}
        setOpen={setOpen}
      >
        <DialogContentText id='alert-dialog-description'>
          You&apos;re about to send an email with credentials to user &nbsp;
          <strong>{row.iden}</strong>
        </DialogContentText>
      </SendEmail>
    );
  }
  if (isMultiSelectAction(props)) {
    const { rows, selectedValues } = props;

    const selectedUsers = selectedValues.map((id: string) => {
      return (rows as UserPropertiesList).find(
        (row) => row.id?.toString() === id
      );
    }) as Array<undefined | UserPropertyList<string>>;

    const validSelectedUsers = selectedUsers.filter(
      (user) => user && user.enabled && user.email
    );

    const skipped = selectedUsers.length - validSelectedUsers.length;

    const targetId = (validSelectedUsers as Array<UserPropertyList<string>>)
      .map((user) => user?.id)
      .join(';');
    const error = validSelectedUsers.length === 0;

    return (
      <SendEmail
        disabled={disabled || selectedUsers.length === 0}
        variant={variant}
        error={error}
        targetId={targetId}
        open={open}
        setOpen={setOpen}
      >
        <DialogContentText id='alert-dialog-description'>
          You&apos;re about to send an email with credentials to: <br />
          <span
            style={{
              display: 'block',
              marginTop: '10px',
              maxHeight: '80px',
              overflowY: 'auto',
            }}
          >
            {validSelectedUsers.map((user, idx) => {
              return (
                <span key={idx}>
                  <strong>
                    {user?.iden} ({user?.email})
                  </strong>
                  <br />
                </span>
              );
            })}
          </span>
          {skipped > 0 && (
            <span
              style={{
                display: 'block',
                marginTop: '10px',
              }}
            >
              <strong>{skipped} skipped user(s)</strong> (not enabled or no
              email address).
            </span>
          )}
        </DialogContentText>
      </SendEmail>
    );
  }

  return null;
};

export default SendEmailWrapper;

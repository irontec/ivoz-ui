import {
  ActionFunctionComponent,
  isSingleRowAction,
  MultiSelectActionItemProps,
} from '@irontec/ivoz-ui/router/routeMapParser';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import ErrorIcon from '@mui/icons-material/Error';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStoreActions } from 'store';

import user from '../User';

const UpdateLicenses: ActionFunctionComponent = (
  props: MultiSelectActionItemProps
) => {
  const { selectedValues = [], variant = 'icon' } = props;
  const disabled = selectedValues.length === 0;

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>();
  const navigate = useNavigate();
  const location = useLocation();

  const [licensesValue, setLicenseValue] = useState('');

  const apiPost = useStoreActions((actions) => {
    return actions.api.post;
  });

  const handleChange = (event: SelectChangeEvent) => {
    setLicenseValue(event.target.value);
  };

  const handleClickOpen = () => {
    if (disabled) {
      return;
    }

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(false);
  };

  const handleUpdate = () => {
    const path = `${user.path}/${selectedValues.join(
      ';'
    )}/switch_licenses?type=${licensesValue}`;
    const resp = apiPost({
      path,
      values: {},
      contentType: 'application/json',
      silenceErrors: true,
    })
      .then(() => {
        setOpen(false);

        if (resp !== undefined) {
          navigate(`${location.pathname}/__reloading`);
          setTimeout(() => {
            navigate(location.pathname);
          });
        }
      })
      .catch(
        (error: {
          statusText: string;
          status: number;
          data?: Record<string, string>;
        }) => {
          const errorMsg =
            error?.data?.detail ?? `${error.statusText} (${error.status})`;
          setErrorMsg(errorMsg);
          setError(true);
        }
      );
  };

  if (isSingleRowAction(props)) {
    return <span className='display-none'></span>;
  }

  return (
    <>
      <span className={disabled ? 'disabled' : ''} onClick={handleClickOpen}>
        {variant === 'text' && (
          <span onClick={handleClickOpen}>{_('Change Licences')}</span>
        )}
        {variant === 'icon' && (
          <Tooltip
            title={_('Change Licences')}
            placement='bottom'
            enterTouchDelay={0}
          >
            <ReceiptLongIcon />
          </Tooltip>
        )}
      </span>
      {open && (
        <Dialog open={open} onClose={handleClose} keepMounted>
          <DialogTitle>Change licence to:</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {!error && (
                <FormControl
                  sx={{
                    margin: 1,
                    minWidth: 120,
                  }}
                >
                  <Select value={licensesValue} onChange={handleChange}>
                    <MenuItem value={'no'}>None</MenuItem>
                    <MenuItem value={'desktop'}>Desktop</MenuItem>
                    <MenuItem value={'mobile'}>Mobile</MenuItem>
                    <MenuItem value={'dual'}>Dual</MenuItem>
                  </Select>
                  <FormHelperText>
                    Dual licence is valid for both mobile and desktop
                  </FormHelperText>
                </FormControl>
              )}
              {error && (
                <span>
                  <ErrorIcon
                    sx={{
                      verticalAlign: 'bottom',
                    }}
                  />
                  {errorMsg ?? 'There was a problem'}
                </span>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            {!error && (
              <Button onClick={handleUpdate} autoFocus>
                Accept
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default UpdateLicenses;

import { MoreMenuItem } from '@irontec/ivoz-ui/components/List/Content/Shared/MoreChildEntityLinks';
import { StyledTableRowCustomCta } from '@irontec/ivoz-ui/components/List/Content/Table/ContentTable.styles';
import {
  OutlinedButton,
  SolidButton,
} from '@irontec/ivoz-ui/components/shared/Button/Button.styles';
import {
  ActionFunctionComponent,
  MultiSelectActionItemProps,
  isSingleRowAction,
} from '@irontec/ivoz-ui/router/routeMapParser';
import _ from '@irontec/ivoz-ui/services/translations/translate';
import ErrorIcon from '@mui/icons-material/Error';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Tooltip
} from '@mui/material';
import { useState } from 'react';

const DoSomething: ActionFunctionComponent = (
  props: MultiSelectActionItemProps
) => {
  const { selectedValues = [], variant = 'icon' } = props;
  const disabled = selectedValues.length === 0;

  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg] = useState<string>();

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

  if (isSingleRowAction(props)) {
    return <span className='display-none'></span>;
  }

  return (
    <>
      <a className={disabled ? 'disabled' : ''} onClick={handleClickOpen}>
        {variant === 'text' && (
          <MoreMenuItem onClick={handleClickOpen}>
            {_('Do something')}
          </MoreMenuItem>
        )}
        {variant === 'icon' && (
          <Tooltip
            title={_('Do something')}
            placement='bottom'
            enterTouchDelay={0}
          >
            <span>
              <StyledTableRowCustomCta disabled={disabled}>
                <ReceiptLongIcon />
              </StyledTableRowCustomCta>
            </span>
          </Tooltip>
        )}
      </a>
      {open && (
        <Dialog open={open} onClose={handleClose} keepMounted>
          <DialogTitle>Do something</DialogTitle>
          <DialogContent sx={{ textAlign: 'left!important' }}>
            {!error && (
              <>
                <FormHelperText>
                  Multiselect action example
                </FormHelperText>
              </>
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
          </DialogContent>
          <DialogActions>
            <OutlinedButton onClick={handleClose}>Cancel</OutlinedButton>
            {!error && (
              <SolidButton autoFocus onClick={handleClose}>
                Accept
              </SolidButton>
            )}
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default DoSomething;

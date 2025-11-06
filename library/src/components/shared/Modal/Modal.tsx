import { SxProps, Theme } from '@mui/material';
import {
  StyledDialogContentBody,
  StyledDialogContent,
  StyledDialogActions,
} from './Modal.styles';
import { OutlinedButton, SolidButton } from '../Button/Button.styles';
import { SlideProps } from '@mui/material/Slide';
import { forwardRef } from 'react';
import Slide from '@mui/material/Slide';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Box,
  Dialog,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material';

interface Button {
  label: React.ReactNode;
  onClick: (event: React.MouseEvent) => void;
  autoFocus?: boolean;
  variant?: 'outlined' | 'solid';
  disabled?: boolean;
}

interface ModalContentProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  open: boolean;
  onClose: () => void;
  buttons?: Button[];
  icon?: string;
  keepMounted?: boolean;
}

const Transition = forwardRef(function Transition(
  props: SlideProps,
  ref: React.Ref<unknown>
) {
  return <Slide {...props} direction='up' ref={ref} />;
});

export default function Modal(props: ModalContentProps): JSX.Element {
  const {
    title,
    description,
    children,
    sx,
    open,
    onClose,
    buttons,
    icon,
    keepMounted = false,
  } = props;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    event.stopPropagation();
  };

  const renderButton = (button: Button, index: number) => {
    const ButtonTypeComponent =
      button.variant === 'outlined' ? OutlinedButton : SolidButton;
    return (
      <ButtonTypeComponent
        key={index}
        onClick={button.onClick}
        autoFocus={button.autoFocus}
        disabled={button.disabled ?? false}
        sx={{ flex: 1 }}
      >
        {button.label}
      </ButtonTypeComponent>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      onKeyDown={handleKeyDown}
      keepMounted={keepMounted}
    >
      <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Box>
      {icon && <img src={icon} className='modal-icon' alt='dialog icon' />}
      <DialogTitle id='alert-dialog-slide-title'>{title}</DialogTitle>
      <StyledDialogContent>
        {description && (
          <DialogContentText id='alert-dialog-slide-description'>
            {description}
          </DialogContentText>
        )}
        <StyledDialogContentBody sx={sx}>{children}</StyledDialogContentBody>
      </StyledDialogContent>
      {buttons && (
        <StyledDialogActions style={{ padding: 0 }}>
          {buttons?.map(renderButton)}
        </StyledDialogActions>
      )}
    </Dialog>
  );
}

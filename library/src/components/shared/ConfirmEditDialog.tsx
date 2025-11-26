import React, { useState, useEffect, FormEvent } from 'react';
import { Box } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import _ from '../../services/translations/translate';
import Modal from './Modal/Modal';

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

  const customButtons = [
    {
      label: _('Cancel'),
      onClick: () => handleClose(),
      variant: 'outlined' as const,
      autoFocus: false,
    },
    ...(progress === 0
      ? [
          {
            label: _('Apply'),
            onClick: () => {
              if (formEvent) {
                handleSave(formEvent);
              }
            },
            variant: 'solid' as const,
            autoFocus: true,
          },
        ]
      : []),
  ];

  return (
    <Modal
      title={_('Save element')}
      description={text}
      open={open}
      onClose={handleClose}
      buttons={customButtons}
      keepMounted={true}
    >
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress variant='determinate' value={progress} />
      </Box>
    </Modal>
  );
};

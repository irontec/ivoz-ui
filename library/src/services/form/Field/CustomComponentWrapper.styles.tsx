import CloseIcon from '@mui/icons-material/Close';
import { FormControl, styled } from '@mui/material';
import { DragEvent } from 'react';

export const StyledCloseIcon = styled(CloseIcon)(() => {
  return {
    position: 'relative',
  };
});

interface StyledFieldsetRootProps {
  children: React.ReactNode;
  label: string | React.ReactElement<any>;
  hasChanged: boolean;
  disabled: boolean;
  required?: boolean;
  className?: string;
  handleDrop?: (e: DragEvent) => void;
  handleDragEnter?: (e: DragEvent) => void;
  handleDragLeave?: (e: DragEvent) => void;
  handleDragOver?: (e: DragEvent) => void;
}
export const StyledFieldsetRoot = styled((props: StyledFieldsetRootProps) => {
  const { children, label, hasChanged, disabled, required } = props;
  const { handleDrop, handleDragEnter, handleDragLeave, handleDragOver } =
    props;

  let className = props.className;
  if (hasChanged) {
    className += ' changed';
  }
  if (disabled) {
    className += ' disabled';
  }

  return (
    <FormControl variant='standard' fullWidth={true} className={className}>
      {label && (
        <label>
          {label}
          {required && '*'}
        </label>
      )}
      <div
        className='fieldsetContainer'
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
      >
        {children}
      </div>
    </FormControl>
  );
})(() => {
  return {
    '& fieldset': {
      padding: '10px 10px 5px',
    },
    '&.multilang fieldset': {
      border: 'none',
      margin: '0',
      padding: '0',
    },
    '&.multilang label': {
      fontSize: '13px',
    },
  };
});

interface StyledFieldsetProps {
  children: React.ReactNode;
  className?: string;
}
export const StyledFieldset = styled((props: StyledFieldsetProps) => {
  const { children, className } = props;
  return (
    <fieldset className={className}>
      <div className='customComponentContainer'>{children}</div>
    </fieldset>
  );
})(({ theme }) => {
  const borderColor =
    theme.palette.mode === 'light'
      ? 'rgba(0, 0, 0, 0.23)'
      : 'rgba(255, 255, 255, 0.23)';

  return {
    position: 'relative',
    borderWidth: '1px',
    borderRadius: theme.shape.borderRadius,
    borderColor: borderColor,
    '& > legend': {
      visibility: 'hidden',
      fontSize: '0.8rem',
    },
    '& .customComponentContainer': {
      fontSize: '1rem',
      color: theme.palette.text.secondary,
      padding: '0px 0 7px',
    },
  };
});

import { styled } from '@mui/material';

interface StyledFileUploaderContainer {
  children: React.ReactNode;
  className?: string;
}

export const StyledFileUploaderContainer = styled(
  (props: StyledFileUploaderContainer) => {
    const { children, className } = props;

    return <div className={className}>{children}</div>;
  }
)(() => {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--spacing-md)',
    padding: 'var(--spacing-sm)',
  };
});

interface StyledUploadButtonLabelProps {
  children: React.ReactNode;
  className?: string;
  htmlFor: string;
}
export const StyledUploadButtonLabel = styled(
  (props: StyledUploadButtonLabelProps) => {
    const { children, className, htmlFor } = props;
    return (
      <label htmlFor={htmlFor} className={`${className} link`}>
        {children}
      </label>
    );
  }
)({
  marginBlock: 'var(--spacing-xs)',
  '&.upload-icon': {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

export const StyledFileNameContainer = styled('div')({
  color: '#B2B3B6',
  alignItems: 'center',
  display: 'flex',
  gap: 'var(--spacing-xs)',
  '&.disabled': {
    color: 'rgba(0, 0, 0, 0.5)',
  },
});

export const StyledImageContainer = styled('div')({
  '& svg': {
    fontSize: '100px',
    color: '#A3A4A8',
  },
});

export const StyledImagePreview = styled('img')({
  maxWidth: '300px',
  height: 'auto',
});

export const StyledTextContainer = styled('div')({
  color: '#B2B3B6',
  fontSize: '14px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  flexGrow: 1,
});

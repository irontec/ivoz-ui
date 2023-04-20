import { Avatar, Button } from '@mui/material';
import { styled } from '@mui/material';

export const StyledAvatar = styled(Avatar)(({ theme }) => {
  return {
    margin: theme.spacing(1) + ' auto',
  };
});

interface StyledFormProps {
  children: React.ReactNode;
  className?: string;
  onSubmit: React.FormEventHandler;
}
export const StyledForm = styled((props: StyledFormProps) => {
  const { children, className, onSubmit } = props;
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
    </form>
  );
})(({ theme }) => {
  return {};
});

interface StyledSubmitButton {
  children: React.ReactNode;
  className?: string;
  variant: 'text' | 'outlined' | 'contained' | undefined;
}
export const StyledSubmitButton = styled((props: StyledSubmitButton) => {
  const { children, className, variant } = props;
  return (
    <Button type='submit' fullWidth variant={variant} className={className}>
      {children}
    </Button>
  );
})(({ theme }) => {
  return {
    margin: theme.spacing(3, 0, 2),
  };
});

import { Avatar, Button } from '@mui/material';
import Login from './Login';
import { styled } from '@mui/material';

export const StyledLogin = styled(Login)(({ theme }) => {
  return {
    height: '100vh',
    backgroundColor: 'var(--color-background)',
    backgroundImage: 'url(demo/src/assets/img/bg-noise.png)',
    display: 'flex',
    flexDirection: 'column',
    padding: 'var(--spacing-lg) var(--spacing-xl)',
    maxWidth: 'unset!important',

    '& .logo-container': {
      [theme.breakpoints.down('md')]: {
        textAlign: 'center',
      }
    },
    '& .logo': {
      width: '160px',
    },
    '& .form-container': {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      justifyContent: 'center',
    },
    '& form': {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-lg)',
      width: '100%',
      maxWidth: '420px',
      margin: '0 auto',
      padding: 'var(--spacing-xl)',
      '& h2': {
        textAlign: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
      }
    },
    '& .password': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    '& button': {
      width: '100%',
    },
    '& .link': {
      textAlign: 'center',
    }
  };
});

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

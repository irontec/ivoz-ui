import { ButtonProps } from '@mui/material/Button';
import Button from './Button';
import React from 'react';
import { styled } from '@mui/material';

const sharedButtonStyles = {
  minWidth: 'auto',
  padding: 'var(--spacing-sm)',
  height: 'fit-content',
  borderRadius: 'var(--radius-md)',
  boxSizing: 'border-box',
  textTransform: 'capitalize',
  '&:disabled': {
    background: '#edeeef',
    color: '#d1d1d3',
  },
  '& svg': {
    color: 'currentColor',
  }
};

const StyledButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, ...rest } = props;

    return (
      <Button {...rest} ref={ref}>
        {children}
      </Button>
    );
  }
);
StyledButton.displayName = 'StyledButton';

const LightButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, size, className, ...rest } = props;

    return (
      <StyledButton {...rest} ref={ref} className={`${className} ${size}`}>
        {children}
      </StyledButton>
    );
  }
);
LightButton.displayName = 'LightButton';

const StyledLightButton = styled(LightButton)(() => {
  return {
    ...sharedButtonStyles as any,
    background: 'var(--color-button)',
    color: 'var(--color-text)',
    '&:active, &:hover': {
      background: 'var(--color-background-elevated)',
      color: 'var(--color-primary)',
      boxShadow: '0px 0px 7px #1111111a',
    }
  };
});

const TonedButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, size, className, ...rest } = props;

    return (
      <StyledButton {...rest} ref={ref} className={`${className} ${size}`}>
        {children}
      </StyledButton>
    );
  }
);
TonedButton.displayName = 'TonedButton';

const StyledTonedButton = styled(TonedButton)(() => {
  return {
    ...sharedButtonStyles as any,
    backgroundColor: 'var(--color-primary-bg-toned)',
    color: 'var(--color-primary)',
    '&:active, &:hover': {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-button)',
    }
  };
});


const OutlinedButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, size, className, ...rest } = props;

    return (
      <StyledButton {...rest} ref={ref} className={`${className} ${size}`}>
        {children}
      </StyledButton>
    );
  }
);
OutlinedButton.displayName = 'OutlinedButton';

const StyledOutlinedButton = styled(OutlinedButton)(() => {
  return {
    ...sharedButtonStyles as any,
    backgroundColor: 'transparent',
    color: 'var(--color-text)',
    border: '1px solid currentColor',
    boxShadow: '0px 0px transparent',
  
    '&:active, &:hover': {
      background: 'transparent!important',
      boxShadow: '0px 3px 7px #51515159',
    }
  };
});


const SolidButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, size, className, ...rest } = props;

    return (
      <StyledButton {...rest} ref={ref} className={`${className} ${size}`}>
        {children}
      </StyledButton>
    );
  }
);
SolidButton.displayName = 'SolidButton';

const StyledSolidButton = styled(SolidButton)(() => {
  return {
    ...sharedButtonStyles as any,
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-button)',
    boxShadow: '0px 0px transparent',

    '&:active, &:hover': {
      backgroundColor: 'var(--color-primary)!important',
      color: 'var(--color-button)',
      boxShadow: '0px 3px 3px #51515159',
    }
  };
});


export {
  StyledLightButton as LightButton,
  StyledTonedButton as TonedButton,
  StyledOutlinedButton as OutlinedButton,
  StyledSolidButton as SolidButton,
};
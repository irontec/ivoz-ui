import { ButtonProps } from '@mui/material/Button';
import React from 'react';
import Button from './Button';
import './Button.scoped.scss';

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

export const LightButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, size, ...rest } = props;

    return (
      <StyledButton {...rest} ref={ref} className={`light ${size}`}>
        {children}
      </StyledButton>
    );
  }
);
LightButton.displayName = 'LightButton';

export const TonalButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, size, ...rest } = props;

    return (
      <StyledButton {...rest} ref={ref} className={`tonal ${size}`}>
        {children}
      </StyledButton>
    );
  }
);
TonalButton.displayName = 'TonalButton';

export const OutlinedButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, size, ...rest } = props;

    return (
      <StyledButton {...rest} ref={ref} className={`outlined ${size}`}>
        {children}
      </StyledButton>
    );
  }
);
OutlinedButton.displayName = 'OutlinedButton';

export const SolidButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, size, ...rest } = props;

    return (
      <StyledButton {...rest} ref={ref} className={`solid ${size}`}>
        {children}
      </StyledButton>
    );
  }
);
SolidButton.displayName = 'SolidButton';

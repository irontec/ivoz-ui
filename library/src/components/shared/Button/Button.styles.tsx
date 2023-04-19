import { ButtonProps } from '@mui/material/Button';
import Button from './Button';
import './Button.scoped.scss';
import React from 'react';

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

export const TonedButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, size, ...rest } = props;

    return (
      <StyledButton {...rest} ref={ref} className={`toned ${size}`}>
        {children}
      </StyledButton>
    );
  }
);
TonedButton.displayName = 'TonedButton';

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

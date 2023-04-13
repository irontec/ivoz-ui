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

type ButtonPropsType = Omit<ButtonProps, 'className'> & {
  children: React.ReactNode;
  size?: 'big' | 'small';
};

export const LightButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, size, ...rest } = props;

    return (
      <StyledButton {...rest} className={`light ${size}`}>
        {children}
      </StyledButton>
    );
  }
);

export const TonedButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, size, ...rest } = props;

    return (
      <StyledButton {...rest} className={`toned ${size}`}>
        {children}
      </StyledButton>
    );
  }
);

export const OutlinedButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, size, ...rest } = props;

    return (
      <StyledButton {...rest} className={`outlined ${size}`}>
        {children}
      </StyledButton>
    );
  }
);

export const SolidButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, size, ...rest } = props;

    return (
      <StyledButton {...rest} className={`solid ${size}`}>
        {children}
      </StyledButton>
    );
  }
);

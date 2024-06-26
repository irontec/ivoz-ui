import { ButtonProps } from '@mui/material/Button';
import React from 'react';
import Button from './Button';
import { styled } from '@mui/material';

const sharedCssVariables = {
  '--color': 'var(--color-primary)',
  '--colorTonal': 'var(--color-primary-tonal)',
};

const sharedButtonStyles = {
  minWidth: 'auto',
  padding: 'var(--spacing-sm)',
  height: 'fit-content',
  borderRadius: 'var(--radius-md)',
  boxSizing: 'border-box',
  textTransform: 'capitalize',
  '&.MuiButton-textError': {
    '--color': 'var(--color-danger)',
  },
  '&.MuiButton-textSecondary': {
    '--color': 'var(--color-secondary)',
    '--colorTonal': 'var(--color-secondary-tonal)',
  },
  '&:disabled': {
    background: '#edeeef',
    color: '#d1d1d3',
  },
  '& svg': {
    color: 'currentColor',
  },
};

const StyledButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, ...rest } = props;

    return (
      <Button
        {...rest}
        ref={ref}
        style={sharedCssVariables as React.CSSProperties}
      >
        {children}
      </Button>
    );
  }
);

export const StyledColorPickerButton = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, style, ...rest } = props;

    return (
      <Button
        {...rest}
        ref={ref}
        style={{
          width: '100px',
          height: 40,
          backgroundColor: style?.color as string,
        }}
      >
        {children}
      </Button>
    );
  }
);
StyledColorPickerButton.displayName = 'StyledColorPickerButton';
StyledButton.displayName = 'StyledButton';
type ForwardRefButtonType = typeof StyledButton;

const LightButton: ForwardRefButtonType = React.forwardRef(
  (props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const { children, size, className, ...rest } = props;

    return (
      <StyledButton
        {...rest}
        ref={ref}
        className={`${className} ${size}`}
        style={sharedCssVariables as React.CSSProperties}
      >
        {children}
      </StyledButton>
    );
  }
);
LightButton.displayName = 'LightButton';

const StyledLightButton = styled(LightButton)(() => {
  return {
    ...(sharedButtonStyles as any),
    background: 'var(--color-button)',
    color: 'var(--color-text)',
    '&:active, &:hover': {
      background: 'var(--color-background-elevated)',
      color: 'var(--color)',
      boxShadow: '0px 0px 7px #1111111a',
    },
  };
});

const TonalButton = { ...LightButton } as unknown as ForwardRefButtonType;
TonalButton.displayName = 'TonalButton';

const StyledTonalButton = styled(LightButton)(() => {
  return {
    ...(sharedButtonStyles as any),
    backgroundColor: 'var(--colorTonal)',
    color: 'var(--color)',
    '&:active, &:hover': {
      backgroundColor: 'var(--color)',
      color: 'var(--color-button)',
    },
  };
});

const OutlinedButton = { ...LightButton } as unknown as ForwardRefButtonType;
OutlinedButton.displayName = 'OutlinedButton';

const StyledOutlinedButton = styled(OutlinedButton)(() => {
  return {
    ...(sharedButtonStyles as any),
    backgroundColor: 'transparent',
    color: 'var(--color-text)',
    border: '1px solid currentColor',
    boxShadow: '0px 0px transparent',

    '&:active, &:hover': {
      background: 'transparent!important',
      boxShadow: '0px 3px 7px #51515159',
    },
  };
});

const SolidButton = { ...LightButton } as unknown as ForwardRefButtonType;
SolidButton.displayName = 'SolidButton';

const StyledSolidButton = styled(SolidButton)(() => {
  return {
    ...(sharedButtonStyles as any),
    backgroundColor: 'var(--color)',
    color: 'var(--color-button)',
    boxShadow: '0px 0px transparent',

    '&:active, &:hover': {
      backgroundColor: 'var(--color)!important',
      color: 'var(--color-button)',
      boxShadow: '0px 3px 3px #51515159',
    },
  };
});

export {
  StyledLightButton as LightButton,
  StyledTonalButton as TonalButton,
  StyledOutlinedButton as OutlinedButton,
  StyledSolidButton as SolidButton,
};

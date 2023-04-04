import { ButtonProps } from '@mui/material/Button';
import Button from './Button';
import './Button.scoped.scss';

const StyledButton = (props: ButtonProps) => {
  const { children, ...rest } = props;

  return <Button {...rest}>{children}</Button>;
};

type ButtonPropsType = Omit<ButtonProps, 'className'> & {
  children: React.ReactNode;
  size?: 'big' | 'small';
};

export const LightButton = (props: ButtonPropsType): JSX.Element => {
  const { children, size } = props;

  return <StyledButton className={`light ${size}`}>{children}</StyledButton>;
};

export const PrimaryButton = (props: ButtonPropsType): JSX.Element => {
  const { children, size } = props;

  return <StyledButton className={`primary ${size}`}>{children}</StyledButton>;
};

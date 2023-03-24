import { FormControl } from '@mui/material';
import './Switch.scoped.scss';
export interface StyledSwitchFormControlProps {
  children: React.ReactNode;
  className?: string;
  hasChanged: boolean;
}
export const SwitchFormControl = (props: StyledSwitchFormControlProps) => {
  const { children, hasChanged } = props;
  let className = props.className;
  if (hasChanged) {
    className += ' changed';
  }

  return (
    <FormControl className={'switch ' + className} fullWidth={true}>
      {children}
    </FormControl>
  );
};

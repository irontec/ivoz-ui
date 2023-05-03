import { styled } from '@mui/material';
import _ from '../../../services/translations/translate';
import { OutlinedButton, SolidButton } from './Button.styles';

interface SaveButtonProps {
  className?: string;
}

const SaveButton = function (props: SaveButtonProps): JSX.Element {
  const { className } = props;

  return (
    <div className={className}>
      <OutlinedButton>Cancel</OutlinedButton>
      <SolidButton type='submit'>{_('Save')}</SolidButton>
    </div>
  );
};

export default styled(SaveButton)(() => {
  return {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '20px',
    '& button': {
      width: '160px',
    },
  };
});

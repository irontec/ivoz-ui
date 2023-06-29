import { styled } from '@mui/material';
import _ from '../../../services/translations/translate';
import { OutlinedButton, SolidButton } from './Button.styles';
import { Link } from 'react-router-dom';

interface SaveButtonProps {
  className?: string;
}

const SaveButton = function (props: SaveButtonProps): JSX.Element {
  const { className } = props;

  const parentUrl = location.pathname.replace(/\/[^\/]+\/update|\/create/, '');
  const showCancelButton = parentUrl !== location.pathname;

  return (
    <div className={className}>
      {showCancelButton && (
        <Link to={parentUrl}>
          <OutlinedButton>{_('Cancel')}</OutlinedButton>
        </Link>
      )}
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

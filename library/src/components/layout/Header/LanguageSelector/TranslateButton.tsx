import TranslateIcon from '@mui/icons-material/Translate';
import { Tooltip } from '@mui/material';
import { StyledButton } from '../styles';

type TranslateButtonProps = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

export const TranslateButton = (props: TranslateButtonProps): JSX.Element => {
  const { onClick } = props;

  return (
    <Tooltip title='Translate'>
      <StyledButton onClick={onClick}>
        <TranslateIcon fontSize='small' />
      </StyledButton>
    </Tooltip>
  );
};

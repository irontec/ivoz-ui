import TranslateIcon from '@mui/icons-material/Translate';
import { IconButton, Tooltip } from '@mui/material';
import { StyledAvatar } from '../../Header/styles';

type StyledTranslateButtonProps = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

export const StyledTranslateButton = (
  props: StyledTranslateButtonProps
): JSX.Element => {
  const { onClick } = props;

  return (
    <Tooltip title='Translate'>
      <IconButton
        onClick={onClick}
        sx={{ padding: 0, margin: '0px 10px 10px' }}
      >
        <StyledAvatar>
          <TranslateIcon fontSize='small' />
        </StyledAvatar>
      </IconButton>
    </Tooltip>
  );
};

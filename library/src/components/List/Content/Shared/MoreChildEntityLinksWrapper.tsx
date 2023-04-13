import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import React from 'react';
import { LightButton } from '../../../../components/shared/Button/Button.styles';
import { StyledMenu } from '../../../shared/Menu/Menu.styles';

interface MoreChildEntityLinksProps {
  children: React.ReactNode;
  disabled: boolean;
}

export const MoreChildEntityLinksWrapper = (
  props: MoreChildEntityLinksProps
) => {
  const { children, disabled } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <LightButton onClick={handleClick} disabled={disabled}>
        <MoreHorizIcon />
      </LightButton>
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {children}
      </StyledMenu>
    </>
  );
};

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Button } from '@mui/material';
import React from 'react';
import { StyledMenu } from '../../../shared/Menu/Menu.styles';
import { StyledTableRowCustomCta } from '../Table/ContentTable.styles';

interface MoreChildEntityLinksProps {
  children: React.ReactNode;
}

export const MoreChildEntityLinksWrapper = (
  props: MoreChildEntityLinksProps
) => {
  const { children } = props;

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
      <Button variant='contained'>
        <StyledTableRowCustomCta onClick={handleClick}>
          <MoreHorizIcon />
        </StyledTableRowCustomCta>
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
      </Button>
    </>
  );
};

import { Card, CardActions } from '@mui/material';
import { styled } from '@mui/material';

export const StyledCardActions = styled(CardActions)(() => {
  return {
    padding: '0 7px 0 16px',
    display: 'flex',
    justifyContent: 'space-between',
  };
});

export const StyledCardContainer = styled('div')(() => {
  return {};
});

export const StyledCard = styled(Card)(() => {
  return {
    margin: '0 0 10px',
    padding: '0 0 20px',
    boxShadow: 'none',
    borderBottom: '1px solid #ccc',
    borderRadius: 'unset',
  };
});

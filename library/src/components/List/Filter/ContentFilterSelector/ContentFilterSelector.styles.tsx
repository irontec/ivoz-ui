import { Box, styled } from '@mui/material';
import ContentFilterSelector from './ContentFilterSelector';

const StyledContentFilterSelector = styled(ContentFilterSelector)(() => {
  return {
    minWidth: 500,
  };
});

export const StyledContainer = styled(Box)(() => {
  return {
    padding: 15,
  };
});

export const StyledRowContainer = styled(Box)(() => {
  return {
    display: 'flex-container',
  };
});

export const StyledLastRowContainer = styled(Box)(() => {
  return {
    display: 'flex-container',
    justifyContent: 'space-between',
  };
});

export const StyledRowItem = styled(Box)(() => {
  return {
    display: 'flex',
    padding: 5,
    width: 200,
  };
});

export const StyledRowActionItem = styled(Box)(() => {
  return {
    display: 'flex',
    padding: 5,
    width: 80,
  };
});

export default StyledContentFilterSelector;

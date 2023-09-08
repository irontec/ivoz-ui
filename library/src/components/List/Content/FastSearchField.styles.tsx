import { styled } from '@mui/material';
import FastSearchField from './FastSearchField';

export const StyledFastSearchField = styled(FastSearchField)(() => {
  return {
    '& .MuiAutocomplete-endAdornment': {
      top: 'auto',
    },
  };
});

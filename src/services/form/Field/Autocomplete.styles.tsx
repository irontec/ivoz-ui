
import { styled } from '@mui/material';
import Autocomplete from './Autocomplete';

const StyledAutocomplete = styled(
  Autocomplete
)(
  ({ theme }) => {
    return {
      '&.changed label': {
        color: theme.palette.info.main
      }
    }
  }
);


export default StyledAutocomplete;
import { styled } from '@mui/material';
import { TextField } from './TextField';

export const StyledTextField = styled(TextField)(({ theme }) => {
  return {
    marginTop: '0px',
    '&.changed > label': {
      color: theme.palette.info.main,
    },
  };
});

export const StyledAutocompleteTextField = styled(TextField)(({ theme }) => {
  return {
    marginTop: '0px',
    '&.changed > label': {
      color: theme.palette.info.main,
    },
    '& div.MuiInputBase-root': {
      flexWrap: 'wrap',
    },
    '& input': {
      width: 0,
      minWidth: 30,
      flexGrow: 1,
    },
  };
});

export const StyledMultilangTextField = styled(StyledTextField)(() => {
  return {
    marginTop: '10px',
    '& div.MuiFormControl-root': {
      margin: 0,
    },
    '& div.MuiInputBase-root': {
      margin: 0,
    },
    '& span.preffix': {
      paddingRight: 10,
    },
  };
});

export const StyledSearchTextField = styled(TextField)(({ theme }) => {
  return {
    width: 250,
    marginTop: '0px',
    '&.changed > label': {
      color: theme.palette.info.main,
    },
  };
});

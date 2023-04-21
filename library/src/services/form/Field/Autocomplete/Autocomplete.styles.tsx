import { styled } from '@mui/material';
import Autocomplete from './Autocomplete';


const TextFieldBaseStyles = () => {

  const computedStyle = getComputedStyle(document.documentElement);
  const colorLabel = computedStyle.getPropertyValue('--color-title').trim();
  const transition = 'all 150ms ease-in';

  return {
    
  };
};

export const StyledAutocomplete = styled(Autocomplete)(
  TextFieldBaseStyles
);

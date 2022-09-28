import {
  Accordion,
  AccordionDetails,
  AccordionSummary, Divider, List, ListItemIcon, styled
} from '@mui/material';

export const StyledAccordion = styled(Accordion)(() => {
  return {
    boxShadow: 'none',
  };
});

export const StyledAccordionSummary = styled(AccordionSummary)(() => {
  return {
    minHeight: '0px!important', 
    height: '20px', 
    padding: '0px'
  };
});

export const StyledAccordionDetails = styled(AccordionDetails)(() => {
  return {
    padding: '0px',
    '&:first-child': {
      paddingTop: 0,
      marginTop: 12,
    },
  };
});

export const StyledList = styled(List)(() => {
  return {
    margin: '10px 0px'
  };
});

export const StyledListItemIcon = styled(ListItemIcon)(() => {
  return {
    minWidth: 0, 
    marginRight: '10px', 
    paddingBottom: '4px'
  };
});

export const StyledDivider = styled(Divider)(() => {
  return {
    margin: '5px 0 15px',
  };
});


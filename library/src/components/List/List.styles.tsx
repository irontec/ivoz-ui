import { styled } from '@mui/styles';
import { Theme } from '@mui/material';
import List from './List';

export const StyledList = styled(List)(({ theme }: { theme: Theme }) => {
  return {
    '& footer': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingInlineStart: 'var(--spacing-md)',
    },
    '& .pagination': {
      flexGrow: '1',
      display: 'flex',
      justifyContent: 'flex-end',
    },
    '& .MuiTablePagination-root': {
      [theme.breakpoints.down('md')]: {
        '& .MuiTablePagination-toolbar': {
          padding: 0,
        },
        ' & .MuiTablePagination-selectLabel': {
          display: 'none',
        },
        '& .MuiInputBase-root': {
          marginInlineEnd: 'var(--spacing-sm)',
        },
        '& .MuiTablePagination-actions': {
          margin: 0,
        },
      },
    },
  };
});

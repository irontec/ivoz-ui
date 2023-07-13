import { styled } from '@mui/material';
import { TextField } from './TextField';

export const StyledTextField = styled(TextField)(() => {
  const computedStyle = getComputedStyle(document.documentElement);
  const colorLabel = computedStyle.getPropertyValue('--color-title').trim();
  const colorMultilangBg = '#f4f5f5';
  const transition = 'all 150ms ease-in';

  return {
    '&.changed': {
      '--color-border': 'var(--color-text)',
    },
    '& .helper-error': {
      marginInlineStart: 'var(--spacing-md)',
      color: 'var(--color-danger)',
    },
    '& .input-field': {
      '--padding-start': 'var(--spacing-md)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
      transition: `var(${transition})`,
      padding: 0,
      minHeight: '40px',
      overflow: 'hidden',

      '& fieldset': {
        border: 'transparent',
      },

      '& input, & textarea': {
        fontSize: 'var(--font-size-text)',
        color: 'var(--color-text)',
        paddingBlock: '10px',
        paddingInlineStart: 'var(--spacing-md)',
      },

      '& textarea': {
        minHeight: '75px',
        maxHeight: '400px',
        overflow: 'auto !important',
        paddingBottom: '5px',
      },

      '& .preffix': {
        backgroundColor: `var(${colorMultilangBg})`,
        borderRight: '1px solid var(--color-border)',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginInlineEnd: 'var(--spacing-md)',
        padding: 0,
        width: '72px',
        color: 'var(--color-text)',
      },

      '&.Mui-disabled': {
        backgroundColor: '#eeeff0',
      },

      '&.Mui-error': {
        '--color-border': 'var(--color-danger)',
      },

      '&:has(.preffix)': {
        '--padding-start': 0,
      },

      '&.MuiInputBase-adornedStart': {
        paddingInlineStart: 'var(--padding-start)',

        '& input': {
          paddingInlineStart: 0,
        },
      },

      '&.MuiInputBase-adornedEnd': {
        paddingInlineEnd: 'var(--spacing-md)',
      },
    },
    '& label': {
      color: `var(${colorLabel})`,
      fontSize: 'var(--font-size-input_label)',
      transition: `var(${transition})`,
      marginBottom: 'var(--spacing-xs)',
    },
    '& .help-tooltip': {
      color: '#b2b3b6',
    },
  };
});

export const StyledAutocompleteTextField = styled(StyledTextField)(() => {
  return {
    '& .input-field': {
      paddingLeft: '9px',
    },
  };
});

export const StyledMultilangTextField = styled(StyledTextField)(() => {
  return {
    marginTop: 'var(--spacing-xs)',
    '&:not(:first-of-type)': {
      marginTop: 'var(--spacing-md)',
    },
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

export const StyledSearchTextField = styled(StyledTextField)(({ theme }) => {
  return {
    width: 250,
    marginTop: '0px',
    '&.changed > label': {
      color: theme.palette.info.main,
    },
  };
});

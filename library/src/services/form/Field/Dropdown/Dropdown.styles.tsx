import { styled } from '@mui/material';
import Dropdown from './Dropdown';

export const StyledDropdown = styled(Dropdown)(
  () => {

    const computedStyle = getComputedStyle(document.documentElement);
    const colorLabel = computedStyle.getPropertyValue('--color-title').trim();
    const transition = 'all 150ms ease-in';

    return {
      '& .changed': {
        '--color-border': 'var(--color-text)',
      },
      '& .helper-error': {
        marginInlineStart: 'var(--spacing-md)',
        color: 'var(--color-danger)',
      },
      '& .select': {
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        transition: `${transition}`,

        '& .MuiSelect-select': {
          fontSize: 'var(--font-size-text)',
          color: 'var(--color-text)',
          paddingBlock: '10px',
          paddingInlineStart: 'var(--spacing-md)',
          maxHeight: '20px',
        },

        '& fieldset': {
          border: 'transparent',
        },

        '&.Mui-disabled': {
          backgroundColor: '#eeeff0',
        },

        '&.Mui-error': {
          '--color-border': 'var(--color-danger)',
        }
      },
      '& label': {
        color: `${colorLabel}`,
        fontSize: 'var(--font-size-input_label)',
        transition: `${transition}`,
        marginBottom: 'var(--spacing-xs)',
      },

      '& .help-tooltip': {
        color: '#b2b3b6',
      }
    };
  }
);

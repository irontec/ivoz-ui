import { styled } from '@mui/styles';
import ContentCardBody from './ContentCardBody';

export const StyledContentCardBody = styled(ContentCardBody)(
  () => {

    return {
      paddingBlock: 'var(--spacing-md)',
      '&:not(:last-child)': {
        borderBottom: '1px solid var(--color-border)',
      },
      '& .MuiBox-root': {
        display: 'flex',
        alignItems: 'center',
        '& p': {
          flexGrow: 1,
          color: 'var(--color-title)',
          width: '100%',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontSize: 'var(--font-size-text)',
          paddingBlock: 'var(--spacing-xs)',
          '& span': {
            color: 'var(--color-text)',
            marginInlineEnd: 'var(--spacing-xs)',
          },
        },
        '& .MuiCheckbox-root': {
          padding: 0,
          marginInlineEnd: 'var(--spacing-md)',
        }
      },
      '& .MuiCollapse-vertical': {
        '& .card-row, & .MuiBox-root': {
          marginInline: 'var(--spacing-xxl) var(--spacing-md)',
        }
      },
      '& .actions': {
        display: 'flex',
        gap: 'var(--spacing-sm)',
        flexWrap: 'wrap',
        paddingBlock: 'var(--spacing-sm)',
      }
      
    }
  }
);

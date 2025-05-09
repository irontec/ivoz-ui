import styled from '@emotion/styled';

export const StyledPdfButton = styled.button(() => {
  return {
    backgroundColor: 'transparent',
    border: '0',
    color: 'var(--color-text)',
    fontSize: '1.3em',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'flex-end',
    '&:hover': {
      color: 'var(--color-primary)',
    },
    '&:disabled': {
      color: '#d1d1d3',
      cursor: 'initial',
    },
  };
});

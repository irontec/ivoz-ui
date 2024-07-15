import styled from '@emotion/styled';
import DownloadIcon from '@mui/icons-material/Download';

export const StyledPdfIcon = styled(DownloadIcon)(() => {
  return {
    color: '#5b5b5b',
    verticalAlign: 'bottom',
    fontSize: '1.3em',
    cursor: 'pointer',
  };
});

export const StyledFileName = styled.span(() => {
  return {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '60px',
    display: 'inline-flex',
  };
});

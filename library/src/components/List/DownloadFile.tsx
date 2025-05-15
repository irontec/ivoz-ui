import { useStoreActions } from 'store';
import { saveAs } from 'file-saver';
import { Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { StyledPdfButton } from './DownloadFile.styles';

export interface DownloadFileProps {
  row: Record<string, any>;
  path: string;
  fileType: string;
}

export default function DownloadFile(props: DownloadFileProps): JSX.Element {
  const { row, path, fileType } = props;

  const apiDownload = useStoreActions((actions) => {
    return actions.api.download;
  });

  const download = () => {
    apiDownload({
      path: `${path}/${row.id}/${fileType}`,
      params: {},
      successCallback: async (data: any, headers: any) => {
        const fileName = headers['content-disposition']
          ?.split('filename=')
          ?.pop();

        saveAs(data, fileName || 'download');
      },
    });
  };

  const noFile = !row[fileType].baseName;

  return (
    <Tooltip title={row[fileType].baseName} placement='bottom' arrow>
      <StyledPdfButton disabled={noFile} onClick={download}>
        <DownloadIcon />
      </StyledPdfButton>
    </Tooltip>
  );
}

import { useStoreActions } from 'store';
import { StyledPdfIcon, StyledFileName } from './DownloadFile.styles';
import { saveAs } from 'file-saver';

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

  return (
    <>
      <StyledPdfIcon onClick={download} />
      <StyledFileName>{row[fileType].baseName}</StyledFileName>
    </>
  );
}

import { saveAs } from 'file-saver';
import {
  ChangeEvent,
  DragEvent,
  MouseEvent,
  useCallback,
  useState,
} from 'react';
import { useStoreActions } from '../../../../store';
import withCustomComponentWrapper, {
  PropertyCustomFunctionComponentProps,
} from '../CustomComponentWrapper';
import RegularFileUploader from './Variant/RegularFileUploader';
import { ImageFileUploader } from './Variant/ImageFileUploader';
import { AudioFileUploader } from './Variant/AudioFileUploader';

export interface FileProps {
  file?: File;
  baseName?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface ChangeEventValues {
  name: string;
  value: FileProps;
}

interface FileUploaderProps<T> extends PropertyCustomFunctionComponentProps<T> {
  downloadPath: string | null;
  accept?: string;
}

type FileUploaderPropsType = FileUploaderProps<{ [k: string]: FileProps }>;

const FileUploader: React.FunctionComponent<FileUploaderPropsType> = (
  props
): JSX.Element | null => {
  const {
    _columnName,
    accept,
    values,
    downloadPath,
    changeHandler,
  } = props;

  const fileValue = values[_columnName] as FileProps;
  const { mimeType } = fileValue;

  if (!downloadPath) {
    console.error('Empty download path');
    return null;
  }

  const apiDownload = useStoreActions((actions) => {
    return actions.api.download;
  });

  const [hover, setHover] = useState<boolean>(false);
  const [hoverCount, setHoverCount] = useState<number>(0);
  const [downloading, setDownloading] = useState<boolean>(false);

  const handleDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setHover(hoverCount >= 0);
      setHoverCount(hoverCount + 1);
    },
    [hoverCount]
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragLeave = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setHover(hoverCount > 1);
      setHoverCount(hoverCount - 1);
    },
    [hoverCount]
  );

  const handleDownload = useCallback(
    async (e: MouseEvent) => {
      if (downloading) {
        return;
      }

      setDownloading(true);

      e.preventDefault();
      e.stopPropagation();

      try {
        await apiDownload({
          path: downloadPath as string,
          params: {},
          successCallback: async (data: any, headers: any) => {
            const fileName = headers['content-disposition']
              .split('filename=')
              .pop();
            saveAs(data, fileName);
          },
        });
      } finally {
        setDownloading(false);
      }
    },
    [downloading, downloadPath, apiDownload]
  );

  type fileContainerEvent = Pick<ChangeEvent<{ files: FileList }>, 'target'>;

  const onChange = useCallback<{ (event: fileContainerEvent): void }>(
    (event: fileContainerEvent) => {
      const files = event.target.files || [];
      if (!files.length) {
        return;
      }

      const value = {
        ...fileValue,
        ...{ file: files[0] },
      };

      const changeEvent = {
        target: {
          name: _columnName,
          value: value,
        },
      } as ChangeEvent<ChangeEventValues>;
      changeHandler(changeEvent);
    },
    [changeHandler, _columnName, fileValue]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setHover(false);

      const event = {
        target: {
          files: e.dataTransfer.files,
        },
      };

      onChange(event as fileContainerEvent);
    },
    [onChange]
  );

  const audio = mimeType?.includes('audio/') || accept?.includes('audio/');
  const image = mimeType?.includes('image/') || accept?.includes('image/');
  const regular = !audio && !image;

  return (
    <>
      {regular && (
        <RegularFileUploader
          {...props}
          downloadPath={downloadPath}
          hover={hover}
          handleDrop={handleDrop}
          handleDragEnter={handleDragEnter}
          handleDragLeave={handleDragLeave}
          handleDragOver={handleDragOver}
          handleDownload={handleDownload}
        />
      )}

      {image && (
        <ImageFileUploader
          {...props}
          downloadPath={downloadPath}
          hover={hover}
          handleDrop={handleDrop}
          handleDragEnter={handleDragEnter}
          handleDragLeave={handleDragLeave}
          handleDragOver={handleDragOver}
          handleDownload={handleDownload}
        />
      )}

      {audio && (
        <AudioFileUploader
          {...props}
          downloadPath={downloadPath}
          hover={hover}
          handleDrop={handleDrop}
          handleDragEnter={handleDragEnter}
          handleDragLeave={handleDragLeave}
          handleDragOver={handleDragOver}
          handleDownload={handleDownload}
        />
      )}
    </>
  );
};

export default withCustomComponentWrapper<
  FileUploaderPropsType,
  FileUploaderProps<FileUploaderPropsType>
>(FileUploader);

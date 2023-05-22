import BackupIcon from '@mui/icons-material/Backup';
import { Button } from '@mui/material';
import {
  ChangeEvent,
  DragEvent,
  MouseEvent,
} from 'react';
import {
  PropertyCustomFunctionComponentProps,
} from '../../CustomComponentWrapper';
import {
  StyledDownloadingIcon,
  StyledFileNameContainer,
  StyledFileUploaderContainer,
  StyledUploadButtonContainer,
  StyledUploadButtonLabel,
} from '../FileUploader.styles';
import { ChangeEventValues, FileProps } from '../FileUploader';

interface FileUploaderProps<T> extends PropertyCustomFunctionComponentProps<T> {
  downloadPath: string;
  accept?: string;
  hover: boolean,
  handleDownload: (e: MouseEvent) => Promise<void>,
}

type FileUploaderPropsType = FileUploaderProps<{ [k: string]: FileProps }>;
export type FileUploaderType = React.FunctionComponent<FileUploaderPropsType>;

const RegularFileUploader: FileUploaderType = (
  props
): JSX.Element => {
  const {
    _columnName,
    accept,
    values,
    disabled,
    hover,
    handleDownload,
    changeHandler,
    onBlur,
  } = props;

  const fileValue = values[_columnName] as FileProps;
  const id = `${_columnName}-file-upload`;
  const fileName = fileValue?.file ? fileValue.file?.name : fileValue?.baseName;

  const fileSize = fileValue?.file ? fileValue.file?.size : fileValue?.fileSize;
  const fileSizeMb = Math.round(((fileSize || 0) / 1024 / 1024) * 10) / 10;

  return (
    <>
      <StyledFileUploaderContainer
        hover={hover}
      >
        <input
          style={{ display: 'none' }}
          id={id}
          type='file'
          accept={accept}
          onChange={(event) => {
            const files = event.target.files || [];
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
            onBlur(changeEvent as any);
          }}
        />
        {!disabled && (
          <StyledUploadButtonContainer>
            <StyledUploadButtonLabel htmlFor={id}>
              <Button variant='contained' component='span'>
                <BackupIcon />
              </Button>
            </StyledUploadButtonLabel>
          </StyledUploadButtonContainer>
        )}
        {fileName && (
          <StyledFileNameContainer className={disabled ? 'disabled' : ''}>
            {values.id && <StyledDownloadingIcon onClick={handleDownload} />}
            {fileName} ({fileSizeMb}MB)
          </StyledFileNameContainer>
        )}
      </StyledFileUploaderContainer>
    </>
  );
};

export default RegularFileUploader;
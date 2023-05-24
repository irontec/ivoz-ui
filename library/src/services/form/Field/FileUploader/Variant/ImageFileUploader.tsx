import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ChangeEvent } from 'react';
import _ from '../../../../translations/translate';
import { ChangeEventValues, FileProps } from '../FileUploader';
import {
  StyledFileUploaderContainer,
  StyledImageContainer,
  StyledTextContainer,
  StyledUploadButtonLabel,
} from '../FileUploader.styles';
import { FileUploaderType } from './RegularFileUploader';

export const ImageFileUploader: FileUploaderType = (
  props
): JSX.Element | null => {
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
      <StyledFileUploaderContainer hover={hover}>
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

        {fileName && (
          <StyledImageContainer className={disabled ? 'disabled' : ''}>
            {values.id && <AccountCircleIcon onClick={handleDownload} />}
          </StyledImageContainer>
        )}

        <StyledTextContainer>
          <span>JPG, JPEG, PNG format</span>
          <span>Maximum 500KB</span>
          {!disabled && (
            <StyledUploadButtonLabel htmlFor={id}>
              {_('Upload image')}
            </StyledUploadButtonLabel>
          )}

          {fileName && (
            <span>
              {fileName} ({fileSizeMb}MB)
            </span>
          )}
        </StyledTextContainer>
      </StyledFileUploaderContainer>

      <div className='uploader-backdrop'>Image</div>
    </>
  );
};

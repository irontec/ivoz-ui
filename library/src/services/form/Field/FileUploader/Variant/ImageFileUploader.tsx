import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ChangeEvent, useEffect, useState } from 'react';
import _ from '../../../../translations/translate';
import { ChangeEventValues, FileProps } from '../FileUploader';
import {
  StyledFileUploaderContainer,
  StyledImageContainer,
  StyledImagePreview,
  StyledTextContainer,
  StyledUploadButtonLabel,
} from '../FileUploader.styles';
import { FileUploaderType } from './RegularFileUploader';
import { useStoreActions } from '../../../../../store';

export const ImageFileUploader: FileUploaderType = (
  props
): JSX.Element | null => {
  const {
    _columnName,
    accept,
    values,
    disabled,
    handleDownload,
    changeHandler,
    onBlur,
    downloadPath,
  } = props;

  const fileValue = values[_columnName] as FileProps;
  const id = `${_columnName}-file-upload`;
  const fileName = fileValue?.file ? fileValue.file?.name : fileValue?.baseName;

  const fileSize = fileValue?.file ? fileValue.file?.size : fileValue?.fileSize;
  const fileSizeMb = Math.round(((fileSize || 0) / 1024 / 1024) * 10) / 10;

  const apiDownload = useStoreActions((actions) => {
    return actions.api.download;
  });
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    setImageSrc(null);

    if (fileValue.file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
      };
      reader.readAsDataURL(fileValue.file);

      return;
    }

    apiDownload({
      path: downloadPath as string,
      params: {},
      successCallback: async (
        data: Record<string, any> | Array<Record<string, any>> | Blob
      ) => {
        setImageSrc(URL.createObjectURL(data as Blob));
      },
    });
  }, [fileValue.file]);

  return (
    <>
      <StyledFileUploaderContainer>
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
            {imageSrc ? (
              <StyledImagePreview src={imageSrc} onClick={handleDownload} />
            ) : (
              values.id && <AccountCircleIcon onClick={handleDownload} />
            )}
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

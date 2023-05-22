import { ChangeEvent, useEffect, useState } from 'react';
import ReactAudioPlayerSrc from 'react-audio-player';
import { useStoreActions } from 'store';
import { ChangeEventValues, FileProps } from '../FileUploader';
import {
  StyledDownloadingIcon,
  StyledFileNameContainer,
  StyledFileUploaderContainer,
  StyledUploadButtonContainer,
  StyledUploadButtonLabel
} from '../FileUploader.styles';
import { FileUploaderType } from './RegularFileUploader';
import { Button } from '@mui/material';
import { Backup } from '@mui/icons-material';

type PlayerType = typeof ReactAudioPlayerSrc;
// see https://github.com/justinmc/react-audio-player/issues/164
const ReactAudioPlayer: PlayerType =
  process.env.NODE_ENV === 'production'
    ? (ReactAudioPlayerSrc as any).default
    : ReactAudioPlayerSrc;

export const AudioFileUploader: FileUploaderType = (props): JSX.Element | null => {

  const {
    _columnName,
    accept,
    values,
    disabled,
    downloadPath,
    hover,
    handleDownload,
    changeHandler,
    onBlur,
  } = props;

  const [audioSrc, setAudioSrc] = useState<string | undefined>(undefined);
  const downloadAction = useStoreActions((actions) => actions.api.download);

  useEffect(() => {
    if (audioSrc) {
      return;
    }

    downloadAction({
      path: downloadPath,
      params: {},
      handleErrors: false,
      successCallback: async (data) => {
        const objectUrl = URL.createObjectURL(data as Blob);
        setAudioSrc(objectUrl);
      },
    }).catch((error: { statusText: string; status: number }) => {
      console.error(error);
    });
  }, []);

  if (!audioSrc) {
    return null;
  }

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
                <Backup />
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
      <ReactAudioPlayer src={audioSrc} controls={true} />
    </>
  );
};

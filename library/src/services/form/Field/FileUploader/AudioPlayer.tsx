import { useState } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { useStoreActions } from 'store';
import { FileProps } from './FileUploader';

interface AudioPlayerProps {
  downloadPath?: string | null;
  metadata?: FileProps;
}

export const AudioPlayer = (props: AudioPlayerProps): JSX.Element | null => {
  const { downloadPath, metadata = {} } = props;
  const { mimeType = '' } = metadata;
  const [audioSrc, setAudioSrc] = useState<string | undefined>(undefined);
  const downloadAction = useStoreActions((actions) => actions.api.download);

  if (!downloadPath) {
    return null;
  }

  if (!mimeType.includes('audio/')) {
    return null;
  }

  if (!audioSrc) {
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
  }

  return (
    <ReactAudioPlayer src={audioSrc} controls={true} />
  );
};

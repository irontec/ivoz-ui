import { Component, useEffect, useState } from 'react';
import ReactAudioPlayerSrc from 'react-audio-player';
import { useStoreActions } from 'store';
import { FileProps } from './FileUploader';

interface AudioPlayerProps {
  downloadPath?: string | null;
  metadata?: FileProps;
}

type PlayerType = typeof ReactAudioPlayerSrc;
// see https://github.com/justinmc/react-audio-player/issues/164
const ReactAudioPlayer: PlayerType =
  process.env.NODE_ENV === 'production'
    ? (ReactAudioPlayerSrc as any).default
    : ReactAudioPlayerSrc;

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

  return <ReactAudioPlayer src={audioSrc} controls={true} />;
};

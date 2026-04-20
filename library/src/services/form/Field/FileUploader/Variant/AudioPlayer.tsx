import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
import { Box, IconButton, Slider, Typography } from '@mui/material';
import { useRef, useState, useEffect, useCallback } from 'react';

interface AudioPlayerProps {
  src: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioPlayer({ src }: AudioPlayerProps): JSX.Element {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showVolume, setShowVolume] = useState(false);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const seek = (_: Event, value: number | number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const t = value as number;
    audio.currentTime = t;
    setCurrentTime(t);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        bgcolor: 'grey.100',
        borderRadius: '24px',
        px: 1,
        py: 0.5,
      }}
    >
      <audio ref={audioRef} src={src} preload='metadata' />
      <IconButton size='small' onClick={toggle}>
        {playing ? (
          <PauseRoundedIcon fontSize='small' />
        ) : (
          <PlayArrowRoundedIcon fontSize='small' />
        )}
      </IconButton>
      <Typography variant='caption' sx={{ whiteSpace: 'nowrap', minWidth: 70 }}>
        {formatTime(currentTime)} / {formatTime(duration || 0)}
      </Typography>
      <Slider
        size='small'
        min={0}
        max={duration || 1}
        value={currentTime}
        onChange={seek}
        sx={{ mx: 1, flex: 1, minWidth: 60 }}
      />
      <Box
        sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
      >
        <IconButton
          size='small'
          onClick={() => {
            const next = !muted;
            if (audioRef.current) {
              audioRef.current.muted = next;
            }
            setMuted(next);
          }}
        >
          {muted || volume === 0 ? (
            <VolumeOffRoundedIcon fontSize='small' />
          ) : (
            <VolumeUpRoundedIcon fontSize='small' />
          )}
        </IconButton>
        {showVolume && (
          <Box
            sx={{
              position: 'absolute',
              left: '100%',
              display: 'flex',
              alignItems: 'center',
              bgcolor: 'grey.100',
              borderRadius: '12px',
              px: 1,
              width: 80,
            }}
          >
            <Slider
              size='small'
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(_, v) => {
                const val = v as number;
                setVolume(val);
                setMuted(val === 0);
                if (audioRef.current) {
                  audioRef.current.volume = val;
                  audioRef.current.muted = val === 0;
                }
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

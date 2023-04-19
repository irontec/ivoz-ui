import { Fade } from '@mui/material';
import { useStoreState } from 'store';
import { StyledLinearProgress } from './Loading.styles';

type LoadingProps = {
  transitionDelay?: string;
};

type LoadingType = (props: LoadingProps) => JSX.Element;

export const Loading: LoadingType = (props) => {
  const loading = useStoreState((state) => state.api.loading);
  const { transitionDelay = '800ms' } = props;

  return (
    <Fade
      in={loading}
      style={{
        transitionDelay,
      }}
      unmountOnExit
    >
      <StyledLinearProgress />
    </Fade>
  );
};

export default Loading;

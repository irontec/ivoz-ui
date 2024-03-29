import { styled } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Message from './Message';

export default function InfoMessage(props: { message: string }) {
  const { message } = props;
  return <StyledInfoMessage message={message} />;
}

const StyledInfoMessage = styled((props: { message: string }) => {
  const { message } = props;
  return <Message message={message} Icon={InfoIcon} />;
})(() => {
  return {
    backgroundColor: '#616161',
    color: 'white',
  };
});

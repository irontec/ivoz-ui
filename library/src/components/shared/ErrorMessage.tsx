import { styled } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import Message from './Message';

export default function ErrorMessage(props: { message: string }): JSX.Element {
  const { message } = props;
  return <StyledErrorMessage message={message} />;
}

const StyledErrorMessage = styled((props: { message: string }) => {
  const { message } = props;
  return <Message message={message} Icon={ErrorIcon} />;
})(({ theme }) => {
  return {
    backgroundColor: theme.palette.error.dark,
    color: 'white',
  };
});

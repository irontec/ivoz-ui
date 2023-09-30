import ErrorIcon from '@mui/icons-material/Error';

interface ErrorMessage {
  message?: string;
}

const ErrorMessageComponent = (props: ErrorMessage) => {
  const { message } = props;
  return (
    <span>
      <ErrorIcon
        sx={{
          verticalAlign: 'bottom',
        }}
      />
      {message ?? 'There was a problem'}
    </span>
  );
};

export default ErrorMessageComponent;

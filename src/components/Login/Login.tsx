import { useFormik } from 'formik';
import { Container } from '@mui/material';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useStoreActions, useStoreState } from 'store';
import Title from '../../components/Title';
import ErrorMessage from '../..//components/shared/ErrorMessage';
import { useFormikType } from '../../services/form/types';
import {
  StyledLoginContainer,
  StyledAvatar,
  StyledForm,
  StyledSubmitButton,
} from './Login.styles';
import { EntityValidator } from '../../entities/EntityInterface';

type marshallerValueType = {
  username: string;
  password: string;
};

interface LoginProps {
  unauthorizedCustomErrorMsg?: string;
  validator?: EntityValidator;
  marshaller?: (values: marshallerValueType) => Record<string, string>;
}

export default function Login(props: LoginProps): JSX.Element | null {
  const { validator, marshaller, unauthorizedCustomErrorMsg } = props;

  const useRefreshToken = useStoreActions(
    (actions) => actions.auth.useRefreshToken
  );
  const onSubmit = useStoreActions((actions) => actions.auth.submit);
  const refreshToken = useStoreState((state) => state.auth.refreshToken);
  const apiErrorMsg = useStoreState((state) => state.api.errorMsg);
  const apiErrorCode = useStoreState((state) => state.api.errorCode);

  if (refreshToken) {
    useRefreshToken();
    return null;
  }

  const submit = async (values: any) => {
    if (marshaller) {
      values = marshaller(values);
    }

    await onSubmit(values);
  };

  const formik: useFormikType = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validator,
    onSubmit: submit,
  });

  const errorMsg =
    apiErrorCode === 401 && unauthorizedCustomErrorMsg
      ? unauthorizedCustomErrorMsg
      : apiErrorMsg;

  return (
    <Container component='main' maxWidth='xs'>
      <StyledLoginContainer>
        <StyledForm onSubmit={formik.handleSubmit as React.FormEventHandler}>
          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>
          <Title>Login</Title>
          <TextField
            name='username'
            type='text'
            label='Username'
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            margin='normal'
            required
            fullWidth
          />
          <TextField
            name='password'
            type='password'
            label='Password'
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            margin='normal'
            required
            fullWidth
          />
          <StyledSubmitButton variant='contained'>Sign In</StyledSubmitButton>
          {apiErrorMsg && <ErrorMessage message={errorMsg || ''} />}
        </StyledForm>
      </StyledLoginContainer>
    </Container>
  );
}

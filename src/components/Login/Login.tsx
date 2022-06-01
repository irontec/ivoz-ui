import { useState } from 'react';
import { useFormik } from 'formik';
import { Container } from '@mui/material';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useStoreActions } from 'store';
import Title from '../../components/Title';
import ErrorMessage from '../..//components/shared/ErrorMessage';
import { useFormikType } from '../../services/form/types';
import { StyledLoginContainer, StyledAvatar, StyledForm, StyledSubmitButton } from './Login.styles';
import { EntityValidator } from '../../entities/EntityInterface';

type onSubmitValueType = {
  username: string,
  password:string,
};

type onSubmitResponseType = {
  data?: {
    token: string,
    refreshToken: string,
  }
};

interface LoginProps {
  validator?: EntityValidator
  onSubmit: (values: onSubmitValueType) => Promise<onSubmitResponseType>,
}

export default function Login(props: LoginProps): JSX.Element {

  const [error, setError] = useState<string | null>(null);

  const setToken = useStoreActions((actions) => actions.auth.setToken);
  const setRefreshToken = useStoreActions((actions) => actions.auth.setRefreshToken);

  const { onSubmit } = props;

  const submit = async (values: any) => {

    try {

      const response = await onSubmit(values);

      if (response.data && response.data.token) {
        setToken(response.data.token);
        setRefreshToken(response.data.refreshToken);
        setError(null);
        return;
      }

      const error = {
        error: 'Token not found',
        toString: function () { return this.error }
      };

      throw error;

    } catch (error: any) {
      console.error(error);
      setError(error?.data?.message);
    }
  };

  const formik: useFormikType = useFormik({
    initialValues: {
      'username': '',
      'password': ''
    },
    validationSchema: props.validator,
    onSubmit: submit,
  });

  return (
    <Container component="main" maxWidth="xs">
      <StyledLoginContainer>
        <StyledForm onSubmit={formik.handleSubmit}>
          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>
          <Title>
            Login
          </Title>
          <TextField
            name="username"
            type="text"
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            margin="normal"
            required
            fullWidth
          />
          <TextField
            name="password"
            type="password"
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            margin="normal"
            required
            fullWidth
          />
          <StyledSubmitButton variant="contained">
            Sign In
          </StyledSubmitButton>
          {error && <ErrorMessage message={error} />}
        </StyledForm>
      </StyledLoginContainer>
    </Container>
  )
}
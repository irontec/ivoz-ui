import { Box, Container } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { useStoreActions, useStoreState } from 'store';
import ErrorMessage from '../..//components/shared/ErrorMessage';
import Title from '../../components/Title';
import { EntityValidator } from '../../entities/EntityInterface';
import { useFormikType } from '../../services/form/types';
import { StyledForm } from './Login.styles';

import { SolidButton } from '../../components/shared/Button/Button.styles';
import { TextField } from '../../services/form/Field';
import _ from '../../services/translations/translate';

type marshallerValueType = {
  username: string;
  password: string;
};

export interface LoginProps {
  unauthorizedCustomErrorMsg?: string;
  validator?: EntityValidator;
  marshaller?: (values: marshallerValueType) => Record<string, string>;
  className?: string;
}

export default function Login(props: LoginProps): JSX.Element | null {
  const { validator, marshaller, unauthorizedCustomErrorMsg, className } =
    props;

  const useRefreshToken = useStoreActions(
    (actions) => actions.auth.useRefreshToken
  );

  const logo = useStoreState((state) => state.theme.logo);
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
    <Container className={className} component='main'>
      <Box className='logo-container'>
        <img src={logo || './logo.svg'} className='logo' />
      </Box>

      <Box className='form-container'>
        <StyledForm
          onSubmit={formik.handleSubmit as React.FormEventHandler}
          className='card'
        >
          <Title>{_('Welcome back!')}</Title>
          <TextField
            name='username'
            type='text'
            label={_('Username')}
            placeholder='Your username'
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            hasChanged={false}
            inputProps={{}}
            InputProps={{}}
            errorMsg=''
            helperText={
              formik.touched.username &&
              (formik.errors.username as React.ReactNode)
            }
          />
          <TextField
            name='password'
            type='password'
            label={_('Password')}
            placeholder='Typer your password'
            errorMsg=''
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            hasChanged={false}
            inputProps={{}}
            InputProps={{}}
            helperText={
              formik.touched.password &&
              (formik.errors.password as React.ReactNode)
            }
          />

          <SolidButton type='submit' variant='contained'>
            {_('Sign In')}
          </SolidButton>
          {apiErrorMsg && <ErrorMessage message={errorMsg || ''} />}
        </StyledForm>
      </Box>
    </Container>
  );
}

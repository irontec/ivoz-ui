import { StoreContainer } from '@irontec/ivoz-ui';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { CssBaseline, LinearProgress } from '@mui/material';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import store, { useStoreActions, useStoreState } from 'store';

import { StyledAppApiLoading, StyledAppFlexDiv } from './App.styles';
import AppRoutes from './router/AppRoutes';
import { languagesList } from './translations/languages';

export default function App(): JSX.Element {
  StoreContainer.store = store;
  const setLanguages = useStoreActions((actions) => actions.i18n.setLanguages);
  setLanguages(languagesList);

  const apiSpecStore = useStoreActions((actions) => {
    return actions.spec;
  });
  const authStore = useStoreActions((actions) => actions.auth);
  const token = useStoreState((actions) => actions.auth.token);

  useEffect(() => {
    apiSpecStore.setSessionStoragePrefix('demo-');
    apiSpecStore.init();
    authStore.setSessionStoragePrefix('demo-');
    authStore.init();
  }, [apiSpecStore, authStore, token]);

  const apiSpec = useStoreState((state) => state.spec.spec);
  const baseUrl = process.env.BASE_URL;

  if (!apiSpec || Object.keys(apiSpec).length === 0) {
    return (
      <StyledAppApiLoading>
        <LinearProgress />
        <br />
        Loading API definition...
      </StyledAppApiLoading>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <CssBaseline />
      <StyledAppFlexDiv>
        <BrowserRouter basename={baseUrl}>
          <AppRoutes apiSpec={apiSpec} />
        </BrowserRouter>
      </StyledAppFlexDiv>
    </LocalizationProvider>
  );
}

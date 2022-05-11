import axios, { CancelToken, CancelTokenSource } from 'axios';
import { action, Action, Actions, Computed, computed, Thunk, thunk } from 'easy-peasy';
import ApiClient, { ApiError } from '../services/api/ApiClient';
import { KeyValList } from '../services/api/ParsedApiSpecInterface';
import { EntityValues } from '../services/entity/EntityService';

const handleApiErrors = (
  error: ApiError | null, getStoreActions: () => Actions<any>
): string | null => {

  if (!error) {
    throw error;
  }

  if ([401].includes(error?.status || -1)) {
    const actions: any = getStoreActions();
    actions.auth.resetToken();
  }

  throw error.statusText;
};

const api: ApiStore = {
  errorMsg: null,
  ongoingRequests: 0,
  reqCancelTokenSourceFactory: () => {
    return axios.CancelToken.source();
  },
  loading: computed<ApiState, boolean>((state) => { return state.ongoingRequests > 0 }),
  setErrorMsg: action<ApiState, string>((state, errorMsg) => {
    state.errorMsg = errorMsg;
  }),
  sumRequest: action((state) => {
    state.ongoingRequests += 1;
  }),
  restRequest: action((state) => {
    state.ongoingRequests = Math.max(
      (state.ongoingRequests - 1),
      0
    );
  }),
  ////////////////////////////////////////
  // GET
  ////////////////////////////////////////
  get: thunk(async (actions: any, payload: apiGetRequestParams, { getStoreActions }) => {

    actions.sumRequest();
    actions.setErrorMsg(null);
    const { path, params, successCallback, cancelToken, silenceErrors } = payload;

    try {
      const resp = await ApiClient.get(
        path,
        params,
        successCallback,
        cancelToken
      );

      return resp;

    } catch (error: any) {

      if (!silenceErrors) {
        actions.setErrorMsg(error?.statusText);
      }
      handleApiErrors(error as ApiError, getStoreActions);

    } finally {
      actions.restRequest();
    }
  }),
  download: thunk(async (actions: any, payload: apiGetRequestParams, { getStoreActions }) => {

    const { path, params, successCallback, cancelToken, silenceErrors } = payload;
    actions.sumRequest();
    actions.setErrorMsg(null);

    try {
      return await ApiClient.download(
        path,
        params,
        successCallback,
        cancelToken
      );
    } catch (error: any) {
      if (!silenceErrors) {
        actions.setErrorMsg(error?.statusText);
      }
      handleApiErrors(error as ApiError, getStoreActions);

    } finally {
      actions.restRequest();
    }
  }),

  ////////////////////////////////////////
  // POST
  ////////////////////////////////////////
  post: thunk(async (actions: any, payload: apiPostRequestParams, { getStoreActions }) => {

    const { path, values, contentType, cancelToken, silenceErrors } = payload;
    actions.sumRequest();
    actions.setErrorMsg(null);

    try {
      return await ApiClient.post(
        path,
        values,
        contentType,
        cancelToken
      );
    } catch (error: any) {
      if (!silenceErrors) {
        const msg = error?.data?.detail || error?.statusText;
        actions.setErrorMsg(msg);
      }
      handleApiErrors(error as ApiError, getStoreActions);

    } finally {
      actions.restRequest();
    }
  }),
  ////////////////////////////////////////
  // PUT
  ////////////////////////////////////////
  put: thunk(async (actions: any, payload: apiPutRequestParams, { getStoreActions }) => {

    const { path, values, cancelToken, silenceErrors } = payload;
    actions.sumRequest();
    actions.setErrorMsg(null);

    try {
      return await ApiClient.put(
        path,
        values,
        cancelToken
      );
    } catch (error: any) {
      if (!silenceErrors) {
        const msg = error?.data?.detail || error?.statusText;
        actions.setErrorMsg(msg);
      }
      handleApiErrors(error as ApiError, getStoreActions);

    } finally {
      actions.restRequest();
    }
  }),
  ////////////////////////////////////////
  // DELETE
  ////////////////////////////////////////
  delete: thunk(async (actions: any, payload: apiDeleteRequestParams, { getStoreActions }) => {

    const { path, cancelToken, silenceErrors } = payload;
    actions.sumRequest();
    actions.setErrorMsg(null);

    try {
      return await ApiClient.delete(
        path,
        cancelToken
      );
    } catch (error: any) {
      if (!silenceErrors) {
        const msg = error?.data?.detail || error?.statusText;
        actions.setErrorMsg(msg);
      }
      handleApiErrors(error as ApiError, getStoreActions);

    } finally {
      actions.restRequest();
    }
  }),
};

export default api;

interface requestParms {
  path: string,
  cancelToken?: CancelToken,
  silenceErrors?: boolean
}

interface apiGetRequestParams extends requestParms {
  params: KeyValList,
  successCallback: (data: Record<string, any>, headers: Record<string, any>) => Promise<any>,
}

interface apiPostRequestParams extends requestParms {
  values: FormData | EntityValues,
  contentType: string,
}

interface apiPutRequestParams extends requestParms {
  values: FormData | EntityValues,
}

interface apiDeleteRequestParams extends requestParms {
  successCallback: () => Promise<any>,
}

interface ApiState {
  errorMsg: string | null,
  ongoingRequests: number,
  loading: Computed<ApiState, boolean>,
  reqCancelTokenSourceFactory: () => CancelTokenSource
}

interface ApiActions {
  setErrorMsg: Action<ApiState, string>
  sumRequest: Action<ApiState>,
  restRequest: Action<ApiState>,
  get: Thunk<() => Promise<void>, apiGetRequestParams>
  download: Thunk<() => Promise<void>, apiGetRequestParams>
  post: Thunk<() => Promise<void>, apiPostRequestParams>
  put: Thunk<() => Promise<void>, apiPutRequestParams>
  delete: Thunk<() => Promise<void>, apiDeleteRequestParams>
}

export type ApiStore = ApiState & ApiActions;
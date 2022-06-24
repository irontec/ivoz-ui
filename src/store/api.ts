import axios, { CancelToken, CancelTokenSource } from 'axios';
import { action, Action, Actions, Computed, computed, Thunk, thunk } from 'easy-peasy';
import { IvozStore } from '../index';
import ApiClient, { ApiError } from '../services/api/ApiClient';
import { KeyValList } from '../services/api/ParsedApiSpecInterface';
import { EntityValues } from '../services/entity/EntityService';

const isReqUnauthorized = (error: ApiError | null): boolean => {

  if ([401].includes(error?.status || -1)) {
    return true;
  }

  return false;
};

const handleApiErrors = async (
  error: ApiError | null,
  getStoreActions: () => Actions<any>,
): Promise<string | null> => {

  if (!error) {
    return null;
  }

  if (isReqUnauthorized(error)) {
    const actions: any = getStoreActions();
    await actions.auth.resetToken();
    await actions.auth.useRefreshToken();
  }

  return error.data?.detail || error.statusText;
};

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
  values: FormData | EntityValues | Record<string, string | number | boolean | null>,
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
  errorCode: number | null,
  ongoingRequests: number,
  loading: Computed<ApiState, boolean>,
  reqCancelTokenSourceFactory: () => CancelTokenSource
}

interface ApiActions {
  setErrorMsg: Action<ApiState, string>
  setErrorCode: Action<ApiState, number>
  sumRequest: Action<ApiState>,
  restRequest: Action<ApiState>,
  get: Thunk<() => Promise<void>, apiGetRequestParams, any, IvozStore>
  download: Thunk<() => Promise<void>, apiGetRequestParams, any, IvozStore>
  post: Thunk<() => Promise<void>, apiPostRequestParams, any, IvozStore>
  put: Thunk<() => Promise<void>, apiPutRequestParams, any, IvozStore>
  delete: Thunk<() => Promise<void>, apiDeleteRequestParams, any, IvozStore>
}

export type ApiStore = ApiState & ApiActions;

const api: ApiStore = {
  errorMsg: null,
  errorCode: null,
  ongoingRequests: 0,
  reqCancelTokenSourceFactory: () => {
    return axios.CancelToken.source();
  },
  loading: computed<ApiState, boolean>((state) => { return state.ongoingRequests > 0 }),
  setErrorMsg: action<ApiState, string>((state, errorMsg) => {
    state.errorMsg = errorMsg;
  }),
  setErrorCode: action<ApiState, number>((state, errorCode) => {
    state.errorCode = errorCode;
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
  get: thunk(async (actions: any, payload: apiGetRequestParams, { getStoreActions, getStoreState }) => {

    actions.sumRequest();
    actions.setErrorMsg(null);
    actions.setErrorCode(null);
    const { path, params, successCallback, cancelToken, silenceErrors } = payload;

    const request = async () => {
      const resp = await ApiClient.get(
        path,
        params,
        successCallback,
        cancelToken
      );

      return resp;
    };

    try {

      return await request();

    } catch (error: any) {

      const errorMsg = await handleApiErrors(error as ApiError, getStoreActions);

      const token = getStoreState().auth.token;
      const retry = isReqUnauthorized(error) && token;

      if (retry) {
        try {

          return await request();

        } catch (retryError) {

          if (!silenceErrors) {
            actions.setErrorMsg(errorMsg);
            actions.setErrorCode(error?.status);
          }

          throw error;
        }
      }

      if (!silenceErrors) {
        actions.setErrorMsg(errorMsg);
        actions.setErrorCode(error?.status);
      }

    } finally {
      actions.restRequest();
    }
  }),
  download: thunk(async (actions: any, payload: apiGetRequestParams, { getStoreActions, getStoreState }) => {

    const { path, params, successCallback, cancelToken, silenceErrors } = payload;
    actions.sumRequest();
    actions.setErrorMsg(null);
    actions.setErrorCode(null);

    const request = async () => {
      return await ApiClient.download(
        path,
        params,
        successCallback,
        cancelToken
      );
    };

    try {

      return await request();

    } catch (error: any) {

      const errorMsg = await handleApiErrors(error as ApiError, getStoreActions);

      const token = getStoreState().auth.token;
      const retry = isReqUnauthorized(error) && token;

      if (retry) {
        try {

          return await request();

        } catch (retryError) {

          if (!silenceErrors) {
            actions.setErrorMsg(errorMsg);
            actions.setErrorCode(error?.status);
          }

          throw error;
        }
      }

      if (!silenceErrors) {
        actions.setErrorMsg(errorMsg);
        actions.setErrorCode(error?.status);
      }

    } finally {
      actions.restRequest();
    }
  }),

  ////////////////////////////////////////
  // POST
  ////////////////////////////////////////
  post: thunk(async (actions: any, payload: apiPostRequestParams, { getStoreActions, getStoreState }) => {

    const { path, values, contentType, cancelToken, silenceErrors } = payload;
    actions.sumRequest();
    actions.setErrorMsg(null);
    actions.setErrorCode(null);

    const request = async () => {
      return await ApiClient.post(
        path,
        values,
        contentType,
        cancelToken
      );
    };

    try {

      return await request();

    } catch (error: any) {

      const errorMsg = await handleApiErrors(error as ApiError, getStoreActions);

      const token = getStoreState().auth.token;
      const retry = isReqUnauthorized(error) && token;

      if (retry) {
        try {

          return await request();

        } catch (retryError) {

          if (!silenceErrors) {
            actions.setErrorMsg(errorMsg);
            actions.setErrorCode(error?.status);
          }

          throw error;
        }
      }

      if (!silenceErrors) {
        actions.setErrorMsg(errorMsg);
        actions.setErrorCode(error?.status);
      }

    } finally {
      actions.restRequest();
    }

  }),
  ////////////////////////////////////////
  // PUT
  ////////////////////////////////////////
  put: thunk(async (actions: any, payload: apiPutRequestParams, { getStoreActions, getStoreState }) => {

    const { path, values, cancelToken, silenceErrors } = payload;
    actions.sumRequest();
    actions.setErrorMsg(null);
    actions.setErrorCode(null);

    const request = async () => {
      return await ApiClient.put(
        path,
        values,
        cancelToken
      );
    };

    try {

      return await request();

    } catch (error: any) {

      const errorMsg = await handleApiErrors(error as ApiError, getStoreActions);

      const token = getStoreState().auth.token;
      const retry = isReqUnauthorized(error) && token;

      if (retry) {
        try {

          return await request();

        } catch (retryError) {

          if (!silenceErrors) {
            actions.setErrorMsg(errorMsg);
            actions.setErrorCode(error?.status);
          }

          throw error;
        }
      }

      if (!silenceErrors) {
        actions.setErrorMsg(errorMsg);
        actions.setErrorCode(error?.status);
      }

    } finally {
      actions.restRequest();
    }
  }),
  ////////////////////////////////////////
  // DELETE
  ////////////////////////////////////////
  delete: thunk(async (actions: any, payload: apiDeleteRequestParams, { getStoreActions, getStoreState }) => {

    const { path, cancelToken, silenceErrors } = payload;
    actions.sumRequest();
    actions.setErrorMsg(null);
    actions.setErrorCode(null);

    const request = async () => {
      return await ApiClient.delete(
        path,
        cancelToken
      );
    };

    try {

      return await request();

    } catch (error: any) {

      const errorMsg = await handleApiErrors(error as ApiError, getStoreActions);

      const token = getStoreState().auth.token;
      const retry = isReqUnauthorized(error) && token;

      if (retry) {
        try {

          return await request();

        } catch (retryError) {

          if (!silenceErrors) {
            actions.setErrorMsg(errorMsg);
            actions.setErrorCode(error?.status);
          }

          throw error;
        }
      }

      if (!silenceErrors) {
        actions.setErrorMsg(errorMsg);
        actions.setErrorCode(error?.status);
      }

    } finally {
      actions.restRequest();
    }
  }),
};

export default api;
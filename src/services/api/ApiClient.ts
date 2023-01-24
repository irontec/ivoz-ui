import axios, { AxiosError, AxiosResponse, CancelToken } from 'axios';
import { KeyValList } from './ParsedApiSpecInterface';

type AsyncFunction = (data: any, headers: any) => Promise<void>;
export type ApiError = AxiosResponse | null;

class ApiClient {
  static API_URL = `//${window.location.host}/api`;

  static setToken(token: string): void {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  static async get(
    endpoint: string,
    params: KeyValList,
    callback: AsyncFunction,
    cancelToken?: CancelToken
  ): Promise<unknown> {
    try {
      const response = await axios.get(ApiClient.API_URL + endpoint, {
        params,
        headers: {
          Accept: 'application/json',
        },
        cancelToken,
      });

      await callback(response.data, response.headers);

      return response;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return;
      }

      if (!error) {
        throw error;
      }

      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 403) {
        await callback([], axiosError.response.headers);
        return;
      }

      throw axiosError.response;
    }
  }

  static async download(
    endpoint: string,
    params: any = undefined,
    callback: AsyncFunction,
    cancelToken?: CancelToken
  ): Promise<unknown> {
    try {
      const response = await axios.get(ApiClient.API_URL + endpoint, {
        params: params,
        headers: {},
        responseType: 'blob',
        cancelToken,
      });

      await callback(response.data, response.headers);

      return response;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return;
      }

      if (!error) {
        throw error;
      }

      const axiosError = error as AxiosError;
      if (axiosError?.response?.status === 403) {
        await callback([], axiosError.response.headers);
        return;
      }

      throw axiosError.response;
    }
  }

  static async post<T = any>(
    endpoint: string,
    params: any = undefined,
    contentType: string,
    cancelToken?: CancelToken
  ): Promise<T | undefined> {
    const reqConfig = {
      headers: {
        'Content-Type': contentType,
      },
      cancelToken,
    };

    if (contentType === 'application/x-www-form-urlencoded') {
      const reqParams = new URLSearchParams();
      for (const idx in params) {
        reqParams.append(idx, params[idx]);
      }

      params = reqParams;
    }

    try {
      return await axios.post(ApiClient.API_URL + endpoint, params, reqConfig);
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return;
      }

      if (!error) {
        throw error;
      }

      throw (error as AxiosError).response;
    }
  }

  static async put<T = any>(
    endpoint: string,
    params: any = undefined,
    cancelToken?: CancelToken
  ): Promise<T | undefined> {
    try {
      return await axios.put(ApiClient.API_URL + endpoint, params, {
        cancelToken,
      });
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return;
      }

      if (!error) {
        throw error;
      }

      throw (error as AxiosError).response;
    }
  }

  static async delete<T = any>(
    endpoint: string,
    cancelToken?: CancelToken
  ): Promise<T | undefined> {
    try {
      return await axios.delete(ApiClient.API_URL + endpoint, {
        cancelToken,
      });
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return;
      }

      if (!error) {
        throw error;
      }

      throw (error as AxiosError).response;
    }
  }
}

export default ApiClient;

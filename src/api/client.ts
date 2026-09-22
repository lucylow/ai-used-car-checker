import axios, { AxiosInstance, AxiosError } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { captureException } from '@sentry/react-native';

const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl as string | undefined;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined;

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: SUPABASE_URL ? `${SUPABASE_URL}/functions/v1` : undefined,
      timeout: 20000,
      headers: {
        'Content-Type': 'application/json',
        ...(SUPABASE_ANON_KEY ? { apikey: SUPABASE_ANON_KEY } : {}),
      },
    });

    this.client.interceptors.request.use(async (config) => {
      const token = await SecureStore.getItemAsync('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (r) => r,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await SecureStore.deleteItemAsync('access_token');
        }
        if (error.response?.status && error.response.status >= 500) {
          captureException(error);
        }
        return Promise.reject(error);
      }
    );
  }

  get = <T>(url: string, params?: object) =>
    this.client.get<T>(url, { params }).then((r) => r.data);

  post = <T>(url: string, data?: object) =>
    this.client.post<T>(url, data).then((r) => r.data);

  put = <T>(url: string, data?: object) =>
    this.client.put<T>(url, data).then((r) => r.data);

  patch = <T>(url: string, data?: object) =>
    this.client.patch<T>(url, data).then((r) => r.data);

  delete = <T>(url: string) => this.client.delete<T>(url).then((r) => r.data);
}

export const api = new ApiClient();

import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthCookies = (access: string, refresh: string) => {
  Cookies.set('access_token', access, { expires: 1 });
  Cookies.set('refresh_token', refresh, { expires: 7 });
};

export const clearAuthCookies = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
};

api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const refreshToken = Cookies.get('refresh_token');
    if (error.response?.status === 401 && refreshToken) {
      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh: refreshToken });
        const { access } = res.data;
        setAuthCookies(access, refreshToken);
        error.config.headers.Authorization = `Bearer ${access}`;
        return api.request(error.config);
      } catch (refreshError) {
        clearAuthCookies();
      }
    }
    return Promise.reject(error);
  }
);

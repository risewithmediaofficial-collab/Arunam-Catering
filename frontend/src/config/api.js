const isDev = import.meta.env.DEV;

// In production, Nginx proxies /api/* to the backend container.
// In development, hit http://localhost:5000 directly.
// If VITE_API_URL is set, use that value.
export const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/+$/, '')
  : (isDev ? 'http://localhost:5000' : '');

export default API_BASE_URL;

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Track loading state globally (used by context)
let loadingCallbacks = [];
export const subscribeToLoading = (cb) => {
  loadingCallbacks.push(cb);
  return () => { loadingCallbacks = loadingCallbacks.filter((f) => f !== cb); };
};
const setLoading = (val) => loadingCallbacks.forEach((cb) => cb(val));

let activeRequests = 0;

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    activeRequests++;
    if (activeRequests === 1) setLoading(true);
    return config;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) setLoading(false);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) setLoading(false);
    return response;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) setLoading(false);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    const enhancedError = new Error(message);
    enhancedError.status = error.response?.status;
    enhancedError.errors = error.response?.data?.errors;
    return Promise.reject(enhancedError);
  }
);

export default axiosInstance;

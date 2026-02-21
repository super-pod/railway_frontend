import axios from 'axios';
import { auth } from './firebaseClient';

const isLocalFrontendHost = (() => {
    if (typeof window === 'undefined') {
        return false;
    }
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
})();

const localApiBase = import.meta.env.VITE_LOCAL_API_URL || 'http://127.0.0.1:8000';

const apiClient = axios.create({
    baseURL: isLocalFrontendHost ? localApiBase : (import.meta.env.VITE_API_URL || '/api'),
});

apiClient.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use((response) => response, async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;
    if (status === 401 && auth.currentUser && originalRequest && !(originalRequest as any)._retry) {
        (originalRequest as any)._retry = true;
        try {
            const token = await auth.currentUser.getIdToken(true);
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});

export default apiClient;

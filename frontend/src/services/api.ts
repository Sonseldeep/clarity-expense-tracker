/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = 'https://clarity-expense-tracker-production.up.railway.app/api/';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    signup: (email:string, password: string) => 
        api.post('/auth/signup', { email, password }),

    login: (email:string, password: string) => 
        api.post('/auth/login', { email, password }),
};

export const transactionsAPI = {
    getAll: () => api.get('/transactions'),
    create: (data: any) => api.post('/transactions', data),
    update: (id:number, data:any) => api.put(`/transactions/${id}`, data),
    delete: (id:number) => api.delete(`/transactions/${id}`),
};
export default api;
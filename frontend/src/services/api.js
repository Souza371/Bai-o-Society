import axios from 'axios';

// Detectar URL da API automaticamente
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // Se está em GitHub Codespaces
  if (hostname.includes('app.github.dev')) {
    const baseHostname = hostname.replace('-3000', '-5000');
    return `https://${baseHostname}/api`;
  }
  
  // Desenvolvimento local
  return process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

console.log('🌐 API Base URL configurada:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

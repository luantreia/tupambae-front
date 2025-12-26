import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor para adjuntar el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Interceptor para manejo de errores global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.msg || 'Ocurrió un error inesperado. Intente nuevamente.';
    if (error.response?.status === 500) {
      console.error('SERVER ERROR:', error.response.data);
    }
    // No alertamos en 401 porque el AuthContext lo maneja o es esperado en login
    if (error.response?.status !== 401) {
      window.dispatchEvent(new CustomEvent('show-toast', { 
        detail: { message, type: 'error' } 
      }));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  switchRole: (nuevoRol) => api.post('/auth/switch-role', { nuevoRol }),
  activateProducer: () => api.post('/auth/activate-producer'),
  updateMe: (data) => api.patch('/usuarios/me', data),
  deleteAccount: (id) => api.delete(`/usuarios/${id}`),
  toggleVisibility: () => api.patch('/users/me/visibilidad'),
  searchUsers: (query) => api.get(`/usuarios/search?query=${query}`),
  getContacts: () => api.get('/usuarios/contacts'),
  addContact: (id) => api.post(`/usuarios/contacts/${id}`),
  removeContact: (id) => api.delete(`/usuarios/contacts/${id}`),
  getUserProfile: (id) => api.get(`/usuarios/${id}/profile`),
};

export const producerService = {
  getAll: (params) => api.get('/productores', { params }),
  getById: (id) => api.get(`/productores/${id}`),
  getMe: () => api.get('/productores/me'),
  upsertProfile: (data) => api.post('/productores', data),
  updateProfile: (data) => api.put('/productores/me', data),
};

export const productService = {
  getAll: () => api.get('/productos'),
  getByProducer: (id) => api.get(`/productos/productor/${id}`),
  getMe: () => api.get('/productos/me'),
  create: (data) => api.post('/productos', data),
  update: (id, data) => api.put(`/productos/${id}`, data),
  delete: (id) => api.delete(`/productos/${id}`),
};

export const orderService = {
  create: (data) => api.post('/pedidos', data),
  getMe: () => api.get('/pedidos/me'),
  updateStatus: (id, estado) => api.put(`/pedidos/${id}/status`, { estado }),
};

export const notificationService = {
  getAll: () => api.get('/notificaciones'),
  markAsRead: (id) => api.put(`/notificaciones/${id}/read`),
  markAllAsRead: () => api.put('/notificaciones/read-all'),
};

export const truequeService = {
  create: (data) => api.post('/trueques', data),
  getMe: () => api.get('/trueques'),
  updateStatus: (id, estado) => api.patch(`/trueques/${id}`, { estado }),
};

export default api;

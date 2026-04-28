import api from './api';

export const authService = {
  register: (email, senha, nome, telefone) =>
    api.post('/auth/register', { email, senha, nome, telefone }),

  login: (email, senha) =>
    api.post('/auth/login', { email, senha }),

  refreshToken: (refreshToken) =>
    api.post('/auth/refresh-token', { refreshToken }),

  getProfile: () =>
    api.get('/auth/me'),

  atualizarPerfil: (dados) =>
    api.patch('/auth/me', dados),

  listarUsuarios: () =>
    api.get('/auth/users')
};

export const reservaService = {
  listar: (filtros) =>
    api.get('/reservas', { params: filtros }),

  buscarPorId: (id) =>
    api.get(`/reservas/${id}`),

  criar: (dados) =>
    api.post('/reservas', dados),

  atualizar: (id, dados) =>
    api.put(`/reservas/${id}`, dados),

  deletar: (id) =>
    api.delete(`/reservas/${id}`),

  horariosLivres: (quadra_id, data) =>
    api.get('/reservas/horarios-livres', { params: { quadra_id, data } })
};

export const quadraService = {
  listar: () =>
    api.get('/quadras'),

  buscarPorId: (id) =>
    api.get(`/quadras/${id}`),

  criar: (dados) =>
    api.post('/quadras', dados),

  atualizar: (id, dados) =>
    api.put(`/quadras/${id}`, dados),

  desativar: (id) =>
    api.delete(`/quadras/${id}`)
};

export const dashboardService = {
  getMetricas: () =>
    api.get('/dashboard/metricas')
};

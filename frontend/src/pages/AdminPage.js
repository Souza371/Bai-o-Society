import React, { useState, useEffect } from 'react';
import { quadraService, dashboardService, reservaService } from '../services';
import Card from '../components/Card';
import Modal from '../components/Modal';
import './AdminPage.css';

function AdminPage() {
  const [quadras, setQuadras] = useState([]);
  const [metricas, setMetricas] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQuadraModal, setShowQuadraModal] = useState(false);
  const [quadraForm, setQuadraForm] = useState({
    nome: '',
    metragem: '',
    preco_hora: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [quadrasRes, metricasRes, reservasRes] = await Promise.all([
        quadraService.listar(),
        dashboardService.getMetricas(),
        reservaService.listar({})
      ]);
      setQuadras(quadrasRes.data.data);
      setMetricas(metricasRes.data.data);
      setReservas(reservasRes.data.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuadra = async () => {
    if (!quadraForm.nome || !quadraForm.metragem || !quadraForm.preco_hora) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      await quadraService.criar(quadraForm);
      setShowQuadraModal(false);
      setQuadraForm({ nome: '', metragem: '', preco_hora: '' });
      carregarDados();
    } catch (error) {
      alert('Erro ao criar quadra');
    }
  };

  const handleDeleteQuadra = async (id) => {
    if (window.confirm('Tem certeza?')) {
      try {
        await quadraService.desativar(id);
        carregarDados();
      } catch (error) {
        alert('Erro ao deletar quadra');
      }
    }
  };

  if (loading) return <div className="admin-page">Carregando...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Painel Administrativo</h1>
      </div>

      <div className="admin-container">
        {metricas && (
          <div className="metricas-section">
            <Card className="metrica-card">
              <div className="metrica">
                <h3>Faturamento (Mês)</h3>
                <p className="valor">R$ {metricas.faturamento_mes?.toFixed(2) || '0.00'}</p>
              </div>
            </Card>

            <Card className="metrica-card">
              <div className="metrica">
                <h3>Ocupação</h3>
                <p className="valor">{metricas.ocupacao_percentual || 0}%</p>
              </div>
            </Card>

            <Card className="metrica-card">
              <div className="metrica">
                <h3>Total de Reservas</h3>
                <p className="valor">{metricas.total_reservas || 0}</p>
              </div>
            </Card>
          </div>
        )}

        <div className="quadras-management">
          <div className="section-header">
            <h2>Gerenciar Quadras</h2>
            <button className="btn btn-primary" onClick={() => setShowQuadraModal(true)}>
              + Nova Quadra
            </button>
          </div>

          <Card>
            <div className="quadras-table">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Metragem</th>
                    <th>Preço/Hora</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {quadras.map(quadra => (
                    <tr key={quadra.id}>
                      <td>{quadra.nome}</td>
                      <td>{quadra.metragem}m²</td>
                      <td>R$ {quadra.preco_hora?.toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteQuadra(quadra.id)}
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="reservas-management">
          <h2>Todas as Reservas ({reservas.length})</h2>
          <Card>
            <div className="reservas-list">
              {reservas.slice(0, 10).map(reserva => (
                <div key={reserva.id} className="reserva-item">
                  <div className="reserva-info">
                    <strong>{reserva.Quadra?.nome}</strong>
                    <p>{new Date(reserva.data).toLocaleDateString('pt-BR')} às {reserva.hora_inicio}</p>
                    <span className={`status status-${reserva.status}`}>{reserva.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showQuadraModal}
        title="Nova Quadra"
        onClose={() => setShowQuadraModal(false)}
        onConfirm={handleCreateQuadra}
      >
        <div className="form-group">
          <label>Nome</label>
          <input
            type="text"
            value={quadraForm.nome}
            onChange={(e) => setQuadraForm({ ...quadraForm, nome: e.target.value })}
            placeholder="Nome da quadra"
          />
        </div>
        <div className="form-group">
          <label>Metragem (m²)</label>
          <input
            type="number"
            value={quadraForm.metragem}
            onChange={(e) => setQuadraForm({ ...quadraForm, metragem: e.target.value })}
            placeholder="100"
          />
        </div>
        <div className="form-group">
          <label>Preço/Hora (R$)</label>
          <input
            type="number"
            step="0.01"
            value={quadraForm.preco_hora}
            onChange={(e) => setQuadraForm({ ...quadraForm, preco_hora: e.target.value })}
            placeholder="150.00"
          />
        </div>
      </Modal>
    </div>
  );
}

export default AdminPage;

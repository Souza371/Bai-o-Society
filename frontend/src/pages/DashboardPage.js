import React, { useState, useEffect } from 'react';
import { reservaService, quadraService } from '../services';
import Card from '../components/Card';
import Modal from '../components/Modal';
import './DashboardPage.css';

function DashboardPage() {
  const [quadras, setQuadras] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [selectedQuadra, setSelectedQuadra] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableHours, setAvailableHours] = useState([]);
  const [reservaForm, setReservaForm] = useState({
    hora_inicio: '',
    hora_fim: '',
    observacoes: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [quadrasRes, reservasRes] = await Promise.all([
        quadraService.listar(),
        reservaService.listar({})
      ]);
      setQuadras(quadrasRes.data.data);
      setReservas(reservasRes.data.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuadra = async (quadra) => {
    setSelectedQuadra(quadra);
    setReservaForm({ hora_inicio: '', hora_fim: '', observacoes: '' });
    
    try {
      const response = await reservaService.horariosLivres(quadra.id, selectedDate);
      setAvailableHours(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
    }
    
    setShowReservaModal(true);
  };

  const handleCreateReserva = async () => {
    if (!reservaForm.hora_inicio || !reservaForm.hora_fim) {
      alert('Selecione horário de início e fim');
      return;
    }

    try {
      await reservaService.criar({
        quadra_id: selectedQuadra.id,
        data: selectedDate,
        hora_inicio: reservaForm.hora_inicio,
        hora_fim: reservaForm.hora_fim,
        observacoes: reservaForm.observacoes
      });

      alert('Reserva criada com sucesso!');
      setShowReservaModal(false);
      carregarDados();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao criar reserva');
    }
  };

  const handleDeleteReserva = async (id) => {
    if (window.confirm('Tem certeza que deseja cancelar esta reserva?')) {
      try {
        await reservaService.deletar(id);
        carregarDados();
      } catch (error) {
        alert('Erro ao cancelar reserva');
      }
    }
  };

  if (loading) return <div className="dashboard-page">Carregando...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <img src="/brasao.svg" alt="Baião Society" className="dashboard-brasao" />
          <div className="dashboard-header-text">
            <h1>Dashboard de Reservas</h1>
            <p className="dashboard-subtitle">Baião Society - Sistema de Gestão de Quadras</p>
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="quadras-section">
          <Card title="Quadras Disponíveis">
            <div className="quadras-grid">
              {quadras.length === 0 ? (
                <p>Nenhuma quadra disponível</p>
              ) : (
                quadras.map(quadra => (
                  <div key={quadra.id} className="quadra-card">
                    <h3>{quadra.nome}</h3>
                    <p>{quadra.metragem}m²</p>
                    <p className="preco">R$ {quadra.preco_hora?.toFixed(2)}/hora</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleSelectQuadra(quadra)}
                    >
                      Reservar
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="reservas-section">
          <Card title="Minhas Reservas">
            <div className="reservas-list">
              {reservas.length === 0 ? (
                <p>Você não tem reservas</p>
              ) : (
                reservas.map(reserva => (
                  <div key={reserva.id} className="reserva-item">
                    <div className="reserva-info">
                      <h4>{reserva.Quadra?.nome}</h4>
                      <p>{new Date(reserva.data).toLocaleDateString('pt-BR')} às {reserva.hora_inicio}</p>
                      <span className={`status status-${reserva.status}`}>{reserva.status}</span>
                    </div>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteReserva(reserva.id)}
                    >
                      Cancelar
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showReservaModal}
        title={`Reservar ${selectedQuadra?.nome}`}
        onClose={() => setShowReservaModal(false)}
        onConfirm={handleCreateReserva}
        confirmText="Confirmar Reserva"
      >
        <div className="reserva-modal-content">
          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Horário de Início</label>
            <select
              value={reservaForm.hora_inicio}
              onChange={(e) => setReservaForm({ ...reservaForm, hora_inicio: e.target.value })}
            >
              <option value="">Selecione</option>
              {availableHours.map((hour, idx) => (
                <option key={idx} value={hour.hora_inicio}>
                  {hour.hora_inicio} {hour.disponivel ? '(Livre)' : '(Ocupado)'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Horário de Término</label>
            <input
              type="time"
              value={reservaForm.hora_fim}
              onChange={(e) => setReservaForm({ ...reservaForm, hora_fim: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Observações</label>
            <textarea
              value={reservaForm.observacoes}
              onChange={(e) => setReservaForm({ ...reservaForm, observacoes: e.target.value })}
              placeholder="Adicione observações (opcional)"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DashboardPage;

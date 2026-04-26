import React, { useState, useEffect } from 'react';
import { reservaService, quadraService } from '../services';
import Card from '../components/Card';
import ReservaModal from '../components/ReservaModal';
import './DashboardPage.css';

function DashboardPage() {
  const [quadras, setQuadras] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [selectedQuadra, setSelectedQuadra] = useState(null);

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

  const handleSelectQuadra = (quadra) => {
    setSelectedQuadra(quadra);
    setShowReservaModal(true);
  };

  const handleReservaSucesso = () => {
    setShowReservaModal(false);
    setSelectedQuadra(null);
    carregarDados();
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
          <img src="/brasao-oficial.jpg" alt="Baião Society" className="dashboard-brasao brasao-oficial" />
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
        </div>
      </div>

      {showReservaModal && selectedQuadra && (
        <ReservaModal 
          quadra={selectedQuadra}
          onClose={() => setShowReservaModal(false)}
          onSucesso={handleReservaSucesso}
        />
      )}
    </div>
  );
}

export default DashboardPage;

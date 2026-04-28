import React, { useState, useEffect } from 'react';
import { reservaService, quadraService } from '../services';
import Card from '../components/Card';
import ReservaModal from '../components/ReservaModal';
import Shop from '../components/Shop';
import FloatingContacts from '../components/FloatingContacts';
import './DashboardPage.css';

function DashboardPage() {
  const [quadras, setQuadras] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReservaModal, setShowReservaModal] = useState(false);
  const [selectedQuadra, setSelectedQuadra] = useState(null);
  const [reservaEmEdicao, setReservaEmEdicao] = useState(null);

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
    setReservaEmEdicao(null);
    setShowReservaModal(true);
  };

  const handleEditarReserva = (reserva) => {
    const quadraDaReserva = quadras.find((q) => q.id === reserva.quadra_id);
    if (!quadraDaReserva) {
      alert('Não foi possível carregar os dados da quadra para edição.');
      return;
    }

    setSelectedQuadra(quadraDaReserva);
    setReservaEmEdicao(reserva);
    setShowReservaModal(true);
  };

  const handleReservaSucesso = () => {
    setShowReservaModal(false);
    setSelectedQuadra(null);
    setReservaEmEdicao(null);
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

  const fecharModalReserva = () => {
    setShowReservaModal(false);
    setSelectedQuadra(null);
    setReservaEmEdicao(null);
  };

  const quadraPrincipal = quadras[0];

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
          <Card title="Quadra em Destaque" className="quadra-destaque-card">
            {quadraPrincipal ? (
              <div className="quadra-destaque-layout">
                <div className="quadra-destaque-imagem">
                  <img
                    src={quadraPrincipal.imagem_url || '/quadra-destaque.svg'}
                    alt="Imagem ilustrada da quadra"
                    className="quadra-destaque-img"
                  />
                  <span className="quadra-destaque-badge">Única quadra disponível</span>
                </div>

                <div className="quadra-destaque-info">
                  <div className="quadra-destaque-topo">
                    <span className="quadra-destaque-tag">Disponível para aluguel</span>
                    <span className="quadra-destaque-tag quadra-destaque-tag-secundaria">Reserva rápida</span>
                  </div>

                  <h3>{quadraPrincipal.nome}</h3>
                  <p className="quadra-destaque-descricao">
                    O campo oficial do Baião Society, preparado para jogos, treinos e reservas com conforto.
                  </p>

                  <div className="quadra-destaque-metricas">
                    <div className="quadra-metrica">
                      <span className="quadra-metrica-label">Área</span>
                      <strong>{quadraPrincipal.metragem}m²</strong>
                    </div>
                    <div className="quadra-metrica">
                      <span className="quadra-metrica-label">Preço/hora</span>
                      <strong>R$ {quadraPrincipal.preco_hora?.toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="quadra-destaque-acoes">
                    <button 
                      className="btn btn-primary btn-reservar-destaque"
                      onClick={() => handleSelectQuadra(quadraPrincipal)}
                    >
                      Reservar agora
                    </button>
                    <span className="quadra-destaque-obs">Abra o calendário e garanta seu horário agora</span>
                  </div>
                </div>
              </div>
            ) : (
              <p>Nenhuma quadra disponível</p>
            )}
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
                      {reserva.observacoes && (
                        <p className="reserva-observacoes">Obs: {reserva.observacoes}</p>
                      )}
                      {reserva.Pagamento?.metodo && (
                        <p className="reserva-pagamento">Pagamento: {reserva.Pagamento.metodo}</p>
                      )}
                      <span className={`status status-${reserva.status}`}>{reserva.status}</span>
                    </div>
                    <div className="reserva-acoes">
                      {reserva.status !== 'cancelada' && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleEditarReserva(reserva)}
                        >
                          Editar
                        </button>
                      )}
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteReserva(reserva.id)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      <div className="shop-section">
        <Shop />
      </div>

      {showReservaModal && selectedQuadra && (
        <ReservaModal 
          quadra={selectedQuadra}
          reserva={reservaEmEdicao}
          onClose={fecharModalReserva}
          onSucesso={handleReservaSucesso}
        />
      )}

      <FloatingContacts />
    </div>
  );
}

export default DashboardPage;

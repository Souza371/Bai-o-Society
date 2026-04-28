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
  const [editingQuadraId, setEditingQuadraId] = useState(null);
  const [imagemPreview, setImagemPreview] = useState('');
  const [quadraForm, setQuadraForm] = useState({
    nome: '',
    descricao: '',
    tipo: 'futsal',
    metragem: '',
    preco_hora: '',
    imagem_url: ''
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

  const resetQuadraForm = () => {
    setQuadraForm({
      nome: '',
      descricao: '',
      tipo: 'futsal',
      metragem: '',
      preco_hora: '',
      imagem_url: ''
    });
    setImagemPreview('');
    setEditingQuadraId(null);
  };

  const openCreateQuadraModal = () => {
    resetQuadraForm();
    setShowQuadraModal(true);
  };

  const openEditQuadraModal = (quadra) => {
    setQuadraForm({
      nome: quadra.nome || '',
      descricao: quadra.descricao || '',
      tipo: quadra.tipo || 'futsal',
      metragem: quadra.metragem?.toString() || '',
      preco_hora: quadra.preco_hora?.toString() || '',
      imagem_url: quadra.imagem_url || ''
    });
    setImagemPreview(quadra.imagem_url || '');
    setEditingQuadraId(quadra.id);
    setShowQuadraModal(true);
  };

  const closeQuadraModal = () => {
    setShowQuadraModal(false);
    resetQuadraForm();
  };

  const handleSaveQuadra = async () => {
    if (!quadraForm.nome || !quadraForm.metragem || !quadraForm.preco_hora) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      const payload = {
        ...quadraForm,
        metragem: Number(quadraForm.metragem),
        preco_hora: Number(quadraForm.preco_hora)
      };

      if (editingQuadraId) {
        await quadraService.atualizar(editingQuadraId, payload);
      } else {
        await quadraService.criar(payload);
      }

      closeQuadraModal();
      carregarDados();
    } catch (error) {
      alert(editingQuadraId ? 'Erro ao atualizar quadra' : 'Erro ao criar quadra');
    }
  };

  const handleImagemSelecionada = (event) => {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    const leitor = new FileReader();
    leitor.onload = () => {
      const resultado = typeof leitor.result === 'string' ? leitor.result : '';
      setQuadraForm((atual) => ({
        ...atual,
        imagem_url: resultado
      }));
      setImagemPreview(resultado);
    };
    leitor.readAsDataURL(arquivo);
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
        <p>Edite quadras, preços e informações sem sair desta tela.</p>
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
            <button className="btn btn-primary" onClick={openCreateQuadraModal}>
              + Nova Quadra
            </button>
          </div>

          <Card>
            <div className="quadras-table">
              <table>
                <thead>
                  <tr>
                    <th>Foto</th>
                    <th>Nome</th>
                    <th>Metragem</th>
                    <th>Preço/Hora</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {quadras.map(quadra => (
                    <tr key={quadra.id}>
                      <td>
                        <div className="quadra-thumb">
                          <img
                            src={quadra.imagem_url || '/quadra-destaque.svg'}
                            alt={quadra.nome}
                          />
                        </div>
                      </td>
                      <td>{quadra.nome}</td>
                      <td>{quadra.metragem}m²</td>
                      <td>R$ {Number(quadra.preco_hora)?.toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm btn-editar"
                          onClick={() => openEditQuadraModal(quadra)}
                        >
                          Editar
                        </button>
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
        title={editingQuadraId ? 'Editar Quadra' : 'Nova Quadra'}
        onClose={closeQuadraModal}
        onConfirm={handleSaveQuadra}
        confirmText={editingQuadraId ? 'Salvar alterações' : 'Criar quadra'}
        cancelText="Cancelar"
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
          <label>Descrição</label>
          <textarea
            value={quadraForm.descricao}
            onChange={(e) => setQuadraForm({ ...quadraForm, descricao: e.target.value })}
            placeholder="Descrição da quadra"
            rows="3"
          />
        </div>
        <div className="form-group">
          <label>Tipo</label>
          <select
            value={quadraForm.tipo}
            onChange={(e) => setQuadraForm({ ...quadraForm, tipo: e.target.value })}
          >
            <option value="futsal">Futsal</option>
            <option value="futebol">Futebol</option>
            <option value="volei">Vôlei</option>
            <option value="multipla">Múltipla</option>
          </select>
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
        <div className="form-group">
          <label>Foto da quadra</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImagemSelecionada}
          />
          <small className="help-text">A imagem escolhida é salva como foto da quadra.</small>
          {imagemPreview && (
            <div className="imagem-preview">
              <img src={imagemPreview} alt="Pré-visualização da quadra" />
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default AdminPage;

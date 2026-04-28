import React, { useState } from 'react';
import ReservaCalendario from './ReservaCalendario';
import api from '../services/api';
import './ReservaModal.css';

const METODOS_PAGAMENTO = [
  { value: 'pix', label: 'PIX' },
  { value: 'cartao', label: 'Cartão' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'boleto', label: 'Boleto' }
];

function ReservaModal({ quadra, reserva = null, onClose, onSucesso }) {
  const [dataEscolhida, setDataEscolhida] = useState(reserva?.data || null);
  const [horaEscolhida, setHoraEscolhida] = useState(reserva?.hora_inicio || null);
  const [horaFim, setHoraFim] = useState(reserva?.hora_fim || null);
  const [observacoes, setObservacoes] = useState(reserva?.observacoes || '');
  const [metodoPagamento, setMetodoPagamento] = useState(reserva?.Pagamento?.metodo || 'pix');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const isEdicao = Boolean(reserva?.id);

  const handleSelectData = (data) => {
    setDataEscolhida(data);
    setHoraEscolhida(null);
    setHoraFim(null);
  };

  const handleSelectHora = (hora) => {
    setHoraEscolhida(hora);
    // Definir hora fim como 1 hora depois por padrão
    const [h] = hora.split(':');
    const hFim = String(parseInt(h) + 1).padStart(2, '0') + ':00';
    setHoraFim(hFim);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!dataEscolhida || !horaEscolhida || !horaFim) {
      setErro('Por favor, selecione a data e horário');
      return;
    }

    setLoading(true);
    setErro('');

    try {
      const payload = {
        quadra_id: quadra.id,
        data: dataEscolhida,
        hora_inicio: horaEscolhida,
        hora_fim: horaFim,
        observacoes: observacoes || null,
        metodo_pagamento: metodoPagamento
      };

      if (isEdicao) {
        await api.put(`/reservas/${reserva.id}`, payload);
      } else {
        await api.post('/reservas', payload);
      }

      // Sucesso!
      if (onSucesso) {
        onSucesso();
      }
    } catch (erro) {
      setErro(erro.response?.data?.message || 'Erro ao fazer reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reserva-modal-overlay" onClick={onClose}>
      <div className="reserva-modal-content" onClick={e => e.stopPropagation()}>
        <div className="reserva-modal-header">
          <h2>{isEdicao ? 'Editar Reserva' : 'Reservar Quadra'}</h2>
          <button className="btn-fechar-modal" onClick={onClose}>✕</button>
        </div>

        <div className="reserva-modal-body">
          {/* Informações da Quadra */}
          <div className="quadra-info">
            <h3>{quadra.nome}</h3>
            <p>{quadra.descricao}</p>
            <p className="preco">
              <strong>R$ {parseFloat(quadra.preco_hora).toFixed(2)}</strong>/hora
            </p>
          </div>

          {/* Calendário */}
          <ReservaCalendario 
            onSelectData={handleSelectData}
            onSelectHora={handleSelectHora}
          />

          {/* Formulário de Reserva */}
          {dataEscolhida && horaEscolhida && (
            <form onSubmit={handleSubmit} className="reserva-form">
              <div className="form-group">
                <label>Data Selecionada:</label>
                <input 
                  type="text" 
                  value={new Date(dataEscolhida + 'T00:00:00').toLocaleDateString('pt-BR')}
                  disabled
                  className="input-disabled"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Horário Inicial:</label>
                  <input 
                    type="text" 
                    value={horaEscolhida}
                    disabled
                    className="input-disabled"
                  />
                </div>

                <div className="form-group">
                  <label>Horário Final:</label>
                  <select 
                    value={horaFim} 
                    onChange={(e) => setHoraFim(e.target.value)}
                    className="input-select"
                  >
                    {(() => {
                      const opcoes = [];
                      const [hInicio] = horaEscolhida.split(':');
                      let h = parseInt(hInicio) + 1;
                      
                      // Gerar próximas 6 horas disponíveis
                      for (let i = 0; i < 6; i++) {
                        const horario = String(h % 24).padStart(2, '0') + ':00';
                        opcoes.push(
                          <option key={horario} value={horario}>
                            {horario}
                          </option>
                        );
                        h++;
                      }
                      return opcoes;
                    })()}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Observações (opcional):</label>
                <textarea 
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Ex: Jogo de bola, treino, etc"
                  rows="3"
                  className="input-textarea"
                />
              </div>

              <div className="form-group">
                <label>Forma de pagamento:</label>
                <select
                  value={metodoPagamento}
                  onChange={(e) => setMetodoPagamento(e.target.value)}
                  className="input-select"
                >
                  {METODOS_PAGAMENTO.map((metodo) => (
                    <option key={metodo.value} value={metodo.value}>
                      {metodo.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resumo de Preço */}
              <div className="preco-resumo">
                <p>
                  <span>{horaFim.split(':')[0] - horaEscolhida.split(':')[0]}h</span>
                  {' × '}
                  <span>R$ {parseFloat(quadra.preco_hora).toFixed(2)}</span>
                  {' = '}
                  <strong>R$ {(
                    (horaFim.split(':')[0] - horaEscolhida.split(':')[0]) * 
                    parseFloat(quadra.preco_hora)
                  ).toFixed(2)}</strong>
                </p>
              </div>

              {erro && <div className="alert-error">❌ {erro}</div>}

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="btn-cancelar"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-confirmar"
                  disabled={loading}
                >
                  {loading ? 'Processando...' : isEdicao ? 'Salvar Alterações' : 'Confirmar Reserva'}
                </button>
              </div>
            </form>
          )}

          {!dataEscolhida && (
            <div className="msg-selecione">
              👉 Selecione uma data no calendário para começar
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReservaModal;

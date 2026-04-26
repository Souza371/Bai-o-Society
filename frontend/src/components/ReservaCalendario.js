import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './ReservaCalendario.css';

function ReservaCalendario({ onSelectData, onSelectHora }) {
  const [mesAtual, setMesAtual] = useState(new Date().getMonth() + 1);
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());
  const [calendario, setCalendario] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataSelected, setDataSelected] = useState(null);
  const [horarioSelected, setHorarioSelected] = useState(null);

  // Buscar calendário quando mês/ano mudar
  useEffect(() => {
    buscarCalendario(mesAtual, anoAtual);
  }, [mesAtual, anoAtual]);

  const buscarCalendario = async (mes, ano) => {
    setLoading(true);
    try {
      const response = await api.get('/reservas/calendario/disponibilidades', {
        params: { mes, ano }
      });
      setCalendario(response.data.data);
    } catch (erro) {
      console.error('Erro ao buscar calendário:', erro);
    } finally {
      setLoading(false);
    }
  };

  const mesesNomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const irProximoMes = () => {
    if (mesAtual === 12) {
      setMesAtual(1);
      setAnoAtual(anoAtual + 1);
    } else {
      setMesAtual(mesAtual + 1);
    }
  };

  const irMesAnterior = () => {
    if (mesAtual === 1) {
      setMesAtual(12);
      setAnoAtual(anoAtual - 1);
    } else {
      setMesAtual(mesAtual - 1);
    }
  };

  const selecionarDia = (dia) => {
    setDataSelected(dia.data);
    setHorarioSelected(null);
    if (onSelectData) {
      onSelectData(dia.data);
    }
  };

  const selecionarHora = (hora, dia) => {
    if (!hora.disponivel) return; // Não permitir seleção de hora ocupada

    setHorarioSelected(hora.hora);
    if (onSelectHora) {
      onSelectHora(hora.hora);
    }
  };

  const getDiasCelulas = () => {
    const celulas = [];
    
    if (calendario.length === 0) return celulas;

    // Preencher com espaços vazios até o primeiro dia
    const primeiroDia = new Date(anoAtual, mesAtual - 1, 1);
    const inicioDiaSemanaPrimeiro = primeiroDia.getDay();
    
    for (let i = 0; i < inicioDiaSemanaPrimeiro; i++) {
      celulas.push(null);
    }

    // Adicionar dias do mês
    calendario.forEach(dia => {
      celulas.push(dia);
    });

    return celulas;
  };

  const diasSemanaNomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

  if (loading) {
    return <div className="calendario-loading">Carregando calendário...</div>;
  }

  const celulas = getDiasCelulas();

  return (
    <div className="reserva-calendario">
      {/* Seletor de Mês */}
      <div className="calendario-header">
        <button onClick={irMesAnterior} className="btn-nav">
          ◀
        </button>
        <h2>
          {mesesNomes[mesAtual - 1]} {anoAtual}
        </h2>
        <button onClick={irProximoMes} className="btn-nav">
          ▶
        </button>
      </div>

      {/* Tabela de Dias */}
      <div className="calendario-tabela">
        {/* Cabeçalho com dias da semana */}
        <div className="dias-semana">
          {diasSemanaNomes.map(dia => (
            <div key={dia} className="dia-semana-header">
              {dia}
            </div>
          ))}
        </div>

        {/* Grid de dias */}
        <div className="dias-grid">
          {celulas.map((dia, idx) => (
            <div
              key={idx}
              className={`dia-celula ${!dia ? 'vazio' : ''} ${
                dia && dia.data === dataSelected ? 'selecionado' : ''
              } ${dia && !dia.aberto ? 'fechado' : ''}`}
              onClick={() => dia && dia.aberto && selecionarDia(dia)}
            >
              {dia && (
                <>
                  <div className="dia-numero">{dia.dia}</div>
                  {dia.aberto ? (
                    <div className="dia-info">
                      <span className={dia.reservadas.length > 0 ? 'com-reservas' : 'livre'}>
                        {dia.reservadas.length > 0 ? '🔴' : '✓'}
                      </span>
                    </div>
                  ) : (
                    <div className="dia-info">
                      <span className="fechado-icon">✕</span>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Informações e Horários */}
      {dataSelected && (
        <div className="horarios-info">
          <div className="horarios-header">
            <h3>Horários Disponíveis</h3>
            <button 
              onClick={() => setDataSelected(null)} 
              className="btn-fechar"
              title="Fechar"
            >
              ✕
            </button>
          </div>

          {calendario.find(d => d.data === dataSelected) && (
            <>
              <p className="data-selecionada">
                <strong>{calendario.find(d => d.data === dataSelected)?.nomeDia}</strong> 
                {' - '}
                {new Date(dataSelected + 'T00:00:00').toLocaleDateString('pt-BR')}
              </p>

              <div className="horarios-grid">
                {calendario.find(d => d.data === dataSelected)?.horarios.map((hora, idx) => (
                  <button
                    key={idx}
                    className={`horario-btn ${hora.disponivel ? 'disponivel' : 'ocupado'} ${
                      horarioSelected === hora.hora ? 'selecionado' : ''
                    }`}
                    onClick={() => selecionarHora(hora, calendario.find(d => d.data === dataSelected))}
                    disabled={!hora.disponivel}
                    title={hora.disponivel ? `Disponível - ${hora.hora}` : `Ocupado - ${hora.hora}`}
                  >
                    <span className="hora-texto">{hora.hora}</span>
                    <span className="hora-status">
                      {hora.disponivel ? '✓' : '✕'}
                    </span>
                  </button>
                ))}
              </div>

              {horarioSelected && (
                <div className="horario-resumo">
                  <p>
                    ✓ <strong>Selecionado:</strong> {horarioSelected}h
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Legenda */}
      <div className="calendario-legenda">
        <div className="legenda-item">
          <span className="legenda-livre">✓</span>
          <span>Dia com disponibilidade</span>
        </div>
        <div className="legenda-item">
          <span className="legenda-reservado">🔴</span>
          <span>Dia com reservas</span>
        </div>
        <div className="legenda-item">
          <span className="legenda-fechado">✕</span>
          <span>Fechado</span>
        </div>
      </div>

      {/* Informações de Horários */}
      <div className="info-funcionamento">
        <h4>⏰ Horários de Funcionamento</h4>
        <ul>
          <li><strong>Segunda a Sexta:</strong> 18h às 00h (meia-noite)</li>
          <li><strong>Sábado:</strong> 14h às 18h</li>
          <li><strong>Domingo:</strong> Fechado</li>
        </ul>
      </div>
    </div>
  );
}

export default ReservaCalendario;

/**
 * CONFIGURAÇÃO DE HORÁRIOS
 * Sistema de funcionamento Baião Society
 */

const HORARIOS_FUNCIONAMENTO = {
  0: { // Domingo
    aberto: false,
    nome: 'Domingo',
    mensagem: 'Fechado'
  },
  1: { // Segunda
    aberto: true,
    nome: 'Segunda-feira',
    inicio: '18:00',
    fim: '00:00',
    proximoDia: true // Termina no próximo dia (madrugada)
  },
  2: { // Terça
    aberto: true,
    nome: 'Terça-feira',
    inicio: '18:00',
    fim: '00:00',
    proximoDia: true
  },
  3: { // Quarta
    aberto: true,
    nome: 'Quarta-feira',
    inicio: '18:00',
    fim: '00:00',
    proximoDia: true
  },
  4: { // Quinta
    aberto: true,
    nome: 'Quinta-feira',
    inicio: '18:00',
    fim: '00:00',
    proximoDia: true
  },
  5: { // Sexta
    aberto: true,
    nome: 'Sexta-feira',
    inicio: '18:00',
    fim: '00:00',
    proximoDia: true
  },
  6: { // Sábado
    aberto: true,
    nome: 'Sábado',
    inicio: '14:00',
    fim: '18:00',
    proximoDia: false
  }
};

/**
 * Gera intervalos de horários disponíveis
 * Exemplo: 18:00, 19:00, 20:00, etc
 */
function gerarIntervalosHorarios(diaSemanaPrimeiro) {
  const config = HORARIOS_FUNCIONAMENTO[diaSemanaPrimeiro];
  
  if (!config.aberto) {
    return [];
  }

  const intervalos = [];
  const [horaInicio, minInicio] = config.inicio.split(':').map(Number);
  const [horaFim, minFim] = config.fim.split(':').map(Number);

  let hora = horaInicio;
  
  // Se termina no próximo dia (00:00 = meia-noite)
  const horaFimAjustada = config.proximoDia ? 24 : horaFim;

  while (hora < horaFimAjustada) {
    const horarioFormatado = `${String(hora).padStart(2, '0')}:00`;
    intervalos.push(horarioFormatado);
    hora++;
  }

  return intervalos;
}

/**
 * Valida se um horário está dentro do funcionamento
 */
function validarHorarioFuncionamento(dia, hora) {
  const diaSemanaPrimeiro = new Date(dia).getDay();
  const config = HORARIOS_FUNCIONAMENTO[diaSemanaPrimeiro];

  if (!config.aberto) {
    return false;
  }

  const [horaRequest] = hora.split(':').map(Number);
  const [horaInicio] = config.inicio.split(':').map(Number);
  const [horaFim] = config.fim.split(':').map(Number);

  if (config.proximoDia) {
    // Se termina no próximo dia, aceita de 18h até 23h
    return horaRequest >= horaInicio && horaRequest < 24;
  } else {
    return horaRequest >= horaInicio && horaRequest < horaFim;
  }
}

/**
 * Obtém o nome do dia da semana
 */
function getNomeDia(data) {
  const dia = new Date(data).getDay();
  return HORARIOS_FUNCIONAMENTO[dia].nome;
}

module.exports = {
  HORARIOS_FUNCIONAMENTO,
  gerarIntervalosHorarios,
  validarHorarioFuncionamento,
  getNomeDia
};

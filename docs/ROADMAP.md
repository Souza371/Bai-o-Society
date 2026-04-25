# 📋 Roadmap de Desenvolvimento - Baião Society

## 🗓️ Timeline Completa

```
APRIL 2026
│
├─ WEEK 1-2 (FOUNDATION)
│  ├─ ✅ Setup inicial
│  ├─ ✅ Banco de dados
│  ├─ ✅ Documentação técnica
│  └─ 🔨 Autenticação (login/register)
│
├─ WEEK 3-4 (CORE - SUPER IMPORTANTE)
│  ├─ 🔨 Agenda Inteligente
│  │  ├─ Visualizar horários
│  │  ├─ Reservar quadra
│  │  ├─ ⚠️ Validação de conflito (CRITICAL)
│  │  ├─ Atualizar reserva
│  │  └─ Cancelar reserva
│  └─ 🔨 Frontend: Calendário + Modal
│
├─ WEEK 5-6 (BUSINESS)
│  ├─ 🔨 Gestão de Times (CRUD)
│  ├─ 🔨 Controle Financeiro
│  └─ 🔨 Pagamentos (registro + status)
│
├─ WEEK 7 (ANALYTICS)
│  ├─ 🔨 Dashboard Administrativo
│  ├─ 📊 Gráficos (faturamento, ocupação)
│  └─ 📈 Relatórios
│
├─ WEEK 8 (DIFERENCIAL)
│  ├─ 🔨 Ranking Baião Society
│  ├─ 🏆 Mural de campeões
│  └─ 💅 Polish visual
│
└─ WEEK 9-10 (DEPLOY & FINALIZE)
   ├─ ✅ Testes
   ├─ ✅ Deploy Vercel (frontend)
   ├─ ✅ Deploy Railway (backend)
   ├─ ✅ Deploy Neon (database)
   └─ 📚 Documentação final
```

---

## 📊 Breakdown por Fase

### FASE 1: FOUNDATION (Semana 1-2)

**Objetivo:** Sistema com login funcionando

| Tarefa | Prioridade | Tempo | Status |
|--------|-----------|-------|--------|
| Setup Node + npm | ALTA | 30min | ⏳ |
| Criar estrutura de pastas | ALTA | 1h | ⏳ |
| Inicializar git | ALTA | 15min | ⏳ |
| Criar PostgreSQL local | ALTA | 1h | ⏳ |
| Escrever migrations | ALTA | 3h | ⏳ |
| Criar models (Sequelize) | ALTA | 2h | ⏳ |
| Auth controller (register) | ALTA | 2h | ⏳ |
| Auth controller (login) | ALTA | 2h | ⏳ |
| JWT middleware | ALTA | 1h | ⏳ |
| Frontend: Login page | ALTA | 2h | ⏳ |
| Frontend: Register page | ALTA | 2h | ⏳ |
| Testes básicos | MÉDIA | 2h | ⏳ |

**Resultado esperado:**
- ✅ Usuário consegue cadastrar-se
- ✅ Usuário consegue fazer login
- ✅ Token JWT gerado e validado
- ✅ Sessão persistente

---

### FASE 2: CORE - AGENDA INTELIGENTE (Semana 3-4) 🎯

**CRÍTICO:** Esta é a feature mais importante

| Tarefa | Prioridade | Tempo | Status |
|--------|-----------|-------|--------|
| Model Quadra | CRÍTICA | 1h | ⏳ |
| Model Reserva | CRÍTICA | 2h | ⏳ |
| **Validar conflito horário** | 🔴 MÁXIMA | 4h | ⏳ |
| Criar reserva (controller) | CRÍTICA | 2h | ⏳ |
| Listar reservas | ALTA | 2h | ⏳ |
| Atualizar reserva | ALTA | 1.5h | ⏳ |
| Cancelar reserva | ALTA | 1h | ⏳ |
| Horários disponíveis (endpoint) | ALTA | 2h | ⏳ |
| Frontend: Calendário semanal | ALTA | 4h | ⏳ |
| Frontend: Modal de reserva | ALTA | 3h | ⏳ |
| Frontend: Feedback validação | ALTA | 2h | ⏳ |
| Testes validação (crítico!) | ALTA | 3h | ⏳ |

**Resultado esperado:**
- ✅ Admin vê calendário com todas as reservas
- ✅ Cliente consegue fazer reserva
- ✅ Sistema **impede** horários duplicados
- ✅ Horários livres aparecem em tempo real
- ✅ Mensagens de erro clara em conflito

**⚠️ Teste este cenário:**
```
1. João tenta reservar Quadra 1 - 2026-04-25 de 14:00 a 15:00
2. Maria tenta reservar a MESMA quadra, a MESMA data, de 14:30 a 15:30
3. Sistema deve rejeitar Maria com: "Horário já reservado"
```

---

### FASE 3: BUSINESS (Semana 5-6)

| Tarefa | Prioridade | Tempo | Status |
|--------|-----------|-------|--------|
| Model Time | ALTA | 1.5h | ⏳ |
| Model Jogador | ALTA | 1.5h | ⏳ |
| CRUD Times | ALTA | 3h | ⏳ |
| Adicionar jogador a time | ALTA | 2h | ⏳ |
| Model Pagamento | ALTA | 1.5h | ⏳ |
| Registrar pagamento | ALTA | 2h | ⏳ |
| Confirmar pagamento (admin) | ALTA | 1.5h | ⏳ |
| Frontend: Times page | ALTA | 3h | ⏳ |
| Frontend: Pagamentos page | ALTA | 3h | ⏳ |
| Testes | MÉDIA | 2h | ⏳ |

**Resultado esperado:**
- ✅ Admin gerencia times
- ✅ Admin vê pagamentos pendentes
- ✅ Pagamentos refletem em faturamento

---

### FASE 4: ANALYTICS (Semana 7)

| Tarefa | Prioridade | Tempo | Status |
|--------|-----------|-------|--------|
| Dashboard endpoint | ALTA | 3h | ⏳ |
| Indicadores (faturamento, etc) | ALTA | 2.5h | ⏳ |
| Gráfico faturamento | ALTA | 2.5h | ⏳ |
| Gráfico ocupação | ALTA | 2h | ⏳ |
| Frontend: Dashboard | ALTA | 4h | ⏳ |
| Responsivo | MÉDIA | 1h | ⏳ |

**Resultado esperado:**
- ✅ Admin vê faturamento do mês em tempo real
- ✅ Gráfico de ocupação da quadra
- ✅ Dashboard atualiza automaticamente

---

### FASE 5: DIFERENCIAL (Semana 8)

| Tarefa | Prioridade | Tempo | Status |
|--------|-----------|-------|--------|
| Model Rankings | MÉDIA | 1.5h | ⏳ |
| Lógica de scoring | MÉDIA | 2.5h | ⏳ |
| Ranking artilheiros | MÉDIA | 2h | ⏳ |
| Ranking times | MÉDIA | 2h | ⏳ |
| Frontend: Ranking page | MÉDIA | 3h | ⏳ |
| Mural de campeões | BAIXA | 2h | ⏳ |
| Polish visual | BAIXA | 2h | ⏳ |

**Resultado esperado:**
- ✅ Artilheiro da semana
- ✅ Mural de campeões (marketing)
- ✅ Sistema completo e bonito

---

### FASE 6: DEPLOY & FINALIZE (Semana 9-10)

| Tarefa | Prioridade | Tempo | Status |
|--------|-----------|-------|--------|
| Testes (coverage 80%+) | ALTA | 4h | ⏳ |
| Documentação API (Swagger) | MÉDIA | 2h | ⏳ |
| Deploy frontend (Vercel) | ALTA | 1h | ⏳ |
| Deploy backend (Railway) | ALTA | 1.5h | ⏳ |
| Deploy database (Neon) | ALTA | 1h | ⏳ |
| Testes em produção | ALTA | 2h | ⏳ |
| Documento final + apresentação | ALT | 3h | ⏳ |

**Resultado esperado:**
- ✅ Sistema online e acessível
- ✅ Dono do Baião Society consegue usar
- ✅ Professor fica impressionado

---

## 🎯 Marcos Importantes

| Marco | Data | Objetivo |
|-------|------|----------|
| **Autenticação OK** | Fim Week 2 | Login funcionando |
| **Agenda Pronta** | Fim Week 4 | Core do sistema 100% |
| **MVP Pronto** | Fim Week 6 | Sistema financeiro básico |
| **Analytics** | Fim Week 7 | Admin enxerga negócio |
| **Deploy** | Fim Week 10 | Sistema online |

---

## 🏆 Apresentação no Professor

**Argumento forte:**

> "Desenvolvemos um **software real** para o Baião Society que:
> - ✅ Eliminou reservas conflitantes (problema #1)
> - ✅ Centraliza todas as informações
> - ✅ Gera relatórios de faturamento
> - ✅ É **100% utilizável** por um negócio real
> - ✅ Demonstra conhecimento full-stack profissional"

**Slide com métricas:**
- 8 tabelas no BD
- 30+ endpoints API
- 15+ componentes React
- 2500+ linhas de código

---

## ⚠️ Riscos & Contingência

| Risco | Impacto | Contingência |
|-------|---------|-------------|
| Validação horários complexa | ALTO | Começar fase 2 com muita antecedência |
| Permissões backend | MÉDIO | Use middleware simples primeiro |
| Deploy primeiro deploy | MÉDIO | Testar localmente bem antes |
| Banco de dados | MÉDIO | Usar PostgreSQL local primeiro |

---

## ✅ Checklist Final

- [ ] Todas as 6 fases completadas
- [ ] Tests passando (80%+ coverage)
- [ ] Zero erros no console
- [ ] Deploy rodando 24h+ sem crash
- [ ] Documentação atualizada
- [ ] Apresentação preparada
- [ ] Dono do Baião Society testou e aprovou
- [ ] Professor pediu para usar o sistema real

---

> **Mensagem importante:** Siga esta ordem. Não pule para fase posterior até completar a anterior. **FASE 2 é CRÍTICA** — invista tempo em validação de conflito.
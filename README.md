# ⚽ Baião Society — Sistema de Gestão de Quadras

> **Software real para um negócio real** — Sistema web completo para gestão digital de reservas de quadra, clientes e controle financeiro.

---

## 🎯 Objetivo

Substituir métodos manuais (WhatsApp, anotações) por um sistema web profissional que centralize:
- ✅ Reservas de quadra (sem conflitos)
- ✅ Gestão de times e jogadores
- ✅ Controle financeiro e faturamento
- ✅ Dashboard administrativo
- ✅ Ranking de campeões (diferencial marketing)

---

## 🧠 Problema Real

| Antes | Depois |
|-------|--------|
| Reservas via WhatsApp ❌ | Sistema centralizado ✅ |
| Controle manual de horários ❌ | Agenda automática ✅ |
| Horários duplicados ❌ | Validação + Bloqueio ✅ |
| Sem relatórios ❌ | Dashboard inteligente ✅ |
| Perda de clientes ❌ | Experiência profissional ✅ |

---

## 👥 Usuários

### 👑 Administrador (Dono)
- Criar/editar/deletar reservas
- Gerenciar quadras e horários
- Controlar pagamentos
- Visualizar relatórios e indicadores

### ⚽ Cliente
- Visualizar horários livres
- Realizar reservas
- Acompanhar histórico
- Gerenciar seu time (opcional)

---

## 🧩 Funcionalidades Core

### 1. **Autenticação & Segurança**
- Cadastro com validação
- Login com JWT
- Recuperação de senha
- Controle de perfis (admin/cliente)

### 2. **Agenda Inteligente** ⭐ CORE
- Calendário semanal interativo
- Visualização horários livres/ocupados
- Reserva com 1 clique
- Edição e cancelamento
- Bloqueio de horários (manutenção)
- **Validação automática**: impede duplicação

### 3. **Gestão de Times**
- Cadastro de times
- Capitão responsável
- Lista de jogadores
- Histórico de partidas

### 4. **Controle Financeiro**
- Registro de pagamentos
- Reservas pendentes
- Relatório mensal de faturamento
- Gráficos de receita

### 5. **Dashboard Administrativo**
- Faturamento do mês
- Ocupação da quadra (%)
- Horários mais alugados
- Clientes recorrentes
- Gráficos em tempo real

### 6. **Ranking Baião Society** 🏆 DIFERENCIAL
- Artilheiro da semana
- Time em destaque
- Mural de campeões
- 📱 Integra marketing do ginásio

### 7. **Interface Responsiva**
- Funciona em mobile, tablet, desktop
- Design amigável e intuitivo

---

## 🗄️ Banco de Dados

### Tabelas Principais

```
├── usuarios (id, email, senha, nome, perfil, criado_em)
├── quadras (id, nome, metragem, preco_hora, ativa)
├── reservas (id, quadra_id, usuario_id, data, hora_inicio, hora_fim, status)
├── pagamentos (id, reserva_id, valor, data_pagamento, metodo, status)
├── times (id, nome, capitao_id, criado_em)
├── jogadores (id, time_id, usuario_id, numero_camisa)
├── partidas (id, time_a_id, time_b_id, quadra_id, data, resultado)
└── rankings (id, usuario_id, gols, semana)
```

**Relacionamentos:**
- `usuarios` ↔ `reservas` (1:N)
- `usuarios` ↔ `times` (1:N - capitão)
- `times` ↔ `jogadores` (1:N)
- `quadras` ↔ `reservas` (1:N)
- `reservas` ↔ `pagamentos` (1:1)

---

## 🏗️ Arquitetura

```
frontend/                  # React / Vue.js
├── components/
│   ├── Agenda/
│   ├── Dashboard/
│   ├── Times/
│   └── Pagamentos/
├── pages/
├── services/             # Chamadas API
└── utils/

backend/                  # Node.js + Express / Python + Django / Java
├── routes/              # API REST endpoints
├── controllers/          # Lógica de negócio
├── models/              # Modelos de dados
├── middleware/          # Autenticação, validação
├── services/            # Regras de negócio
└── database/            # Schema SQL, migrations

docs/                    # Documentação técnica
├── ARQUITETURA.md
├── API.md
├── BANCO_DE_DADOS.md
└── GUIA_DESENVOLVIMENTO.md
```

---

## 🌐 API REST (Exemplos)

```
Autenticação:
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/refresh-token

Agenda (CORE):
  GET    /api/reservas?data=2026-04-25&quadra_id=1
  POST   /api/reservas
  PUT    /api/reservas/:id
  DELETE /api/reservas/:id

Quadras:
  GET    /api/quadras
  GET    /api/quadras/:id/horarios-livres

Times:
  GET    /api/times
  POST   /api/times
  GET    /api/times/:id/jogadores

Pagamentos:
  POST   /api/pagamentos
  GET    /api/pagamentos/:id

Dashboard:
  GET    /api/dashboard/indicadores
  GET    /api/dashboard/faturamento
  GET    /api/dashboard/ocupacao

Rankings:
  GET    /api/ranking/artilheiros?semana=17
  GET    /api/ranking/times
```

---

## 🗺️ Roadmap de Desenvolvimento

### **Fase 1: Foundation** (Semana 1-2)
- [ ] Setup do projeto
- [ ] Banco de dados (criação + migrations)
- [ ] Autenticação (registro/login)
- [ ] Model de usuários

### **Fase 2: Core** (Semana 3-4)
- [ ] Modelo de Quadras
- [ ] **Agenda Inteligente** (CORE DO SISTEMA)
  - Visualizar horários
  - Reservar quadra
  - Validação + Bloqueio de duplicação
- [ ] API REST para reservas

### **Fase 3: Business** (Semana 5-6)
- [ ] Gestão de Times
- [ ] Controle Financeiro
- [ ] Pagamentos (status)

### **Fase 4: Analytics** (Semana 7)
- [ ] Dashboard Administrativo
- [ ] Gráficos e indicadores
- [ ] Relatórios

### **Fase 5: Diferencial** (Semana 8)
- [ ] Ranking Baião Society
- [ ] Mural de campeões

### **Fase 6: Polish** (Semana 9-10)
- [ ] Frontend responsivo
- [ ] Testes
- [ ] Deploy online
- [ ] Documentação final

---

## 🚀 Como Começar

### 1. Clonar e instalar
```bash
git clone https://github.com/Souza371/Bai-o-Society.git
cd Bai-o-Society
npm install
```

### 2. Configurar banco de dados
```bash
npm run db:init
```

### 3. Rodar servidor
```bash
npm run dev
```

### 4. Acessar
```
Frontend: http://localhost:3000
API: http://localhost:5000
```

---

## 🎓 Por Que Esse Projeto é Forte

✅ **Realista**: Usado por um negócio real  
✅ **Completo**: Full-stack (BD, API, frontend)  
✅ **Escalável**: Arquitetura profissional  
✅ **Pragmático**: Resolve problema específico  
✅ **Portfolio**: Demonstra habilidades sênior  

**Frase-chave na apresentação:**
> "Desenvolvemos um sistema real utilizado pelo Baião Society para otimizar a gestão operacional de quadras, resultando em eliminação de conflitos de horário e aumento de organização."

---

## 📚 Documentação

- [ARQUITETURA.md](docs/ARQUITETURA.md) — Decisões técnicas e padrões
- [BANCO_DE_DADOS.md](docs/BANCO_DE_DADOS.md) — Schema completo
- [API.md](docs/API.md) — Endpoints detalhados
- [GUIA_DESENVOLVIMENTO.md](docs/GUIA_DESENVOLVIMENTO.md) — Passo a passo

---

## 💻 Stack Recomendado

**Frontend:**
- React / Vue.js
- Tailwind CSS
- Axios

**Backend:**
- Node.js + Express (OU Python + Django/Flask)
- PostgreSQL / MySQL
- JWT para autenticação

**Deploy:**
- Vercel (frontend)
- Railway / Neon (backend + DB)

---

## 🤝 Contribuindo

Este é um projeto acadêmico/real — pull requests e melhorias são bem-vindas!

---

## 📄 Licença

MIT

---

## 👨‍💻 Autor

**Seu Nome** — Desenvolvedor Full-Stack  
Projeto: Baião Society  
Data: Abril 2026

---

> *"O melhor código é aquele que resolve um problema real."* ⚽🚀
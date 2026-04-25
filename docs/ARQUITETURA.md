# 🏗️ Arquitetura Baião Society

## Visão Geral

Projeto **full-stack** estruturado em 3 camadas:

```
┌─────────────────────┐
│   FRONTEND (React)  │  Interface web responsiva
├─────────────────────┤
│   API REST (Node)   │  Endpoints de negócio
├─────────────────────┤
│  PostgreSQL (BD)    │  Dados persistentes
└─────────────────────┘
```

---

## 📁 Estrutura de Pastas

```
Bai-o-Society/
│
├── frontend/                    # Cliente React
│   ├── public/
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── Agenda/
│   │   │   │   ├── Calendario.jsx
│   │   │   │   ├── ReservaModal.jsx
│   │   │   │   └── ValidacaoHorario.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── IndicadoresCard.jsx
│   │   │   │   ├── GraficoFaturamento.jsx
│   │   │   │   └── GraficoOcupacao.jsx
│   │   │   ├── Times/
│   │   │   ├── Pagamentos/
│   │   │   └── Common/
│   │   │       ├── Header.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       └── Loading.jsx
│   │   ├── pages/               # Páginas principais
│   │   │   ├── LoginPage.jsx
│   │   │   ├── AgendaPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── TimesPage.jsx
│   │   │   ├── RankingPage.jsx
│   │   │   └── PagamentosPage.jsx
│   │   ├── services/            # Serviços API
│   │   │   ├── api.js           # Configuração Axios
│   │   │   ├── authService.js
│   │   │   ├── reservasService.js
│   │   │   ├── timesService.js
│   │   │   ├── pagamentosService.js
│   │   │   └── dashboardService.js
│   │   ├── utils/               # Utilidades
│   │   │   ├── dateHelper.js
│   │   │   ├── validators.js
│   │   │   └── constants.js
│   │   ├── hooks/               # Custom Hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useReservas.js
│   │   │   └── useFetch.js
│   │   ├── context/             # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── package.json
│   └── .env.example
│
├── backend/                     # API Node.js + Express
│   ├── src/
│   │   ├── routes/              # Rotas da API
│   │   │   ├── authRoutes.js
│   │   │   ├── reservasRoutes.js
│   │   │   ├── quadrasRoutes.js
│   │   │   ├── timesRoutes.js
│   │   │   ├── pagamentosRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   └── rankingRoutes.js
│   │   ├── controllers/         # Lógica de negócio
│   │   │   ├── authController.js
│   │   │   ├── reservasController.js
│   │   │   ├── quadrasController.js
│   │   │   ├── timesController.js
│   │   │   ├── pagamentosController.js
│   │   │   ├── dashboardController.js
│   │   │   └── rankingController.js
│   │   ├── models/              # Modelos (Sequelize/TypeORM)
│   │   │   ├── Usuario.js
│   │   │   ├── Reserva.js
│   │   │   ├── Quadra.js
│   │   │   ├── Time.js
│   │   │   ├── Pagamento.js
│   │   │   ├── Jogador.js
│   │   │   └── Ranking.js
│   │   ├── middleware/          # Middlewares
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorHandler.js
│   │   │   ├── validation.js
│   │   │   └── cors.js
│   │   ├── services/            # Serviços (regras de negócio)
│   │   │   ├── authService.js
│   │   │   ├── reservasService.js
│   │   │   ├── validacaoHorarios.js  # CORE
│   │   │   ├── pagamentosService.js
│   │   │   ├── timesService.js
│   │   │   └── rankingService.js
│   │   ├── database/
│   │   │   ├── config.js        # Configuração DB
│   │   │   ├── seeders/         # Dados iniciais
│   │   │   └── migrations/      # Schema versioning
│   │   ├── utils/
│   │   │   ├── logger.js
│   │   │   ├── jwt.js
│   │   │   └── hash.js
│   │   ├── tests/               # Testes unitários
│   │   │   ├── reservas.test.js
│   │   │   ├── validacao.test.js
│   │   │   └── auth.test.js
│   │   ├── app.js               # Configuração Express
│   │   └── server.js            # Entry point
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── docs/                        # Documentação técnica
│   ├── ARQUITETURA.md           # Este arquivo
│   ├── BANCO_DE_DADOS.md
│   ├── API.md
│   ├── GUIA_DESENVOLVIMENTO.md
│   └── FLUXO_RESERVAS.md
│
├── .gitignore
├── .env.example
└── README.md
```

---

## 🔄 Fluxo de Dados

### Exemplo: Criar Reserva

```
1. Frontend (React)
   ↓
   ReservaModal.jsx captura dados
   ↓
   reservasService.post("/reservas", {data, hora, quadra})
   ↓

2. Backend (Express)
   ↓
   POST /api/reservas
   ↓
   reservasController.criar()
   ↓
   validacaoHorarios.verificarConflito()  ← VALIDAÇÃO CORE
   ↓
   Se OK: pagamentosService.criarPendente()
   ↓
   Salva em BD
   ↓
   Retorna JSON {id, status: "confirmada"}
   ↓

3. Frontend recebe resposta
   ↓
   Atualiza calendario
   ↓
   Toast: "Reserva realizada com sucesso!" ✅
```

---

## 🔐 Autenticação & Segurança

### JWT Flow

```
1. Usuario faz login
   POST /api/auth/login {email, senha}
   
2. Backend verifica credenciais
   hash(senha_usuario) == hash armazenado?
   
3. Se OK: gera JWT
   token = sign({userId, perfil}, SECRET, {expiresIn: "7d"})
   
4. Frontend armazena token (localStorage)
   localStorage.setItem("token", token)
   
5. Próximas requisições incluem token
   GET /api/reservas
   Header: "Authorization: Bearer {token}"
   
6. Backend valida token
   Middleware authMiddleware.js verifica assinatura
   
7. Se válido: continua a requisição
   Se inválido: retorna 401 Unauthorized
```

### Perfis & Permissões

```javascript
// No banco: usuarios.perfil = "admin" | "cliente"

// Middleware de autorização
authMiddleware.requireAdmin (req, res, next) {
  if (req.user.perfil !== "admin") {
    return res.status(403).json({error: "Acesso negado"});
  }
  next();
}

// Uso em rotas
router.delete("/reservas/:id", authMiddleware.authenticate, authMiddleware.requireAdmin, deleteReserva);
```

---

## 💾 Banco de Dados

**SGBD:** PostgreSQL (recomendado) ou MySQL

**ORM:** Sequelize ou TypeORM

### Relacionamentos Principais

```
USUARIOS (id, email, senha_hash, nome, perfil)
  ├─ 1:N → RESERVAS
  ├─ 1:N → TIMES (como capitão)
  └─ 1:1 → JOGADORES (usuário que é jogador)

QUADRAS (id, nome, metragem, preco_hora)
  └─ 1:N → RESERVAS

RESERVAS (id, quadra_id, usuario_id, data, hora_inicio, status)
  ├─ N:1 ← USUARIOS
  ├─ N:1 ← QUADRAS
  └─ 1:1 → PAGAMENTOS

PAGAMENTOS (id, reserva_id, valor, status, metodo)
  └─ 1:1 ← RESERVAS

TIMES (id, nome, capitao_id, criado_em)
  ├─ 1:N → JOGADORES
  └─ N:M → PARTIDAS

JOGADORES (id, time_id, usuario_id, numero_camisa)
  ├─ N:1 ← TIMES
  └─ N:1 ← USUARIOS

PARTIDAS (id, time_a_id, time_b_id, quadra_id, data, resultado)
  ├─ N:1 ← TIMES (time_a)
  ├─ N:1 ← TIMES (time_b)
  └─ N:1 ← QUADRAS

RANKINGS (id, usuario_id, gols, semana, ano)
  └─ N:1 ← USUARIOS
```

---

## 🌐 API REST - Padrões

### Convenções

```
POST   /api/resource       → Criar
GET    /api/resource       → Listar
GET    /api/resource/:id   → Buscar um
PUT    /api/resource/:id   → Atualizar
DELETE /api/resource/:id   → Deletar
```

### Respostas Padrão

**Sucesso (200):**
```json
{
  "status": "success",
  "data": { /* ... */ }
}
```

**Erro (400, 500, etc):**
```json
{
  "status": "error",
  "message": "Descrição do erro",
  "code": "ERRO_CODE"
}
```

---

## 🧪 Testes

### Backend

```bash
# Testes unitários
npm run test

# Cobertura
npm run test:coverage

# Testes e2e
npm run test:e2e
```

**Focus areas:**
- ✅ Validação de horários (CORE)
- ✅ Autenticação (JWT)
- ✅ Cálculo de faturamento

### Frontend

```bash
# Com Jest + React Testing Library
npm run test

# No navegador
npm run test:watch
```

---

## 🚀 Deploy

### Frontend (Vercel)

```bash
vercel deploy
```

### Backend (Railway / Heroku)

```bash
git push heroku main
```

### Database (Neon / AWS RDS)

```bash
# Rodas migrations em staging
npm run migrate:prod
```

---

## 🔍 Monitoramento

- **Logs:** Winston ou Bunyan
- **Erros:** Sentry
- **APM:** New Relic (opcional)
- **BD:** Índices em colunas frequency (data, quadra_id, usuario_id)

---

## 📊 Performance

### Otimizações

1. **Frontend:**
   - Lazy loading de componentes
   - Caching com React Query
   - Code splitting por rota

2. **Backend:**
   - Índice em `reservas(quadra_id, data, hora_inicio)`
   - Cache em memória para horários disponíveis
   - Paginação em listagens

3. **Database:**
   - Queries otimizadas com EXPLAIN ANALYZE
   - Connection pooling
   - Read replicas para dashboards (opcional)

---

## 🎯 Próximos Passos

1. ✅ Revisar arquitetura
2. ✅ Setup inicial (package.json, .env)
3. → Implementar banco de dados
4. → Criar autenticação
5. → Build agenda inteligente
6. → Deploy inicial

---

> **Nota:** Esta arquitetura segue padrões enterprise e escala bem para 100k+ usuários.
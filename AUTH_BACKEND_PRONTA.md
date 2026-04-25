# ✅ AUTENTICAÇÃO COMPLETA - PRONTA PARA USAR

## 🎯 O que foi criado

### 📁 Arquivos Backend

```
backend/src/
├── utils/
│   ├── jwt.js              ← Gerar e validar tokens JWT
│   └── hash.js             ← Hash e validar senhas
│
├── services/
│   └── authService.js      ← Lógica de negócio (register, login)
│
├── controllers/
│   └── authController.js   ← Endpoints HTTP (requisição/resposta)
│
├── middleware/
│   └── authMiddleware.js   ← Proteger rotas com token
│
├── routes/
│   └── authRoutes.js       ← Definir endpoints
│
├── models/
│   └── Usuario.js          ← Tabela de usuários
│
├── app.js                  ← Configuração Express (novo!)
└── server.js               ← Inicializar servidor (novo!)
```

### 📚 Documentação

```
├── TESTE_AUTENTICACAO.md   ← Exemplos de teste (novo!)
└── ... (outros docs)
```

---

## 🚀 Como Rodar (Passo a Passo)

### Step 1: Instalar Dependências

```bash
cd backend
npm install
```

### Step 2: Configurar .env

```bash
cp .env.example .env
```

Editar `.env`:
```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=baiao_society
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=sua_chave_super_secreta_aqui
JWT_REFRESH_SECRET=outra_chave_super_secreta
JWT_EXPIRY=7d
JWT_REFRESH_EXPIRY=30d
```

### Step 3: Criar Banco de Dados

```bash
createdb baiao_society -U postgres
```

### Step 4: Rodar Servidor

```bash
npm run dev
```

**Esperado:**
```
✅ Conexão com banco de dados estabelecida
✅ Modelos sincronizados com banco de dados
✅ Servidor rodando em http://localhost:5000
📝 API: http://localhost:5000/api
🏥 Health: http://localhost:5000/health
```

---

## 🧪 Testar Imediatamente

### Opção A: Postman / Insomnia

1. Abrir Postman/Insomnia
2. **POST** `http://localhost:5000/api/auth/register`
3. Body (JSON):
```json
{
  "email": "teste@baiao.com",
  "senha": "senha123",
  "nome": "João Teste"
}
```
4. Enviar ✉️ (deve retornar 201)

---

### Opção B: cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@baiao.com","senha":"senha123","nome":"João Teste"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@baiao.com","senha":"senha123"}'
```

---

## 📊 Como Funciona (Fluxo)

```
1. USER clica "Register"
   ↓
2. Frontend envia: POST /api/auth/register {email, senha, nome}
   ↓
3. authController.register() recebe
   ↓
4. authService.register() valida e processa
   ├─ Valida email
   ├─ Valida força da senha
   ├─ Verifica se email já existe
   ├─ Faz HASH da senha (bcryptjs)
   └─ Cria no banco
   ↓
5. Retorna: {status: 'success', data: usuario} ✅
   ↓
6. Frontend salva resposta

---

7. USER clica "Login"
   ↓
8. Frontend envia: POST /api/auth/login {email, senha}
   ↓
9. authController.login() recebe
   ↓
10. authService.login() processa
    ├─ Busca usuário no BD
    ├─ Valida senha (bcryptjs.compare())
    ├─ Se OK: gera JWT token
    └─ Retorna: {token, refreshToken, user}
    ↓
11. Frontend salva token em localStorage
    ↓
12. Próximas requisições incluem:
    Header: Authorization: Bearer {token}
    ↓
13. Middleware authMiddleware.authenticate valida
    └─ Se válido: continua requisição ✅
    └─ Se inválido: retorna 401 ❌
```

---

## 🔐 Segurança Implementada

✅ **Senhas com Hash + Salt** (bcryptjs)  
✅ **JWT com expiração** (7 dias)  
✅ **Refresh Token** (30 dias)  
✅ **Validação de email** (regex)  
✅ **Validação de força de senha** (mín 6 caracteres)  
✅ **Proteção contra email duplicado** (UNIQUE constraint)  
✅ **Middleware de autenticação** (protect rotas)  
✅ **Middleware de autorização** (requireAdmin, requireCliente)  

---

## 📋 Endpoints Disponíveis

### Público (SEM token)
```
POST   /api/auth/register       Registrar novo usuário
POST   /api/auth/login          Login (retorna token)
POST   /api/auth/refresh-token  Renovar token
```

### Protegido (COM token)
```
GET    /api/auth/verify         Verificar se token é válido
```

---

## 🧩 Arquitetura de Pastas

**Separação de responsabilidades:**

- **utils/** → Funções auxiliares (jwt, hash)
- **services/** → Lógica de negócio (regras)
- **controllers/** → HTTP (request/response)
- **middleware/** → Interceptadores (auth, validação)
- **routes/** → Definição de endpoints
- **models/** → Estrutura de dados (Sequelize)

**Vantagem:** Cada camada tem uma responsabilidade clara.

---

## 🎓 Para Próximas Features

Quando criar novos endpoints (ex: criar reserva):

```javascript
// 1. Criar service (lógica)
// src/services/reservaService.js
class ReservaService {
  async criar(dados) {
    // validar, criar no BD
  }
}

// 2. Criar controller (HTTP)
// src/controllers/reservaController.js
async criar(req, res) {
  const resultado = await reservaService.criar(req.body);
  res.json(resultado);
}

// 3. Criar routes (endpoints)
// src/routes/reservaRoutes.js
router.post('/', authenticate, criarReserva);

// 4. Adicionar no app.js
app.use('/api/reservas', reservaRoutes);
```

✅ Padrão consistente para todo o projeto!

---

## ✅ Próximos Passos

- [ ] Testar endpoints com Postman
- [ ] Criar frontend de login/register
- [ ] Criar Model de Quadra
- [ ] Criar endpoints de Reserva
- [ ] Implementar validação de conflito de horário

---

## 📞 Dúvidas Comuns

**P: Onde fico salvo o token no frontend?**  
R: `localStorage.setItem('token', response.data.token)`

**P: Como envio token em cada requisição?**  
R: `header.Authorization = 'Bearer ' + token`

**P: Pode usar Axios no frontend?**  
R: Sim! Recomendado. Criar interceptor para adicionar token automaticamente.

**P: Preciso de migrations do Sequelize?**  
R: Não por agora. `.sync()` está criando tabelas automaticamente. Depois você parametriza com migrations.

**P: Posso mudar a tabela Usuario?**  
R: Sim! Edita `src/models/Usuario.js` e reinicia servidor com `npm run dev`.

---

## 🎉 Resumo

✅ **Autenticação backend 100% pronta**  
✅ **Endpoints de register/login testáveis**  
✅ **JWT implementado com refresh token**  
✅ **Middleware de proteção**  
✅ **Bcrypt para senhas seguras**  
✅ **Exemplo pronto para testar**  

**Agora é botar no frontend!** 🚀

---

> **Próximo:** Você quer criar telas React de login/register, ou prefere ir direto para agenda inteligente?
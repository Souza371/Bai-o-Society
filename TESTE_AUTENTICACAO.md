# 🧪 Como Testar a Autenticação

**Você pode testar de 2 formas:**

## Opção 1: Postman / Insomnia

### 1. Registrar Novo Usuário

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "teste@baiao.com",
  "senha": "senha123",
  "nome": "João Teste",
  "telefone": "11999999999"
}
```

**Resposta esperada (201):**
```json
{
  "status": "success",
  "message": "Usuário criado com sucesso",
  "data": {
    "id": 1,
    "email": "teste@baiao.com",
    "nome": "João Teste",
    "telefone": "11999999999",
    "perfil": "cliente"
  }
}
```

---

### 2. Login

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "teste@baiao.com",
  "senha": "senha123"
}
```

**Resposta esperada (200):**
```json
{
  "status": "success",
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "teste@baiao.com",
      "nome": "João Teste",
      "perfil": "cliente"
    },
    "expiresIn": 604800
  }
}
```

---

### 3. Usar Token nas Próximas Requisições

Copiar o `token` e usar no header:

```http
GET http://localhost:5000/api/auth/verify
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta (200):**
```json
{
  "status": "success",
  "message": "Token válido",
  "user": {
    "userId": 1,
    "email": "teste@baiao.com",
    "perfil": "cliente"
  }
}
```

---

### 4. Refresh Token

```http
POST http://localhost:5000/api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Resposta (200):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800
  }
}
```

---

## Opção 2: cURL (Linha de Comando)

### Registrar
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@baiao.com",
    "senha": "senha123",
    "nome": "João Teste",
    "telefone": "11999999999"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@baiao.com",
    "senha": "senha123"
  }' | jq
```

### Verificar Token
```bash
TOKEN="seu_token_aqui"
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

---

## Opção 3: Node.js Script

Crie arquivo `test-auth.js`:

```javascript
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api/auth';

async function testarAuth() {
  try {
    // 1. Registrar
    console.log('📝 Registrando usuário...');
    const registerRes = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teste@baiao.com',
        senha: 'senha123',
        nome: 'João Teste'
      })
    });
    
    const registerData = await registerRes.json();
    console.log('✅ Registro:', registerData);

    // 2. Login
    console.log('\n🔑 Fazendo login...');
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teste@baiao.com',
        senha: 'senha123'
      })
    });

    const loginData = await loginRes.json();
    console.log('✅ Login:', loginData);
    const { token } = loginData.data;

    // 3. Verificar token
    console.log('\n🔐 Verificando token...');
    const verifyRes = await fetch(`${BASE_URL}/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const verifyData = await verifyRes.json();
    console.log('✅ Token válido:', verifyData);

  } catch (erro) {
    console.error('❌ Erro:', erro.message);
  }
}

testarAuth();
```

Rodar:
```bash
node test-auth.js
```

---

## 🧪 Testes de Erro

### Email Inválido
```json
{
  "status": "error",
  "message": "Email inválido",
  "code": "EMAIL_INVALIDO"
}
```

### Senha Fraca (<6 caracteres)
```json
{
  "status": "error",
  "message": "Senha deve ter no mínimo 6 caracteres",
  "code": "SENHA_FRACA"
}
```

### Email Já Cadastrado
```json
{
  "status": "error",
  "message": "Email já cadastrado",
  "code": "EMAIL_EXISTE"
}
```

### Credenciais Inválidas
```json
{
  "status": "error",
  "message": "Credenciais inválidas",
  "code": "CREDENCIAIS_INVALIDAS"
}
```

### Token Inválido/Expirado
```json
{
  "status": "error",
  "message": "Token inválido ou expirado",
  "code": "TOKEN_INVALIDO"
}
```

---

## ✅ Checklist de Testes

- [ ] Registrar novo usuário (201)
- [ ] Tentar registrar com email inválido (400)
- [ ] Tentar registrar com senha curta (400)
- [ ] Tentar registrar email duplicado (409)
- [ ] Login com credenciais corretas (200)
- [ ] Login com email errado (401)
- [ ] Login com senha errada (401)
- [ ] Usar token válido em /verify (200)
- [ ] Usar token inválido (401)
- [ ] Refresh token válido (200)
- [ ] Refresh token inválido (401)

---

> **Dica:** Salve o token em variável de ambiente no Postman/Insomnia para usar em outras requisições!
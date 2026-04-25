# 🌐 API REST - Documentação Completa

**Base URL:** `http://localhost:5000/api` (desenvolvimento)  
**Versão:** v1.0  
**Formato:** JSON

---

## 🔑 Autenticação

Todas as rotas (exceto login/register) requerem header:

```
Authorization: Bearer {JWT_TOKEN}
```

---

## 📝 Endpoints

### 🔐 **1. AUTENTICAÇÃO**

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "joao@example.com",
  "senha": "senha123",
  "nome": "João Silva",
  "telefone": "11999999999"
}

Response (201):
{
  "status": "success",
  "message": "Usuário criado com sucesso",
  "data": {
    "id": 1,
    "email": "joao@example.com",
    "nome": "João Silva",
    "perfil": "cliente"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "senha": "senha123"
}

Response (200):
{
  "status": "success",
  "data": {
    "token": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": {
      "id": 1,
      "email": "joao@example.com",
      "nome": "João Silva",
      "perfil": "cliente"
    }
  }
}
```

#### Refresh Token
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}

Response (200):
{
  "status": "success",
  "data": {
    "token": "eyJhbGc...",
    "expiresIn": 3600
  }
}
```

---

### 📅 **2. AGENDA (CORE)**

#### Listar Reservas (com filtros)
```http
GET /reservas?data=2026-04-25&quadra_id=1&status=confirmada
Authorization: Bearer {token}

Response (200):
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "quadra_id": 1,
      "quadra_nome": "Quadra 1 - Futsal",
      "usuario_id": 5,
      "usuario_nome": "João Silva",
      "data": "2026-04-25",
      "hora_inicio": "14:00",
      "hora_fim": "15:00",
      "status": "confirmada",
      "observacoes": "Time A vs Time B"
    },
    {
      "id": 2,
      "quadra_id": 1,
      "quadra_nome": "Quadra 1 - Futsal",
      "usuario_id": 6,
      "usuario_nome": "Maria Silva",
      "data": "2026-04-25",
      "hora_inicio": "15:00",
      "hora_fim": "16:00",
      "status": "confirmada"
    }
  ]
}
```

#### Criar Reserva (com Validação)
```http
POST /reservas
Authorization: Bearer {token}
Content-Type: application/json

{
  "quadra_id": 1,
  "data": "2026-04-25",
  "hora_inicio": "14:00",
  "hora_fim": "15:00",
  "observacoes": "Time A vs Time B"
}

Response (201):
{
  "status": "success",
  "message": "Reserva criada com sucesso",
  "data": {
    "id": 15,
    "quadra_id": 1,
    "usuario_id": 5,
    "data": "2026-04-25",
    "hora_inicio": "14:00",
    "hora_fim": "15:00",
    "status": "pendente",
    "criado_em": "2026-04-25T10:30:00Z"
  }
}

Error (409):
{
  "status": "error",
  "message": "Horário já reservado nesta quadra",
  "code": "CONFLITO_HORARIO"
}
```

#### Atualizar Reserva
```http
PUT /reservas/15
Authorization: Bearer {token}
Content-Type: application/json

{
  "data": "2026-04-26",
  "hora_inicio": "14:00",
  "hora_fim": "15:00"
}

Response (200):
{
  "status": "success",
  "message": "Reserva atualizada",
  "data": {
    "id": 15,
    "data": "2026-04-26",
    "hora_inicio": "14:00",
    "hora_fim": "15:00",
    "atualizado_em": "2026-04-25T11:00:00Z"
  }
}
```

#### Cancelar Reserva
```http
DELETE /reservas/15
Authorization: Bearer {token}

Response (200):
{
  "status": "success",
  "message": "Reserva cancelada"
}
```

#### Verificar Horários Livres
```http
GET /reservas/horarios-livres?quadra_id=1&data=2026-04-25
Authorization: Bearer {token}

Response (200):
{
  "status": "success",
  "data": [
    {
      "hora_inicio": "08:00",
      "hora_fim": "09:00",
      "disponivel": true
    },
    {
      "hora_inicio": "09:00",
      "hora_fim": "10:00",
      "disponivel": true
    },
    {
      "hora_inicio": "14:00",
      "hora_fim": "15:00",
      "disponivel": false,
      "reservado_por": "João Silva"
    }
  ]
}
```

---

### ⚽ **3. QUADRAS**

#### Listar Quadras
```http
GET /quadras
Authorization: Bearer {token}

Response (200):
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nome": "Quadra 1 - Futsal",
      "tipo": "futsal",
      "metragem": 40,
      "preco_hora": 80.00,
      "ativa": true
    }
  ]
}
```

#### Criar Quadra (Admin)
```http
POST /quadras
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "nome": "Quadra 2 - Vôlei",
  "tipo": "volei",
  "metragem": 260,
  "preco_hora": 100.00
}

Response (201):
{
  "status": "success",
  "data": {
    "id": 2,
    "nome": "Quadra 2 - Vôlei",
    "tipo": "volei",
    "preco_hora": 100.00
  }
}
```

---

### 👥 **4. TIMES**

#### Listar Times
```http
GET /times
Authorization: Bearer {token}

Response (200):
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nome": "Time A",
      "capitao_id": 5,
      "capitao_nome": "João Silva",
      "num_jogadores": 11,
      "ativo": true
    }
  ]
}
```

#### Criar Time
```http
POST /times
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Team Brasil",
  "descricao": "Time de futsal campeão"
}

Response (201):
{
  "status": "success",
  "data": {
    "id": 2,
    "nome": "Team Brasil",
    "capitao_id": 5,
    "criado_em": "2026-04-25T10:00:00Z"
  }
}
```

#### Listar Jogadores do Time
```http
GET /times/2/jogadores
Authorization: Bearer {token}

Response (200):
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "usuario_id": 5,
      "usuario_nome": "João Silva",
      "numero_camisa": 10,
      "posicao": "Atacante"
    }
  ]
}
```

#### Adicionar Jogador ao Time
```http
POST /times/2/jogadores
Authorization: Bearer {token}
Content-Type: application/json

{
  "usuario_id": 6,
  "numero_camisa": 7,
  "posicao": "Meia"
}

Response (201):
{
  "status": "success",
  "message": "Jogador adicionado"
}
```

---

### 💰 **5. PAGAMENTOS**

#### Registrar Pagamento
```http
POST /pagamentos
Authorization: Bearer {token}
Content-Type: application/json

{
  "reserva_id": 15,
  "valor": 80.00,
  "metodo": "pix"
}

Response (201):
{
  "status": "success",
  "data": {
    "id": 5,
    "reserva_id": 15,
    "valor": 80.00,
    "metodo": "pix",
    "status": "pendente",
    "criado_em": "2026-04-25T10:30:00Z"
  }
}
```

#### Confirmar Pagamento (Admin)
```http
PUT /pagamentos/5/confirmar
Authorization: Bearer {admin_token}

Response (200):
{
  "status": "success",
  "message": "Pagamento confirmado",
  "data": {
    "id": 5,
    "status": "pago",
    "data_pagamento": "2026-04-25"
  }
}
```

#### Listar Pagamentos Pendentes (Admin)
```http
GET /pagamentos?status=pendente
Authorization: Bearer {admin_token}

Response (200):
{
  "status": "success",
  "data": [
    {
      "id": 5,
      "reserva_id": 15,
      "usuario_nome": "João Silva",
      "valor": 80.00,
      "metodo": "pix",
      "status": "pendente"
    }
  ]
}
```

---

### 📊 **6. DASHBOARD (Admin)**

#### Indicadores Principais
```http
GET /dashboard/indicadores
Authorization: Bearer {admin_token}

Response (200):
{
  "status": "success",
  "data": {
    "faturamento_mes": 2400.00,
    "num_reservas": 30,
    "ocupacao_media": 75.5,
    "clientes_ativos": 12,
    "pagamentos_pendentes": 3
  }
}
```

#### Faturamento por Período
```http
GET /dashboard/faturamento?mes=04&ano=2026
Authorization: Bearer {admin_token}

Response (200):
{
  "status": "success",
  "data": {
    "total": 2400.00,
    "diario": [
      { "data": "2026-04-01", "valor": 160.00 },
      { "data": "2026-04-02", "valor": 240.00 }
    ]
  }
}
```

#### Ocupação da Quadra
```http
GET /dashboard/ocupacao?data=2026-04-25
Authorization: Bearer {admin_token}

Response (200):
{
  "status": "success",
  "data": [
    {
      "quadra_id": 1,
      "quadra_nome": "Quadra 1",
      "ocupacao_percentual": 75.0,
      "num_reservas": 12
    }
  ]
}
```

---

### 🏆 **7. RANKING**

#### Artilheiros da Semana
```http
GET /ranking/artilheiros?semana=17&ano=2026
Authorization: Bearer {token}

Response (200):
{
  "status": "success",
  "data": [
    {
      "posicao": 1,
      "usuario_id": 5,
      "usuario_nome": "João Silva",
      "gols": 12,
      "assistencias": 3
    },
    {
      "posicao": 2,
      "usuario_id": 6,
      "usuario_nome": "Maria Silva",
      "gols": 10,
      "assistencias": 2
    }
  ]
}
```

#### Times Destaque
```http
GET /ranking/times?semana=17&ano=2026
Authorization: Bearer {token}

Response (200):
{
  "status": "success",
  "data": [
    {
      "posicao": 1,
      "time_id": 1,
      "time_nome": "Team Brasil",
      "vitorias": 5,
      "derrotas": 1,
      "pontos": 15
    }
  ]
}
```

---

## ⚠️ Códigos de Erro

| Code | Status | Descrição |
|------|--------|-----------|
| `UNAUTHORIZED` | 401 | Token inválido ou ausente |
| `FORBIDDEN` | 403 | Sem permissão para ação |
| `NOT_FOUND` | 404 | Recurso não encontrado |
| `CONFLITO_HORARIO` | 409 | Horário já reservado |
| `VALIDACAO_ERRO` | 400 | Dados inválidos |
| `SERVER_ERROR` | 500 | Erro interno do servidor |

---

## 📌 Observações

- Timestamps em ISO 8601 com UTC
- Valores monetários em DECIMAL (10,2)
- Limites padrão: 50 items por página
- Rate limit: 100 req/min por IP

---

> **Última atualização:** Abril 2026
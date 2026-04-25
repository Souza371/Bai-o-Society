# 🚀 Guia de Desenvolvimento - Baião Society

Passo a passo para começar o desenvolvimento do projeto.

---

## ⚙️ Setup Inicial

### 1. Clonar o Repositório

```bash
git clone https://github.com/Souza371/Bai-o-Society.git
cd Bai-o-Society
```

### 2. Instalar Node.js (se necessário)

```bash
# Verificar versão
node --version  # Deve ser v16+

# Ou instalar via nvm
nvm install 18
nvm use 18
```

### 3. Instalar Dependências Backend

```bash
cd backend
npm install
```

### 4. Instalar Dependências Frontend

```bash
cd ../frontend
npm install
```

---

## 🗂️ Estrutura de Variáveis de Ambiente

### Backend (.env)

```env
# Servidor
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=baiao_society
DB_USER=postgres
DB_PASSWORD=seu_senha

# JWT
JWT_SECRET=sua_chave_super_secreta_aqui
JWT_REFRESH_SECRET=outra_chave_super_secreta
JWT_EXPIRY=7d

# Logging
LOG_LEVEL=debug

# Email (opcional para recuperar senha)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

---

## 🗄️ Setup do Banco de Dados

### 1. Criar Database

```bash
# PostgreSQL
createdb baiao_society -U postgres
```

### 2. Rodar Migrations

```bash
cd backend
npm run migrate:up
```

### 3. Aplicar Seeds (dados iniciais)

```bash
npm run seed
```

**Dados criados:**
- 2 usuários (1 admin, 1 cliente)
- 3 quadras
- 5 reservas de exemplo
- 1 time com jogadores

---

## 🏃 Executar em Desenvolvimento

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

Saída esperada:
```
Server running on http://localhost:5000
Connected to database
```

### Terminal 2: Frontend

```bash
cd frontend
npm start
```

Abre automaticamente em:
```
http://localhost:3000
```

---

## 🧪 Credenciais de Teste

Após rodar seeds:

**Admin:**
```
Email: admin@baiao.com
Senha: admin123
```

**Cliente:**
```
Email: cliente@baiao.com
Senha: cliente123
```

---

## 📝 Estrutura de Commits

Siga o padrão:

```
feat: descrição breve
fix: descrição breve
docs: descrição breve
style: descrição breve
refactor: descrição breve
test: descrição breve
```

Exemplos:

```bash
git commit -m "feat: implementar agenda inteligente"
git commit -m "fix: validação de horários duplicados"
git commit -m "docs: atualizar API.md"
```

---

## 🔄 Fluxo de Implementação (Recomendado)

### Fase 1: Foundation (1-2 semanas)
- [x] Setup inicial ✅
- [x] Banco de dados
- [x] Seeds
- [ ] Autenticação (login/register)
- [ ] Model de usuários

**Resultado:** Sistema de login funcionando

### Fase 2: Core (2 semanas)
- [ ] Model de Quadras
- [ ] **Agenda Inteligente** (SUPER IMPORTANTE)
  - [ ] Listar horários
  - [ ] Criar reserva
  - [ ] Validação de conflito
  - [ ] Atualizar reserva
  - [ ] Cancelar reserva
- [ ] Tests para validação

**Resultado:** Agenda 100% funcional

### Fase 3: Business (2 semanas)
- [ ] Times (CRUD)
- [ ] Jogadores (add/remove)
- [ ] Pagamentos (CRUD)
- [ ] Status de pagamento

**Resultado:** Gestão de times e financeiro

### Fase 4: Analytics (1 semana)
- [ ] Dashboard administrativo
- [ ] Gráficos de faturamento
- [ ] Ocupação da quadra
- [ ] Indicadores

**Resultado:** Admin pode acompanhar negócio

### Fase 5: Diferencial (1 semana)
- [ ] Ranking (artilheiros)
- [ ] Mural de campeões
- [ ] Polish visual

**Resultado:** Sistema completo e bonito

### Fase 6: Deploy (1 semana)
- [ ] Testes
- [ ] Deploy frontend (Vercel)
- [ ] Deploy backend (Railway)
- [ ] Deploy database (Neon)
- [ ] Documentação final

---

## 🧹 Padrões de Código

### Backend (Express)

**Controller:**
```javascript
// src/controllers/reservasController.js
const { Reserva } = require('../models');

const criarReserva = async (req, res) => {
  try {
    const { quadra_id, data, hora_inicio, hora_fim } = req.body;
    const usuario_id = req.user.id;

    // Validar
    if (!quadra_id || !data || !hora_inicio || !hora_fim) {
      return res.status(400).json({
        status: 'error',
        message: 'Campos obrigatórios faltando'
      });
    }

    // Verificar conflito
    const conflito = await Reserva.findOne({
      where: {
        quadra_id,
        data,
        sequelize.where(
          sequelize.sequelize.literal('hora_fim > ?', [hora_inicio]),
          sequelize.Op.and,
          sequelize.sequelize.literal('hora_inicio < ?', [hora_fim])
        )
      }
    });

    if (conflito) {
      return res.status(409).json({
        status: 'error',
        message: 'Horário já reservado',
        code: 'CONFLITO_HORARIO'
      });
    }

    // Criar
    const reserva = await Reserva.create({
      quadra_id,
      usuario_id,
      data,
      hora_inicio,
      hora_fim,
      status: 'pendente'
    });

    res.status(201).json({
      status: 'success',
      data: reserva
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Erro ao criar reserva'
    });
  }
};

module.exports = { criarReserva };
```

**Model (Sequelize):**
```javascript
// src/models/Reserva.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reserva = sequelize.define('Reserva', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    quadra_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Quadras', key: 'id' }
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Usuarios', key: 'id' }
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_fim: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pendente', 'confirmada', 'cancelada'),
      defaultValue: 'pendente'
    }
  }, {
    timestamps: true,
    tableName: 'reservas'
  });

  return Reserva;
};
```

**Route:**
```javascript
// src/routes/reservasRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { criarReserva, listarReservas } = require('../controllers/reservasController');

const router = express.Router();

router.post('/', authMiddleware.authenticate, criarReserva);
router.get('/', authMiddleware.authenticate, listarReservas);

module.exports = router;
```

### Frontend (React)

**Custom Hook:**
```javascript
// src/hooks/useReservas.js
import { useState, useEffect } from 'react';
import reservasService from '../services/reservasService';

export const useReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReservas = async (data, quadra_id) => {
    setLoading(true);
    try {
      const response = await reservasService.buscar({ data, quadra_id });
      setReservas(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { reservas, loading, error, fetchReservas };
};
```

**Component:**
```javascript
// src/components/Agenda/Calendario.jsx
import React, { useEffect, useState } from 'react';
import { useReservas } from '../../hooks/useReservas';

const Calendario = ({ quadra_id, data }) => {
  const { reservas, loading, fetchReservas } = useReservas();
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    fetchReservas(data, quadra_id);
  }, [data, quadra_id]);

  useEffect(() => {
    // Processar reservas para exibir
    const horas = Array.from({ length: 16 }, (_, i) => i + 8);
    setHorarios(horas.map(h => ({
      hora: `${h}:00`,
      ocupado: reservas.some(r => parseInt(r.hora_inicio) === h)
    })));
  }, [reservas]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="calendario">
      {horarios.map(h => (
        <div key={h.hora} className={h.ocupado ? 'ocupado' : 'livre'}>
          {h.hora}
        </div>
      ))}
    </div>
  );
};

export default Calendario;
```

---

## 🧪 Testes

### Backend (Jest)

```bash
npm test                # Rodar testes
npm run test:watch     # Modo watch
npm run test:coverage  # Cobertura
```

**Exemplo:**
```javascript
// src/tests/validacao.test.js
describe('Validação de Horários', () => {
  it('deve detectar conflito de horário', async () => {
    const conflito = await verificarConflito(
      quadra_id=1,
      data='2026-04-25',
      hora_inicio='14:00',
      hora_fim='15:00'
    );
    expect(conflito).toBe(true);
  });
});
```

---

## 🐛 Debug

### Backend
```bash
# Modo debug
node --inspect=9229 ./src/server.js

# No Chrome: chrome://inspect
```

### Frontend
```bash
# Redux DevTools
# React DevTools (extensão do Chrome)
```

---

## 📚 Referências

- [Sequelize Docs](https://sequelize.org/)
- [Express Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

---

## ❓ Dúvidas?

Consulte:
- `docs/ARQUITETURA.md` — Decisões técnicas
- `docs/API.md` — Endpoints detalhados
- `docs/BANCO_DE_DADOS.md` — Schema SQL

---

> **Dica:** Comece pela Fase 1 e siga na ordem. Não tente fazer tudo de uma vez!
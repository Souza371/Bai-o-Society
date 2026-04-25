# Baião Society - Backend

API REST para o sistema de gestão de quadras esportivas.

## Setup Rápido

```bash
npm install
npm run migrate:up
npm run seed
npm run dev
```

**API:** http://localhost:5000/api

## Estrutura

```
src/
├── routes/        # Endpoints
├── controllers/   # Lógica
├── models/        # Database
├── services/      # Regras de negócio
├── middleware/    # Autenticação, validação
└── database/      # Migrations, seeds
```

## Variáveis de Ambiente

Copiar `.env.example` para `.env` e configurar.

## Testes

```bash
npm test
```

## Documentação

Ver `docs/` na raiz do projeto.

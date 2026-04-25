# 🗄️ Banco de Dados Baião Society

## Schema SQL Completo

### 1. Tabela: `usuarios`

```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  perfil ENUM('admin', 'cliente') DEFAULT 'cliente',
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_perfil (perfil)
);
```

---

### 2. Tabela: `quadras`

```sql
CREATE TABLE quadras (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  metragem INT,
  tipo ENUM('futebol', 'futsal', 'volei', 'multipla') DEFAULT 'futsal',
  preco_hora DECIMAL(10, 2) NOT NULL,
  ativa BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_ativa (ativa),
  INDEX idx_tipo (tipo)
);
```

---

### 3. Tabela: `reservas` (CORE)

```sql
CREATE TABLE reservas (
  id SERIAL PRIMARY KEY,
  quadra_id INT NOT NULL,
  usuario_id INT NOT NULL,
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  observacoes TEXT,
  status ENUM('pendente', 'confirmada', 'cancelada') DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (quadra_id) REFERENCES quadras(id) ON DELETE RESTRICT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  
  -- ÍNDICES CRÍTICOS para performance
  UNIQUE INDEX idx_quadra_data_hora (quadra_id, data, hora_inicio, hora_fim),
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_data (data),
  INDEX idx_status (status),
  INDEX idx_quadra_data (quadra_id, data)
);
```

**Validações:**
- `hora_fim > hora_inicio`
- Não permitir reservas no passado
- Máximo 48h antecedência (customizável)

---

### 4. Tabela: `pagamentos`

```sql
CREATE TABLE pagamentos (
  id SERIAL PRIMARY KEY,
  reserva_id INT NOT NULL UNIQUE,
  usuario_id INT NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  data_pagamento DATE,
  metodo ENUM('dinheiro', 'cartao', 'pix', 'boleto') DEFAULT 'dinheiro',
  status ENUM('pendente', 'pago', 'cancelado') DEFAULT 'pendente',
  referencia_externa VARCHAR(255),  -- ID do gateway (ex: Stripe)
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_status (status),
  INDEX idx_data_pagamento (data_pagamento)
);
```

---

### 5. Tabela: `times`

```sql
CREATE TABLE times (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  capitao_id INT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (capitao_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  
  INDEX idx_capitao_id (capitao_id),
  INDEX idx_ativo (ativo)
);
```

---

### 6. Tabela: `jogadores`

```sql
CREATE TABLE jogadores (
  id SERIAL PRIMARY KEY,
  time_id INT NOT NULL,
  usuario_id INT NOT NULL,
  numero_camisa INT,
  posicao VARCHAR(50),
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (time_id) REFERENCES times(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  
  UNIQUE INDEX idx_time_usuario (time_id, usuario_id),
  INDEX idx_time_id (time_id)
);
```

---

### 7. Tabela: `partidas`

```sql
CREATE TABLE partidas (
  id SERIAL PRIMARY KEY,
  time_a_id INT NOT NULL,
  time_b_id INT NOT NULL,
  quadra_id INT NOT NULL,
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  resultado VARCHAR(50),  -- Ex: "3-2"
  gols_time_a INT,
  gols_time_b INT,
  status ENUM('agendada', 'realizada', 'cancelada') DEFAULT 'agendada',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (time_a_id) REFERENCES times(id) ON DELETE CASCADE,
  FOREIGN KEY (time_b_id) REFERENCES times(id) ON DELETE CASCADE,
  FOREIGN KEY (quadra_id) REFERENCES quadras(id) ON DELETE RESTRICT,
  
  INDEX idx_data (data),
  INDEX idx_status (status)
);
```

---

### 8. Tabela: `rankings`

```sql
CREATE TABLE rankings (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL,
  semana INT NOT NULL,
  ano INT NOT NULL,
  gols INT DEFAULT 0,
  assistencias INT DEFAULT 0,
  posicao INT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  
  UNIQUE INDEX idx_usuario_semana_ano (usuario_id, semana, ano),
  INDEX idx_semana_ano (semana, ano)
);
```

---

## 💾 Migrations (Sequelize/TypeORM)

### Structure

```
backend/src/database/migrations/
├── 001_create_usuarios.js
├── 002_create_quadras.js
├── 003_create_reservas.js
├── 004_create_pagamentos.js
├── 005_create_times.js
├── 006_create_jogadores.js
├── 007_create_partidas.js
└── 008_create_rankings.js
```

### Executar

```bash
npm run migrate:up     # Aplicar próxima migração
npm run migrate:down   # Reverter última migração
npm run migrate:reset  # Resetar tudo
```

---

## 🌱 Seeds (Dados Iniciais)

```
backend/src/database/seeders/
├── 001_usuarios.js
├── 002_quadras.js
└── 003_reservas_exemplo.js
```

### Executar

```bash
npm run seed
```

---

## 🔍 Índices de Performance

| Tabela | Coluna | Tipo | Motivo |
|--------|--------|------|--------|
| `reservas` | `(quadra_id, data, hora_inicio)` | UNIQUE | Evita conflitos |
| `reservas` | `data` | INDEX | Listar por dia |
| `pagamentos` | `status` | INDEX | Filtrar pendentes |
| `pagamentos` | `data_pagamento` | INDEX | Relatórios mensais |
| `rankings` | `(semana, ano)` | INDEX | Ranking semanal |
| `partidas` | `data` | INDEX | Listar próximas |

---

## 📊 Consultas Comuns

### 1. Horários livres de uma quadra

```sql
SELECT 
  '08:00' AS hora_inicio,
  '09:00' AS hora_fim,
  CASE 
    WHEN COUNT(r.id) > 0 THEN 'ocupado'
    ELSE 'livre'
  END AS status
FROM (
  SELECT GENERATE_SERIES(8, 23) AS hora
) AS horas
LEFT JOIN reservas r ON 
  r.quadra_id = 1 
  AND DATE(r.criado_em) = '2026-04-25'
  AND r.hora_inicio <= horas.hora::time
  AND r.hora_fim > horas.hora::time
WHERE horas.hora BETWEEN 8 AND 23
GROUP BY horas.hora;
```

### 2. Faturamento mensal

```sql
SELECT 
  DATE_TRUNC('month', p.data_pagamento)::DATE AS mes,
  SUM(p.valor) AS total,
  COUNT(p.id) AS num_pagamentos
FROM pagamentos p
WHERE p.status = 'pago'
  AND YEAR(p.data_pagamento) = 2026
GROUP BY DATE_TRUNC('month', p.data_pagamento)
ORDER BY mes DESC;
```

### 3. Ranking de artilheiros

```sql
SELECT 
  u.id,
  u.nome,
  r.gols,
  RANK() OVER (ORDER BY r.gols DESC) AS posicao
FROM rankings r
JOIN usuarios u ON r.usuario_id = u.id
WHERE r.semana = 17 AND r.ano = 2026
ORDER BY r.gols DESC
LIMIT 10;
```

### 4. Ocupação da quadra

```sql
SELECT 
  q.nome,
  ROUND(COUNT(r.id)::numeric / 16 * 100, 2) AS ocupacao_percentual
FROM quadras q
LEFT JOIN reservas r ON 
  q.id = r.quadra_id 
  AND DATE(r.criado_em) = CURRENT_DATE
  AND r.status = 'confirmada'
GROUP BY q.id, q.nome
ORDER BY ocupacao_percentual DESC;
```

---

## 🔐 Backup & Restore

### Backup

```bash
pg_dump -U user -h localhost baiao_society > backup.sql
```

### Restore

```bash
psql -U user -h localhost baiao_society < backup.sql
```

---

## 📈 Plano de Expansão

1. **Short-term:** Schema atual suporta 100k+ registros
2. **Medium-term:** Adicionar cache (Redis) para rankings
3. **Long-term:** Sharding por quadra/mês se ultrapasse 10M registros

---

## ✅ Checklist BD

- [ ] Banco criado
- [ ] Migrations rodadas
- [ ] Seeds aplicados
- [ ] Índices verificados
- [ ] Backup automático configurado
- [ ] Monitoramento de queries lentas ativo

---

> **Nota:** As constraints e índices foram cuidadosamente planejados para evitar duplicação de reservas (principal problema do sistema manual).
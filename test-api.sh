#!/bin/bash

# ========================================================================
# TESTE COMPLETO - BAIÃO SOCIETY
# ========================================================================

echo "🚀 INICIANDO TESTES DO BAIÃO SOCIETY"
echo "======================================"

# 1. Health Check
echo -e "\n✓ Teste 1: Health Check"
curl -s http://localhost:5000/health | python3 -m json.tool

# 2. Registrar usuário cliente
echo -e "\n✓ Teste 2: Registro de Usuário Cliente"
CLIENTE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "senha": "senha123",
    "nome": "João Silva",
    "telefone": "(11) 98765-4321"
  }')
echo "$CLIENTE" | python3 -m json.tool

# 3. Login do cliente
echo -e "\n✓ Teste 3: Login de Usuário"
LOGIN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "senha": "senha123"
  }')
echo "$LOGIN" | python3 -m json.tool

# Extrair token (para próximos testes)
TOKEN=$(echo "$LOGIN" | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

if [ ! -z "$TOKEN" ]; then
  echo -e "\n✅ Token obtido com sucesso"
  
  # 4. Listar quadras
  echo -e "\n✓ Teste 4: Listar Quadras (deve estar vazio)"
  curl -s -X GET http://localhost:5000/api/quadras \
    -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
  
  # 5. Listar reservas
  echo -e "\n✓ Teste 5: Listar Reservas (deve estar vazio)"
  curl -s -X GET http://localhost:5000/api/reservas \
    -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
    
  # 6. Verificar rota protegida
  echo -e "\n✓ Teste 6: Verificar Token (rota protegida)"
  curl -s -X GET http://localhost:5000/api/auth/verify \
    -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
else
  echo "❌ Falha ao obter token"
fi

echo -e "\n======================================"
echo "✅ TESTES CONCLUÍDOS"
echo "======================================"

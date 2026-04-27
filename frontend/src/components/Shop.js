import React, { useState } from 'react';
import './Shop.css';

const Shop = () => {
  const [carrinho, setCarrinho] = useState([]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('utensílios');

  const produtosUtensílios = [
    {
      id: 1,
      nome: 'Bola de Futsal Premium',
      preco: 89.90,
      categoria: 'Bolas',
      emoji: '⚽',
      cor: '#ff6b6b',
      descricao: 'Bola oficial para futsal'
    },
    {
      id: 2,
      nome: 'Coletes de Treino',
      preco: 45.90,
      categoria: 'Equipamento',
      emoji: '🦺',
      cor: '#fbbf24',
      descricao: 'Conjunto com 10 coletes'
    },
    {
      id: 3,
      nome: 'Garrafas Reutilizáveis',
      preco: 34.90,
      categoria: 'Garrafas',
      emoji: '🧴',
      cor: '#22c55e',
      descricao: 'Garrafa 500ml com alça'
    },
    {
      id: 4,
      nome: 'Sacola Desportiva',
      preco: 79.90,
      categoria: 'Mochilas',
      emoji: '🎒',
      cor: '#1565c0',
      descricao: 'Mochila grande para treino'
    },
    {
      id: 5,
      nome: 'Colchonete de Yoga',
      preco: 59.90,
      categoria: 'Acessórios',
      emoji: '🧘',
      cor: '#ec4899',
      descricao: 'Colchonete anti-derrapante'
    },
    {
      id: 6,
      nome: 'Toalha de Microfibra',
      preco: 39.90,
      categoria: 'Toalhas',
      emoji: '🧣',
      cor: '#6b7280',
      descricao: 'Toalha rápida absorção'
    },
  ];

  const produtosComidas = [
    {
      id: 7,
      nome: 'Água Mineral (500ml)',
      preco: 3.90,
      categoria: 'Bebidas',
      emoji: '💧',
      cor: '#06b6d4',
      descricao: 'Garrafa de água gelada'
    },
    {
      id: 8,
      nome: 'Refrigerante (2L)',
      preco: 9.90,
      categoria: 'Bebidas',
      emoji: '🥤',
      cor: '#ef4444',
      descricao: 'Refrigerante gelado'
    },
    {
      id: 9,
      nome: 'Suco Natural',
      preco: 8.90,
      categoria: 'Bebidas',
      emoji: '🧃',
      cor: '#f59e0b',
      descricao: 'Suco natural de frutas'
    },
    {
      id: 10,
      nome: 'Energético',
      preco: 12.90,
      categoria: 'Bebidas',
      emoji: '⚡',
      cor: '#a78bfa',
      descricao: 'Bebida energética 250ml'
    },
    {
      id: 11,
      nome: 'Lanches Variados',
      preco: 15.90,
      categoria: 'Comidas',
      emoji: '🍿',
      cor: '#f97316',
      descricao: 'Mix de lanches saudáveis'
    },
    {
      id: 12,
      nome: 'Barra de Proteína',
      preco: 7.90,
      categoria: 'Comidas',
      emoji: '🍫',
      cor: '#8b5cf6',
      descricao: 'Barra com 25g de proteína'
    },
    {
      id: 13,
      nome: 'Pizza Congelada',
      preco: 29.90,
      categoria: 'Comidas',
      emoji: '🍕',
      cor: '#dc2626',
      descricao: 'Pizza grande para 4 pessoas'
    },
    {
      id: 14,
      nome: 'Sanduíche Gourmet',
      preco: 22.90,
      categoria: 'Comidas',
      emoji: '🥪',
      cor: '#d97706',
      descricao: 'Sanduíche pronto para comer'
    },
  ];

  const produtosMerchandise = [
    {
      id: 15,
      nome: 'Boné Baião Society',
      preco: 49.90,
      categoria: 'Bonés',
      emoji: '🧢',
      cor: '#1565c0',
      descricao: 'Boné premium com logo bordado'
    },
    {
      id: 16,
      nome: 'Camiseta Branca',
      preco: 79.90,
      categoria: 'Camisetas',
      emoji: '👕',
      cor: '#f59e0b',
      descricao: 'Camiseta 100% algodão'
    },
    {
      id: 17,
      nome: 'Camiseta Preta',
      preco: 79.90,
      categoria: 'Camisetas',
      emoji: '👕',
      cor: '#6b7280',
      descricao: 'Camiseta 100% algodão premium'
    },
    {
      id: 18,
      nome: 'Boné Vermelho',
      preco: 49.90,
      categoria: 'Bonés',
      emoji: '🧢',
      cor: '#ef4444',
      descricao: 'Boné vermelho com detalhe branco'
    },
    {
      id: 19,
      nome: 'Caneca Personalizada',
      preco: 39.90,
      categoria: 'Canecas',
      emoji: '☕',
      cor: '#ff6b6b',
      descricao: 'Caneca cerâmica 350ml'
    },
    {
      id: 20,
      nome: 'Copo Térmico',
      preco: 59.90,
      categoria: 'Copos',
      emoji: '🥤',
      cor: '#22c55e',
      descricao: 'Copo térmico 500ml inox'
    },
  ];

  const getProdutosABA = () => {
    switch(abaAtiva) {
      case 'utensílios':
        return produtosUtensílios;
      case 'comidas':
        return produtosComidas;
      case 'merchandise':
        return produtosMerchandise;
      default:
        return [];
    }
  };

  const adicionarAoCarrinho = (produto) => {
    const itemExistente = carrinho.find(item => item.id === produto.id);
    if (itemExistente) {
      setCarrinho(carrinho.map(item =>
        item.id === produto.id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      ));
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
  };

  const removerDoCarrinho = (produtoId) => {
    setCarrinho(carrinho.filter(item => item.id !== produtoId));
  };

  const atualizarQuantidade = (produtoId, novaQuantidade) => {
    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId);
    } else {
      setCarrinho(carrinho.map(item =>
        item.id === produtoId
          ? { ...item, quantidade: novaQuantidade }
          : item
      ));
    }
  };

  const totalCarrinho = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);

  return (
    <div className="shop-container">
      <div className="shop-header">
        <div className="shop-titulo">
          <h2>🛍️ Loja Baião Society</h2>
          <p>Produtos exclusivos com estilo!</p>
        </div>
        <button
          className="btn-carrinho"
          onClick={() => setMostrarCarrinho(!mostrarCarrinho)}
        >
          🛒 Carrinho ({carrinho.length})
        </button>
      </div>

      {mostrarCarrinho && (
        <div className="carrinho-panel">
          <h3>Seu Carrinho</h3>
          {carrinho.length === 0 ? (
            <p className="carrinho-vazio">Carrinho vazio</p>
          ) : (
            <>
              <div className="carrinho-items">
                {carrinho.map(item => (
                  <div key={item.id} className="carrinho-item">
                    <div className="item-info">
                      <span className="item-emoji">{item.emoji}</span>
                      <div className="item-detalhes">
                        <strong>{item.nome}</strong>
                        <span className="item-preco">R$ {item.preco.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="item-controles">
                      <button onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}>−</button>
                      <span className="item-qty">{item.quantidade}</span>
                      <button onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}>+</button>
                      <button
                        className="btn-remover"
                        onClick={() => removerDoCarrinho(item.id)}
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="item-subtotal">
                      R$ {(item.preco * item.quantidade).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="carrinho-total">
                <strong>Total:</strong>
                <span>R$ {totalCarrinho.toFixed(2)}</span>
              </div>
              <div className="carrinho-acoes">
                <button className="btn-continuar" onClick={() => setMostrarCarrinho(false)}>
                  Continuar Comprando
                </button>
                <button className="btn-checkout">
                  Proceder para Pagamento
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="shop-abas">
        <button
          className={`aba ${abaAtiva === 'utensílios' ? 'ativa' : ''}`}
          onClick={() => setAbaAtiva('utensílios')}
        >
          🏃 Utensílios & Conveniência
        </button>
        <button
          className={`aba ${abaAtiva === 'comidas' ? 'ativa' : ''}`}
          onClick={() => setAbaAtiva('comidas')}
        >
          🍔 Comidas & Bebidas
        </button>
        <button
          className={`aba ${abaAtiva === 'merchandise' ? 'ativa' : ''}`}
          onClick={() => setAbaAtiva('merchandise')}
        >
          👕 Merchandise
        </button>
      </div>

      <div className="produtos-grid">
        {getProdutosABA().map(produto => (
          <div key={produto.id} className="produto-card">
            <div className="produto-emoji" style={{ backgroundColor: produto.cor }}>
              {produto.emoji}
            </div>
            <div className="produto-info">
              <h3>{produto.nome}</h3>
              <p className="produto-descricao">{produto.descricao}</p>
              <div className="produto-categoria">{produto.categoria}</div>
              <div className="produto-footer">
                <div className="produto-preco">
                  <span className="preco">R$ {produto.preco.toFixed(2)}</span>
                </div>
                <button
                  className="btn-adicionar"
                  onClick={() => adicionarAoCarrinho(produto)}
                >
                  + Adicionar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;

import React, { useState } from 'react';
import './Shop.css';

const Shop = () => {
  const [carrinho, setCarrinho] = useState([]);
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);

  const produtos = [
    {
      id: 1,
      nome: 'Boné Baião Society',
      preco: 49.90,
      categoria: 'Bonés',
      emoji: '🧢',
      cor: '#1565c0',
      descricao: 'Boné premium com logo bordado'
    },
    {
      id: 2,
      nome: 'Caneca Personalizada',
      preco: 39.90,
      categoria: 'Canecas',
      emoji: '☕',
      cor: '#ff6b6b',
      descricao: 'Caneca cerâmica 350ml'
    },
    {
      id: 3,
      nome: 'Copo Térmico',
      preco: 59.90,
      categoria: 'Copos',
      emoji: '🥤',
      cor: '#22c55e',
      descricao: 'Copo térmico 500ml inox'
    },
    {
      id: 4,
      nome: 'Camiseta Branca',
      preco: 79.90,
      categoria: 'Camisetas',
      emoji: '👕',
      cor: '#f59e0b',
      descricao: 'Camiseta 100% algodão'
    },
    {
      id: 5,
      nome: 'Camiseta Preta',
      preco: 79.90,
      categoria: 'Camisetas',
      emoji: '👕',
      cor: '#6b7280',
      descricao: 'Camiseta 100% algodão premium'
    },
    {
      id: 6,
      nome: 'Boné Vermelho',
      preco: 49.90,
      categoria: 'Bonés',
      emoji: '🧢',
      cor: '#ef4444',
      descricao: 'Boné vermelho com detalhe branco'
    },
  ];

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

      <div className="produtos-grid">
        {produtos.map(produto => (
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

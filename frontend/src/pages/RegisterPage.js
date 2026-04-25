import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';
import Form from '../components/Form';
import Card from '../components/Card';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fields = [
    { name: 'nome', label: 'Nome Completo', type: 'text', placeholder: 'Seu nome', attrs: { required: true } },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'seu@email.com', attrs: { required: true } },
    { name: 'telefone', label: 'Telefone', type: 'tel', placeholder: '(11) 99999-9999' },
    { name: 'senha', label: 'Senha', type: 'password', placeholder: '••••••••', attrs: { required: true, minLength: 6 } },
    { name: 'confirma_senha', label: 'Confirmar Senha', type: 'password', placeholder: '••••••••', attrs: { required: true } }
  ];

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Validar senhas
    if (formData.senha !== formData.confirma_senha) {
      setError('❌ As senhas não conferem');
      setLoading(false);
      return;
    }

    if (formData.senha.length < 6) {
      setError('❌ Senha deve ter no mínimo 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      console.log('📍 Tentando registrar:', formData.email);
      await authService.register(formData.email, formData.senha, formData.nome, formData.telefone);
      setSuccess('✅ Cadastro realizado com sucesso! Redirecionando para login...');
      console.log('✅ Registro bem-sucedido');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('❌ Erro no registro:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao cadastrar';
      setError('❌ ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <Card className="register-card">
          <div className="register-header">
            <img src="/brasao.svg" alt="Baião Society" />
            <h1>Criar Conta</h1>
            <p>Baião Society - Sistema de Gestão de Quadras</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <Form
            fields={fields}
            onSubmit={handleSubmit}
            submitText="Cadastrar"
            loading={loading}
          />

          <div className="register-footer">
            <p>Já tem conta? <a href="/login">Login aqui</a></p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;

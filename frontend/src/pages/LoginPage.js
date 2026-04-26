import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services';
import Form from '../components/Form';
import Card from '../components/Card';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fields = [
    { name: 'email', label: 'Email', type: 'email', placeholder: 'seu@email.com', attrs: { required: true } },
    { name: 'senha', label: 'Senha', type: 'password', placeholder: '••••••••', attrs: { required: true } }
  ];

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError('');
    try {
      console.log('📍 Tentando login com:', formData.email);
      
      const response = await authService.login(formData.email, formData.senha);
      console.log('✅ Resposta do login:', response);
      
      const { token, user } = response.data.data;
      console.log('✅ Token recebido:', token.substring(0, 20) + '...');
      console.log('✅ Usuário:', user);
      
      login(user, token);
      console.log('✅ Usuário autenticado no context');
      
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Erro no login:', err);
      console.error('Detalhes:', err.response?.data);
      
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao fazer login';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <Card className="login-card">
          <div className="login-header">
            <img src="/brasao.svg" alt="Baião Society" />
            <h1>⚽ Baião Society</h1>
            <p>Sistema de Gestão de Quadras</p>
          </div>

          {error && <div className="alert alert-error">❌ {error}</div>}

          <Form
            fields={fields}
            onSubmit={handleSubmit}
            submitText="Entrar"
            loading={loading}
          />

          <div className="login-footer">
            <p>Não tem conta? <a href="/register">Cadastre-se aqui</a></p>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;

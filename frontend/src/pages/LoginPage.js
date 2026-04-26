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
            <img src="/brasao-oficial.jpg" alt="Baião Society" className="brasao-oficial" />
            <h1>Baião Society</h1>
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
            <div className="social-contacts">
              <a 
                href="https://api.whatsapp.com/message/J3UMFQQ4XZVYE1?autoload=1&app_absent=0&utm_source=ig" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-button whatsapp-button"
                title="Fale conosco no WhatsApp"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-.355.228-.83.158-1.076-.206-.233-.345-.19-.812.1-1.111 2.692-2.575 6.365-2.963 9.52-1.01 3.155 1.952 5.047 5.694 4.595 9.333-.204 1.705-.907 3.29-2.043 4.582-.266.31-.33.783-.15 1.161.18.378.64.545 1.011.308 1.45-1.518 2.38-3.547 2.644-5.69.713-5.967-3.86-11.275-9.713-11.944"/>
                </svg>
                WhatsApp
              </a>
              <a 
                href="https://www.instagram.com/baiao_society?igsh=MW1maGdhY3QycnR2" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-button instagram-button"
                title="Siga-nos no Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057-1.645.069-4.849.069-3.204 0-3.584-.012-4.849-.069-3.259-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;

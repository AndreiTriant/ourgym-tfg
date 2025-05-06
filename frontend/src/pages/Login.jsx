import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [iniciandoSesion, setIniciandoSesion] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get('/usuarios');
        navigate('/');
      } catch {
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setIniciandoSesion(true);
    try {
      await api.post('/login', { email, password }, { withCredentials: true });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al autenticar');
    } finally {
      setIniciandoSesion(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: '100%' }}>
        <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={iniciandoSesion}>
            {iniciandoSesion ? 'Iniciando sesión...' : 'Entrar'}
          </button>
          <div className="text-center mt-3">
            <span>¿No tienes una cuenta? </span>
            <a href="/registro" className="text-primary fw-bold" style={{ textDecoration: 'none' }}>
              Regístrate
            </a>
          </div>

        </form>
      </div>
    </div>
  );
}

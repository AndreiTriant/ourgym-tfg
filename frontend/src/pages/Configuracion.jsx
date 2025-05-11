import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import './Home.css';

export default function Configuracion() {
  const [usuario, setUsuario] = useState(null);
  const [verificandoSesion, setVerificandoSesion] = useState(true);
  const [formData, setFormData] = useState({
    nomUsu: '',
    email: '',
    nuevaPassword: '',
    confirmarPassword: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const menuItems = ["Inicio", "Explorar", "Notificaciones", "Mensajes", "Guardados", "Premium"];

  // 🔐 Verifica la sesión antes de todo
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch("/api/usuario/yo", { credentials: "include" });
        if (!res.ok) throw new Error("No autenticado");
      } catch {
        navigate("/login");
      } finally {
        setVerificandoSesion(false);
      }
    };
    verificarSesion();
  }, [navigate]);

  useEffect(() => {
    const fetchUsuarioActual = async () => {
      try {
        const response = await axios.get('/api/usuario/yo', { withCredentials: true });
        setUsuario(response.data);
        setFormData({
          nomUsu: response.data.nom_usu || '',
          email: response.data.email || '',
          nuevaPassword: '',
          confirmarPassword: '',
        });
      } catch (error) {
        console.error('Error al cargar el usuario:', error);
      }
    };

    if (!verificandoSesion) {
      fetchUsuarioActual();
    }
  }, [verificandoSesion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.nuevaPassword && formData.nuevaPassword.length < 8) {
      setMensaje('❌ La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (formData.nuevaPassword && formData.nuevaPassword !== formData.confirmarPassword) {
      setMensaje('❌ Las contraseñas no coinciden.');
      return;
    }

    try {
      const dataToSend = {
        nomUsu: formData.nomUsu,
      };

      if (formData.nuevaPassword) {
        dataToSend.contrasenya = formData.nuevaPassword;
        dataToSend.confirmarContrasenya = formData.confirmarPassword;
      }

      await axios.put('/api/usuario/editar', dataToSend, { withCredentials: true });
      setMensaje('✅ Cambios guardados correctamente.');
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
      setMensaje('❌ Error al guardar los cambios.');
    }
  };

  const handleCancelarPremium = async () => {
    try {
      await axios.patch('/api/usuario/cancelar-premium', {}, { withCredentials: true });
      setMensaje('✅ Suscripción premium cancelada.');
      setUsuario(prev => ({ ...prev, tipo_usu: 'normal' }));
    } catch (error) {
      console.error('Error al cancelar premium:', error);
      setMensaje('❌ Error al cancelar la suscripción.');
    }
  };

  const handleBorrarCuenta = async () => {
    if (!window.confirm('⚠️ ¿Estás seguro de que quieres borrar tu cuenta? Esta acción es irreversible.')) return;
    try {
      await axios.delete('/api/usuario/borrar', { withCredentials: true });
      alert('Tu cuenta ha sido eliminada.');
      navigate('/registro');
    } catch (error) {
      console.error('Error al borrar la cuenta:', error);
      setMensaje('❌ Error al borrar la cuenta.');
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && showSidebar) {
        setShowSidebar(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showSidebar]);

  if (verificandoSesion) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
          zIndex: 9999
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Verificando sesión...</span>
          </div>
          <p className="mt-3">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!usuario) return <div>Cargando configuración...</div>;

  return (
    <div className="app-container">
      <div className="fixed-header">
        <Header onMenuClick={() => setShowSidebar(true)} />
      </div>

      <Sidebar items={menuItems} show={showSidebar} onHide={() => setShowSidebar(false)} mobile />

      <div className="content-grid">
        <div className="sidebar-area d-none d-lg-block">
          <Sidebar items={menuItems} show mobile={false} />
        </div>

        <main className="feed-area">
          <h2>⚙️ Configuración de la cuenta</h2>
          {mensaje && <div className="alert alert-info">{mensaje}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nombre de usuario</label>
              <input
                type="text"
                name="nomUsu"
                className="form-control"
                value={formData.nomUsu}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nueva contraseña (opcional)</label>
              <input
                type="password"
                name="nuevaPassword"
                className="form-control"
                value={formData.nuevaPassword}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirmar nueva contraseña</label>
              <input
                type="password"
                name="confirmarPassword"
                className="form-control"
                value={formData.confirmarPassword}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">💾 Guardar cambios</button>
          </form>

          <hr />

          <div className="mt-4">
            <h4>Suscripción</h4>
            {usuario?.tipo_usu?.toUpperCase() === 'PREMIUM' ? (
              <button className="btn btn-warning mt-2" onClick={handleCancelarPremium}>
                ❌ Cancelar suscripción premium
              </button>
            ) : (
              <button className="btn btn-success mt-2" onClick={() => navigate('/suscripcion')}>
                🚀 Suscribirse
              </button>
            )}
          </div>

          <hr />

          <div className="mt-4">
            <h4>Zona peligrosa</h4>
            <button className="btn btn-danger mt-2" onClick={handleBorrarCuenta}>🗑️ Borrar cuenta</button>
          </div>
        </main>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function SuscripcionPremium() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [verificandoSesion, setVerificandoSesion] = useState(true);
  const navigate = useNavigate();

  // 🔐 Verifica sesión antes de cargar datos
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

  // 🔄 Carga usuario actual una vez confirmada sesión
  useEffect(() => {
    const fetchUsuarioActual = async () => {
      try {
        const response = await axios.get('/api/usuario/yo', { withCredentials: true });
        setUsuarioActual(response.data);
      } catch (error) {
        console.error('Error al obtener usuario actual:', error);
        setUsuarioActual(null);
      } finally {
        setCargando(false);
      }
    };

    if (!verificandoSesion) {
      fetchUsuarioActual();
    }
  }, [verificandoSesion]);

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

  if (cargando) {
    return (
      <>
        <Header usuarioActual={usuarioActual} />
        <div className="text-center mt-5">Cargando usuario...</div>
      </>
    );
  }

  if (!usuarioActual) {
    return (
      <>
        <Header usuarioActual={usuarioActual} />
        <div className="alert alert-danger text-center mt-5">
          Error: No se pudo obtener la información del usuario.
        </div>
      </>
    );
  }

  const esPremium = usuarioActual.tipo_usu === 'premium';

  const handleSuscribirse = async () => {
    try {
      await axios.patch('/api/usuario/hacer-premium', {}, { withCredentials: true });
      alert('¡Ahora eres premium! 🎉');
      window.location.reload();
    } catch (error) {
      console.error('Error al suscribirse:', error);
      alert('Hubo un error al intentar suscribirte.');
    }
  };

  const handleCancelarSuscripcion = async () => {
    try {
      await axios.patch('/api/usuario/cancelar-premium', {}, { withCredentials: true });
      alert('Has cancelado tu suscripción premium.');
      window.location.reload();
    } catch (error) {
      console.error('Error al cancelar la suscripción:', error);
      alert('Hubo un error al intentar cancelar la suscripción.');
    }
  };

  return (
    <>
      <Header usuarioActual={usuarioActual} />
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1>Hazte Premium 🚀</h1>
        <p>
          Al convertirte en usuario premium desbloquearás funciones exclusivas y tendrás más visibilidad.
        </p>

        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '2rem',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            marginTop: '2rem',
            textAlign: 'center'
          }}
        >
          <h2>Premium</h2>
          <p>Solo 4,99€/mes</p>

          {esPremium ? (
            <button
              onClick={handleCancelarSuscripcion}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Cancelar suscripción
            </button>
          ) : (
            <button
              onClick={handleSuscribirse}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Confirmar suscripción
            </button>
          )}
        </div>
      </div>
    </>
  );
}

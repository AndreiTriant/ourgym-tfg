import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Configuracion() {
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nomUsu: '',
    email: '',
    nuevaPassword: '',
    confirmarPassword: '',
  });

  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Cargar datos del usuario actual
  useEffect(() => {
    const fetchUsuarioActual = async () => {
      try {
        const response = await axios.get('/api/usuario/yo', { withCredentials: true });
        console.log('👤 Usuario actual cargado:', response.data);
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

    fetchUsuarioActual();
  }, []);

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Subir foto desde el ordenador (opcional: solo captura la URL local)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          fotoPerfil: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar longitud mínima de la contraseña
    if (formData.nuevaPassword && formData.nuevaPassword.length < 8) {
      setMensaje('❌ La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    // Validar que las contraseñas coinciden
    if (formData.nuevaPassword && formData.nuevaPassword !== formData.confirmarPassword) {
      setMensaje('❌ Las contraseñas no coinciden.');
      return;
    }

    try {
      const dataToSend = {
        nomUsu: formData.nomUsu,
      };

      if (formData.nuevaPassword) {
        dataToSend.contrasenya = formData.nuevaPassword;  // ✅ usa contrasenya
        dataToSend.confirmarContrasenya = formData.confirmarPassword;  // ✅ añade confirmar
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

    // 💡 Actualizar localmente el estado para reflejar el cambio:
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

  if (!usuario) return <div>Cargando configuración...</div>;

  return (
    <div className="container mt-4">
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

      {/* Hover effect: activar/desactivar opacidad */}
      <style>{`
        .hover-overlay:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

import React, { useState } from 'react';
import axios from 'axios';

export default function Registro() {
  const [nomUsu, setNomUsu] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errores, setErrores] = useState({});
  const [registrando, setRegistrando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      nuevosErrores.confirmPassword = 'Las contraseñas no coinciden.';
      setErrores(nuevosErrores);
      return;
    }

    setErrores({}); // Limpiar errores anteriores
    setRegistrando(true); // Activar "Registrando..."

    try {
      await axios.post('/api/registro', { nom_usu: nomUsu, email, password }, { withCredentials: true });
      alert('Usuario registrado correctamente');
      window.location.href = '/login'; // Redirigir después de registrar
    } catch (error) {
      if (error.response && error.response.status === 409) {
        const message = error.response.data.message;

        if (message.includes('email')) {
          nuevosErrores.email = 'Este correo ya está registrado.';
        }
        if (message.includes('nombre de usuario')) {
          nuevosErrores.nomUsu = 'Este nombre de usuario ya está en uso.';
        }

        setErrores(nuevosErrores);
      } else {
        alert('Error desconocido al registrar.');
      }
    } finally {
      setRegistrando(false); // Siempre quitar "Registrando..." al terminar
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit} className="needs-validation">
        
        {/* Nombre de usuario */}
        <div className="mb-3 position-relative">
          <label className="form-label">Nombre de usuario</label>
          <input
            type="text"
            className={`form-control ${errores.nomUsu ? 'is-invalid' : ''}`}
            value={nomUsu}
            onChange={(e) => setNomUsu(e.target.value)}
          />
          {errores.nomUsu && (
            <div className="invalid-tooltip" style={{ display: 'block' }}>
              {errores.nomUsu}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="mb-3 position-relative">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className={`form-control ${errores.email ? 'is-invalid' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errores.email && (
            <div className="invalid-tooltip" style={{ display: 'block' }}>
              {errores.email}
            </div>
          )}
        </div>

        {/* Contraseña */}
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className={`form-control ${errores.confirmPassword ? 'is-invalid' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirmar contraseña */}
        <div className="mb-3 position-relative">
          <label className="form-label">Confirmar contraseña</label>
          <input
            type="password"
            className={`form-control ${errores.confirmPassword ? 'is-invalid' : ''}`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errores.confirmPassword && (
            <div className="invalid-tooltip" style={{ display: 'block' }}>
              {errores.confirmPassword}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={registrando}
        >
          {registrando ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
}

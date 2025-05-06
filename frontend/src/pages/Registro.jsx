import React, { useState } from 'react';
import axios from 'axios';
/*import './Registro.css';*/

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
  
    if (password !== confirmPassword) {
      nuevosErrores.confirmPassword = 'Las contraseñas no coinciden.';
    }
  
    if (password.length < 8) {
      nuevosErrores.password = 'La contraseña debe tener al menos 8 caracteres.';
    }
  
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }
  
    setErrores({});
    setRegistrando(true);
  
    try {
      await axios.post('/api/registro', { nom_usu: nomUsu, email, password }, { withCredentials: true });
      alert('Usuario registrado correctamente');
      window.location.href = '/login';
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
      setRegistrando(false);
    }
  };
  

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="card p-4 shadow">
        <h2 className="card-title">Registro</h2>
        <form onSubmit={handleSubmit} className="needs-validation">
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

          <div className="mb-3 position-relative">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className={`form-control ${errores.password ? 'is-invalid' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errores.password && (
              <div className="invalid-feedback" style={{ display: 'block' }}>
                {errores.password}
              </div>
            )}
          </div>


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

        <div className="text-center mt-3">
          <span>¿Ya tienes una cuenta? </span>
          <a href="/login" className="text-primary fw-bold" style={{ textDecoration: 'none' }}>
            Inicia sesión
          </a>
        </div>
      </div>
    </div>
  );
}

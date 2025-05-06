import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import PerfilUsuario from './pages/PerfilUsuario';

export default function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          isLoggedIn ? <Navigate to="/" replace /> : <Login />
        }
      />

      {/* Registro */}
      <Route
        path="/registro"
        element={
          isLoggedIn ? <Navigate to="/" replace /> : <Registro />
        }
      />

      {/* Home (pública) */}
      <Route path="/" element={<Home />} />

      {/* Perfil de usuario (carga usuarioActual solo aquí) */}
      <Route
        path="/usuario/:username"
        element={<PerfilUsuario />}
      />

      {/* Cualquier otra ruta, redirige a Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import axios from 'axios';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import PerfilUsuario from './pages/PerfilUsuario';

export default function App() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargandoUsuario, setCargandoUsuario] = useState(true);

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchUsuarioActual = async () => {
      if (isLoggedIn) {
        try {
          const response = await axios.get('/api/usuario/yo', { withCredentials: true });
          setUsuarioActual(response.data);
        } catch (error) {
          console.warn('No autenticado o error al obtener usuario actual');
          setUsuarioActual(null);
        }
      }
      setCargandoUsuario(false);
    };

    fetchUsuarioActual();
  }, [isLoggedIn]);

  // 🔽 Mientras carga usuario actual, solo espera (pero solo si estás logueado)
  if (isLoggedIn && cargandoUsuario) {
    return <div>Cargando usuario actual...</div>;
  }

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          isLoggedIn
            ? <Navigate to="/" replace />
            : <Login />
        }
      />

      {/* Registro */}
      <Route
        path="/registro"
        element={
          isLoggedIn
            ? <Navigate to="/" replace />
            : <Registro />
        }
      />

      {/* Home (pública) */}
      <Route path="/" element={<Home usuarioActual={usuarioActual} />} />

      {/* Perfil de usuario */}
      <Route path="/usuario/:username" element={<PerfilUsuario usuarioActual={usuarioActual} />} />

      {/* Cualquier otra ruta, redirige a Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

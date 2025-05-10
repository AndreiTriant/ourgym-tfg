import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import SuscripcionPremium from './pages/SuscripcionPremium';
import Guardados from './pages/Guardados';
import Configuracion from './pages/Configuracion';

import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import PerfilUsuario from './pages/PerfilUsuario';

export default function App() {
  const [usuarioActual, setUsuarioActual] = useState(null);
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
    };

    fetchUsuarioActual();
  }, [isLoggedIn]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? <Navigate to="/" replace /> : <Login />
        }
      />

      <Route
        path="/registro"
        element={
          isLoggedIn ? <Navigate to="/" replace /> : <Registro />
        }
      />

      <Route path="/" element={<Home usuarioActual={usuarioActual} />} />

      <Route
        path="/usuario/:username"
        element={<PerfilUsuario usuarioActual={usuarioActual} />}
      />

      <Route
        path="/suscripcion"
        element={<SuscripcionPremium />}
      />

      <Route
        path="/guardados"
        element={<Guardados />}
      />

      <Route path="/configuracion" element={<Configuracion />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
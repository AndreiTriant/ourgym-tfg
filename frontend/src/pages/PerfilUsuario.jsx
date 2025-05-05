import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PerfilUsuario() {
  const { username } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/usuarios/username/${username}`);
        if (!response.ok) {
          throw new Error('Usuario no encontrado');
        }
        const data = await response.json();
        setUsuario(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchUsuario();
  }, [username]);

  if (cargando) return <div>Cargando perfil...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Perfil de {usuario.nomUsu}</h1>
      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Fecha de creación:</strong> {usuario.fechaCreacion}</p>
    </div>
  );
}

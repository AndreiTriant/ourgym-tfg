import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Feed from '../components/Feed';

export default function PerfilUsuario() {
  const { username } = useParams();
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('publicaciones');
  const [publicaciones, setPublicaciones] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const [userResponse, actualResponse] = await Promise.all([
          fetch(`/api/usuarios/username/${username}`).then(res => res.json()),
          axios.get('/api/usuario/yo', { withCredentials: true }).then(res => res.data).catch(() => null),
        ]);

        setUsuario(userResponse);
        setUsuarioActual(actualResponse);

        const pubsData = await fetch(`/api/usuarios/${userResponse.id}/publicaciones`).then(res => res.json());
        setPublicaciones(pubsData);

        const commentsData = await fetch(`/api/usuarios/${userResponse.id}/comentarios`).then(res => res.json());
        setComentarios(commentsData);

        const likesData = await fetch(`/api/usuarios/${userResponse.id}/likes`).then(res => res.json());
        setLikes(likesData);

      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchPerfil();
  }, [username]);

  if (cargando) return <div>Cargando perfil...</div>;
  if (error) return <div>Error: {error}</div>;

  const esMiPerfil = usuarioActual && usuarioActual.id === usuario.id;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Perfil de {usuario.nomUsu}</h1>
      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Fecha de creación:</strong> {usuario.fechaCreacion}</p>
      <p><strong>Descripción:</strong> {usuario.descripcion || 'Sin descripción'}</p>

      {esMiPerfil && (
        <button onClick={() => alert('Aquí iría la lógica para editar tu perfil')}>
          ✏️ Editar mi perfil
        </button>
      )}

      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => setActiveTab('publicaciones')}>📝 Publicaciones</button>
        <button onClick={() => setActiveTab('comentarios')}>💬 Comentarios</button>
        <button onClick={() => setActiveTab('likes')}>❤️ Likes</button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {/* Mantener montados todos los bloques, mostrando solo el activo */}
        <div style={{ display: activeTab === 'publicaciones' ? 'block' : 'none' }}>
          <h2>Publicaciones</h2>
          <Feed publicaciones={publicaciones} usuarioActual={usuarioActual} />
        </div>

        <div style={{ display: activeTab === 'comentarios' ? 'block' : 'none' }}>
          <h2>Comentarios</h2>
          {comentarios.length === 0 ? (
            <p>Este usuario no ha hecho comentarios aún.</p>
          ) : (
            <div className="posts-container">
              {comentarios.map((comentario) => (
                <div key={comentario.id} className="post border rounded p-3 mb-4 bg-white">
                  <div className="d-flex align-items-center mb-2">
                    <strong>En publicación:</strong>&nbsp;
                    <span>{comentario.publicacion_descripcion}</span>
                  </div>
                  <p>{comentario.contenido}</p>
                  <small className="text-muted">{comentario.fecha}</small>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: activeTab === 'likes' ? 'block' : 'none' }}>
          {likes.length > 0 ? (
            likes.map((like) => (
              <div key={like.id} className="border p-2 mb-2 rounded bg-white">
                <strong>En publicación:</strong> {like.descripcion}
              </div>
            ))
          ) : (
            <div className="alert alert-info">
              Este usuario no ha dado like a ninguna publicación.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

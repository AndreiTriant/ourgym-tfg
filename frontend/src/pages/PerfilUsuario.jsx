import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Feed from '../components/Feed';

export default function PerfilUsuario({ usuarioActual }) {
  const { username } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [likes, setLikes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('publicaciones');


  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const userResponse = await fetch(`/api/usuarios/username/${username}`);
        if (!userResponse.ok) throw new Error('Usuario no encontrado');
        const userData = await userResponse.json();
        setUsuario(userData);

        const pubsResponse = await fetch(`/api/usuarios/${userData.id}/publicaciones`);
        if (!pubsResponse.ok) throw new Error('Error al cargar publicaciones');
        const pubsData = await pubsResponse.json();
        setPublicaciones(pubsData);

        const commentsResponse = await fetch(`/api/usuarios/${userData.id}/comentarios`);
        if (!commentsResponse.ok) throw new Error('Error al cargar comentarios');
        const commentsData = await commentsResponse.json();
        setComentarios(commentsData);

        const likesResponse = await fetch(`/api/usuarios/${userData.id}/likes`);
        if (!likesResponse.ok) throw new Error('Error al cargar likes');
        const likesData = await likesResponse.json();
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
        {activeTab === 'publicaciones' && (
          <>
            <h2>Publicaciones</h2>
            <Feed publicaciones={publicaciones} />
          </>
        )}

        {activeTab === 'comentarios' && (
          <>
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
          </>
        )}



{activeTab === 'likes' && (
  <div>
    {/* Aquí pones el bloque que te pasé */}
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
)}




      </div>
    </div>
  );
}

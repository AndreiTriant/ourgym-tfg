import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

export default function Feed() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [puntuaciones, setPuntuaciones] = useState({});
  const [cargando, setCargando] = useState(true);

  const fetchData = async () => {
    try {
      const [pubsResponse, puntosResponse] = await Promise.all([
        axios.get('/api/publicaciones'),
        axios.get('/api/publicaciones/puntuaciones')
      ]);
      setPublicaciones(pubsResponse.data);
      setPuntuaciones(puntosResponse.data);
    } catch (error) {
      console.error('Error al cargar publicaciones o puntuaciones:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLike = async (publicacionId) => {
    try {
      await axios.post(`/api/publicacion/${publicacionId}/like`, {}, { withCredentials: true });
      fetchData(); // Recarga los datos sin recargar la página
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const handleDislike = async (publicacionId) => {
    try {
      await axios.post(`/api/publicacion/${publicacionId}/dislike`, {}, { withCredentials: true });
      fetchData(); // Recarga los datos sin recargar la página
    } catch (error) {
      console.error('Error al dar dislike:', error);
    }
  };

  return (
    <div className="feed">
      {/* Caja de nueva publicación */}
      <div className="new-post">
        <div className="d-flex mb-2">
          <img
            src="https://via.placeholder.com/40"
            className="profile-pic me-2"
            alt="perfil"
          />
          <input className="form-control" placeholder="¿Qué está pasando?" />
        </div>
        <div className="text-end">
          <Button variant="secondary">Postear</Button>
        </div>
      </div>

      {/* Loader mientras se cargan las publicaciones */}
      {cargando ? (
        <div className="loader"></div>
      ) : (
        <>
          {publicaciones.length === 0 ? (
            <p className="text-center text-muted">📄 Todavía no hay publicaciones.</p>
          ) : (
            publicaciones.map((publi) => (
              <div key={publi.id} className="post">
                <div className="d-flex align-items-center mb-2">
                  <img
                    src="https://via.placeholder.com/40"
                    className="profile-pic me-2"
                    alt="perfil"
                  />
                  <strong>Usuario {publi.usuario_id}</strong>
                </div>

                {publi.imagen && (
                  <img
                    src={publi.imagen}
                    alt="Publicación"
                    className="img-fluid rounded"
                  />
                )}

                <p className="mt-2 mb-0">{publi.descripcion}</p>
                <div className="text-muted small mb-2">
                  {new Date(publi.fecha).toLocaleString()}
                </div>

                {/* Puntuación */}
                <div className="mb-2">
                  <strong>Puntuación: {puntuaciones[publi.id] ?? 0}</strong>
                </div>

                {/* Botones de Like y Dislike */}
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => handleLike(publi.id)}>
                    👍 Like
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDislike(publi.id)}>
                    👎 Dislike
                  </Button>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}

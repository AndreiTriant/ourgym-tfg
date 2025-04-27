import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

export default function Feed() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [puntuaciones, setPuntuaciones] = useState({});
  const [reacciones, setReacciones] = useState({});
  const [cargando, setCargando] = useState(true);

  const fetchData = async () => {
    try {
      const [pubsResponse, puntosResponse, reaccionesResponse] = await Promise.all([
        axios.get('/api/publicaciones'),
        axios.get('/api/publicaciones/puntuaciones'),
        axios.get('/api/reacciones', { withCredentials: true })
      ]);
      setPublicaciones(pubsResponse.data);
      
      // Aseguramos que las puntuaciones siempre sean números
      setPuntuaciones(Object.fromEntries(
        Object.entries(puntosResponse.data).map(([key, value]) => [key, Number(value)])
      ));

      setReacciones(reaccionesResponse.data);
    } catch (error) {
      console.error('Error al cargar publicaciones, puntuaciones o reacciones:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLike = async (publicacionId) => {
    const reaccionActual = reacciones[publicacionId] ?? null;
    const nuevaReaccion = reaccionActual === 'like' ? null : 'like';

    // Actualizamos puntuaciones
    setPuntuaciones((prev) => ({
      ...prev,
      [publicacionId]: (prev[publicacionId] ?? 0) +
        (reaccionActual === 'like' ? -1 : reaccionActual === 'dislike' ? 2 : 1)
    }));

    // Actualizamos reacciones
    setReacciones((prev) => ({
      ...prev,
      [publicacionId]: nuevaReaccion
    }));

    try {
      await axios.post(`/api/publicacion/${publicacionId}/like`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Error al dar like:', error);
    }
  };

  const handleDislike = async (publicacionId) => {
    const reaccionActual = reacciones[publicacionId] ?? null;
    const nuevaReaccion = reaccionActual === 'dislike' ? null : 'dislike';

    setPuntuaciones((prev) => ({
      ...prev,
      [publicacionId]: (prev[publicacionId] ?? 0) +
        (reaccionActual === 'dislike' ? 1 : reaccionActual === 'like' ? -2 : -1)
    }));

    setReacciones((prev) => ({
      ...prev,
      [publicacionId]: nuevaReaccion
    }));

    try {
      await axios.post(`/api/publicacion/${publicacionId}/dislike`, {}, { withCredentials: true });
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
            publicaciones.map((publi) => {
              const puntuacion = puntuaciones[publi.id] ?? 0;
              const reaccion = reacciones[publi.id] ?? null;

              return (
                <div key={publi.id} className="post">
                  <div className="d-flex align-items-center mb-2">
                    <img
                      src="https://via.placeholder.com/40"
                      className="profile-pic me-2"
                      alt="perfil"
                    />
                    <strong>{publi.usuario_nombre ?? `Usuario ${publi.usuario_id}`}</strong>
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
                    <strong>Puntuación: {Number(puntuacion)}</strong>
                  </div>

                  {/* Botones de Like y Dislike */}
                  <div className="d-flex gap-2">
                    <Button
                      variant={reaccion === 'like' ? 'primary' : 'outline-primary'}
                      size="sm"
                      onClick={() => handleLike(publi.id)}
                    >
                      👍 Like
                    </Button>
                    <Button
                      variant={reaccion === 'dislike' ? 'danger' : 'outline-danger'}
                      size="sm"
                      onClick={() => handleDislike(publi.id)}
                    >
                      👎 Dislike
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </>
      )}
    </div>
  );
}

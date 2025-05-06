import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

export default function FeedInteractivo({ publicaciones }) {
  const [puntuaciones, setPuntuaciones] = useState({});
  const [reacciones, setReacciones] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [comentariosVisibles, setComentariosVisibles] = useState({});
  const [mostrarCajaComentar, setMostrarCajaComentar] = useState({});
  const [contenidoComentario, setContenidoComentario] = useState({});
  const [usuarioActual, setUsuarioActual] = useState({ nombre: "Tú" });
  const [conteosComentarios, setConteosComentarios] = useState({});

  // Cargar puntuaciones y reacciones solo para estas publicaciones
  const fetchExtraData = useCallback(async () => {
    try {
      const [puntosResponse, reaccionesResponse] = await Promise.all([
        axios.get("/api/publicaciones/puntuaciones"),
        axios.get("/api/reacciones", { withCredentials: true }),
      ]);
      setPuntuaciones(puntosResponse.data || {});
      setReacciones(reaccionesResponse.data || {});

      const usuarioResponse = await axios.get("/api/usuario/actual", {
        withCredentials: true,
      });
      setUsuarioActual(usuarioResponse.data);
    } catch (error) {
      console.error("Error al cargar datos extra:", error);
    }
  }, []);

  useEffect(() => {
    if (publicaciones.length > 0) {
      fetchExtraData();
    }
  }, [publicaciones, fetchExtraData]);

  const handleLike = async (publicacionId) => {
    const reaccionActual = reacciones[publicacionId];
    const nuevaReaccion = reaccionActual === "like" ? null : "like";

    setPuntuaciones((prev) => ({
      ...prev,
      [publicacionId]:
        (parseInt(prev[publicacionId]) || 0) +
        (reaccionActual === "like" ? -1 : reaccionActual === "dislike" ? 2 : 1),
    }));
    setReacciones((prev) => ({ ...prev, [publicacionId]: nuevaReaccion }));

    try {
      await axios.post(
        `/api/publicacion/${publicacionId}/like`,
        {},
        { withCredentials: true }
      );
    } catch (e) {
      console.error("Error al dar like:", e);
    }
  };

  const handleDislike = async (publicacionId) => {
    const reaccionActual = reacciones[publicacionId];
    const nuevaReaccion = reaccionActual === "dislike" ? null : "dislike";

    setPuntuaciones((prev) => ({
      ...prev,
      [publicacionId]:
        (parseInt(prev[publicacionId]) || 0) +
        (reaccionActual === "dislike"
          ? 1
          : reaccionActual === "like"
          ? -2
          : -1),
    }));
    setReacciones((prev) => ({ ...prev, [publicacionId]: nuevaReaccion }));

    try {
      await axios.post(
        `/api/publicacion/${publicacionId}/dislike`,
        {},
        { withCredentials: true }
      );
    } catch (e) {
      console.error("Error al dar dislike:", e);
    }
  };

  const toggleComentarios = async (publicacionId) => {
    if (comentariosVisibles[publicacionId]) {
      setComentariosVisibles((prev) => ({
        ...prev,
        [publicacionId]: false,
      }));
      return;
    }

    try {
      const comentariosResponse = await axios.get(
        `/api/publicacion/${publicacionId}/comentarios`,
        { withCredentials: true }
      );
      setComentarios((prev) => ({
        ...prev,
        [publicacionId]: comentariosResponse.data,
      }));
    } catch (e) {
      console.error("Error al cargar comentarios:", e);
    }

    setComentariosVisibles((prev) => ({
      ...prev,
      [publicacionId]: true,
    }));
  };

  const handleComentar = async (publicacionId) => {
    const texto = contenidoComentario[publicacionId]?.trim();
    if (!texto) return;

    try {
      await axios.post(
        `/api/publicacion/${publicacionId}/comentar`,
        { contenido: texto },
        { withCredentials: true }
      );
      setContenidoComentario((prev) => ({ ...prev, [publicacionId]: "" }));
      toggleComentarios(publicacionId); // recargar comentarios
    } catch (e) {
      console.error("Error al comentar:", e);
    }
  };

  return (
    <div className="posts-container">
      {publicaciones.map((publi) => (
        <div key={publi.id} className="post border rounded p-3 mb-4 bg-white">
          <div className="d-flex align-items-center mb-2">
            <strong>{publi.usuario_nombre ?? `Usuario ${publi.usuario_id}`}</strong>
            <span className="badge bg-info ms-2">
              {publi.tipo === "RUTINA"
                ? "🏋️ Rutina"
                : publi.tipo === "DIETA"
                ? "🍽️ Dieta"
                : "📝 Post"}
            </span>
          </div>
          {publi.imagen && (
            <img
              src={`http://localhost:8080${publi.imagen}`}
              alt="Publicación"
              className="img-fluid rounded mb-2"
            />
          )}
          <p>{publi.descripcion}</p>

          <div className="d-flex gap-2 mb-2">
            <Button
              variant={
                reacciones[publi.id] === "like"
                  ? "primary"
                  : "outline-primary"
              }
              size="sm"
              onClick={() => handleLike(publi.id)}
            >
              👍 Like
            </Button>
            <Button
              variant={
                reacciones[publi.id] === "dislike"
                  ? "danger"
                  : "outline-danger"
              }
              size="sm"
              onClick={() => handleDislike(publi.id)}
            >
              👎 Dislike
            </Button>
            <span>
              <strong>Puntuación: {puntuaciones[publi.id] ?? 0}</strong>
            </span>
          </div>

          <div className="d-flex gap-2">
            <Button
              variant="success"
              size="sm"
              onClick={() =>
                setMostrarCajaComentar((prev) => ({
                  ...prev,
                  [publi.id]: !prev[publi.id],
                }))
              }
            >
              {mostrarCajaComentar[publi.id] ? "Cancelar" : "Comentar"}
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => toggleComentarios(publi.id)}
            >
              {comentariosVisibles[publi.id]
                ? "Ocultar comentarios"
                : "Mostrar comentarios"}
            </Button>
          </div>

          {mostrarCajaComentar[publi.id] && (
            <div className="mt-3">
              <textarea
                className="form-control mb-2"
                placeholder="Escribe un comentario..."
                rows={2}
                value={contenidoComentario[publi.id] || ""}
                onChange={(e) =>
                  setContenidoComentario((prev) => ({
                    ...prev,
                    [publi.id]: e.target.value,
                  }))
                }
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleComentar(publi.id)}
              >
                Enviar
              </Button>
            </div>
          )}

          {comentariosVisibles[publi.id] &&
            (comentarios[publi.id]?.length > 0 ? (
              <ul className="mt-2">
                {comentarios[publi.id].map((c) => (
                  <li key={c.id}>
                    <strong>{c.usuario_nombre ?? "Usuario"}:</strong>{" "}
                    {c.contenido}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="alert alert-info mt-2">
                No hay comentarios aún.
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

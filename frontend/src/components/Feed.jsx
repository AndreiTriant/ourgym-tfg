import React, { useEffect, useState, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

export default function Feed() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [puntuaciones, setPuntuaciones] = useState({});
  const [reacciones, setReacciones] = useState({});
  const [comentarios, setComentarios] = useState({});
  const [comentariosVisibles, setComentariosVisibles] = useState({});
  const [mostrarCajaComentar, setMostrarCajaComentar] = useState({});
  const [contenidoComentario, setContenidoComentario] = useState({});
  const [mostrarCajaResponder, setMostrarCajaResponder] = useState({});
  const [contenidoRespuesta, setContenidoRespuesta] = useState({});
  const [reaccionesComentarios, setReaccionesComentarios] = useState({});
  const [respuestasVisibles, setRespuestasVisibles] = useState({});
  const [cargando, setCargando] = useState(true);
  const [usuarioActual, setUsuarioActual] = useState({ nombre: 'Tú' });
  
  // ⭐ Función mejorada para cargar reacciones y puntuaciones de comentarios
  const cargarReaccionesComentarios = useCallback(async () => {
    try {
      // Obtener reacciones de comentarios del usuario actual
      const reaccionesComentariosResponse = await axios.get('/api/reacciones/comentarios', { 
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        params: { _t: new Date().getTime() }
      });
      
      // Obtener puntuaciones actualizadas de comentarios
      const puntuacionesComentariosResponse = await axios.get('/api/comentarios/puntuaciones', {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        params: { _t: new Date().getTime() }
      });
      
      // Actualizar las reacciones (like/dislike)
      if (reaccionesComentariosResponse.data) {
        setReaccionesComentarios(prevReacciones => {
          const reaccionesActualizadas = { ...prevReacciones };
          Object.entries(reaccionesComentariosResponse.data).forEach(([id, valor]) => {
            reaccionesActualizadas[id] = valor;
          });
          return reaccionesActualizadas;
        });
      }
      
      // Actualizar las puntuaciones de todos los comentarios
      if (puntuacionesComentariosResponse.data) {
        // Actualizar las puntuaciones en el estado de comentarios
        setComentarios(prevComentarios => {
          const comentariosActualizados = { ...prevComentarios };
          
          // Recorrer todas las publicaciones
          Object.keys(comentariosActualizados).forEach(publicacionId => {
            if (comentariosActualizados[publicacionId] && comentariosActualizados[publicacionId].length > 0) {
              // Actualizar la puntuación de cada comentario
              comentariosActualizados[publicacionId] = comentariosActualizados[publicacionId].map(comentario => {
                if (puntuacionesComentariosResponse.data[comentario.id] !== undefined) {
                  return {
                    ...comentario,
                    puntuacion: puntuacionesComentariosResponse.data[comentario.id]
                  };
                }
                return comentario;
              });
            }
          });
          
          return comentariosActualizados;
        });
      }
    } catch (e) {
      console.error('Error al cargar reacciones o puntuaciones de comentarios:', e);
    }
  }, []);

  // ⭐ Función mejorada para cargar comentarios específicos
  const fetchComentarios = useCallback(async (publicacionId) => {
    try {
      const comentariosResponse = await axios.get(`/api/publicacion/${publicacionId}/comentarios`, { withCredentials: true });
      
      // ⭐ Usamos un callback en setComentarios para asegurar que trabajamos con el estado más reciente
      setComentarios(prevComentarios => ({
        ...prevComentarios,
        [publicacionId]: comentariosResponse.data
      }));
      
      // Solo actualizamos las reacciones relacionadas con estos comentarios
      await cargarReaccionesComentarios();
    } catch (error) {
      console.error(`Error al cargar comentarios de la publicación ${publicacionId}:`, error);
    }
  }, [cargarReaccionesComentarios]);

  // Carga inicial de datos
  const fetchData = useCallback(async () => {
    try {
      // Primero obtener las publicaciones
      const pubsResponse = await axios.get('/api/publicaciones');
      setPublicaciones(pubsResponse.data);
      
      // Cargar puntuaciones y reacciones
      try {
        const [puntosResponse, reaccionesResponse] = await Promise.all([
          axios.get('/api/publicaciones/puntuaciones'),
          axios.get('/api/reacciones', { withCredentials: true })
        ]);
        
        setPuntuaciones(Object.fromEntries(Object.entries(puntosResponse.data || {})));
        setReacciones(reaccionesResponse.data || {});
      } catch (e) {
        console.error('Error al cargar puntuaciones o reacciones:', e);
      }

      // ⭐ Cargar los comentarios de manera optimizada
      const comentariosData = {};
      for (const publi of pubsResponse.data) {
        try {
          const comentariosResponse = await axios.get(`/api/publicacion/${publi.id}/comentarios`, { withCredentials: true });
          comentariosData[publi.id] = comentariosResponse.data;
        } catch (e) {
          console.error(`Error al cargar comentarios para publicación ${publi.id}:`, e);
          comentariosData[publi.id] = []; // Asegurarnos de que existe la entrada
        }
      }
      setComentarios(comentariosData);

      // Cargar reacciones de comentarios
      await cargarReaccionesComentarios();

      // Intentar obtener información del usuario
      try {
        const usuarioResponse = await axios.get('/api/usuario/actual', { withCredentials: true });
        setUsuarioActual(usuarioResponse.data);
      } catch (e) {
        console.log('No se pudo obtener la información del usuario actual');
      }

    } catch (error) {
      console.error('Error al cargar publicaciones:', error);
    } finally {
      setCargando(false);
    }
  }, [cargarReaccionesComentarios]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ⭐ Funciones optimizadas para las reacciones a publicaciones
  const handleLike = async (publicacionId) => {
    const reaccionActual = reacciones[publicacionId];
    const nuevaReaccion = reaccionActual === 'like' ? null : 'like';
    
    // Actualizar localmente primero para feedback inmediato
    setPuntuaciones(prev => ({
      ...prev,
      [publicacionId]: (parseInt(prev[publicacionId]) || 0) + (reaccionActual === 'like' ? -1 : reaccionActual === 'dislike' ? 2 : 1)
    }));
    setReacciones(prev => ({ ...prev, [publicacionId]: nuevaReaccion }));
    
    // Enviar al servidor sin esperar recarga completa
    try { 
      await axios.post(`/api/publicacion/${publicacionId}/like`, {}, { withCredentials: true }); 
    } catch (e) {
      console.error('Error al dar like:', e);
      // Revertir cambios locales en caso de error
      setPuntuaciones(prev => ({
        ...prev,
        [publicacionId]: (parseInt(prev[publicacionId]) || 0) - (reaccionActual === 'like' ? -1 : reaccionActual === 'dislike' ? 2 : 1)
      }));
      setReacciones(prev => ({ ...prev, [publicacionId]: reaccionActual }));
    }
  };

  const handleDislike = async (publicacionId) => {
    const reaccionActual = reacciones[publicacionId];
    const nuevaReaccion = reaccionActual === 'dislike' ? null : 'dislike';
    
    // Actualizar localmente primero para feedback inmediato
    setPuntuaciones(prev => ({
      ...prev,
      [publicacionId]: (parseInt(prev[publicacionId]) || 0) + (reaccionActual === 'dislike' ? 1 : reaccionActual === 'like' ? -2 : -1)
    }));
    setReacciones(prev => ({ ...prev, [publicacionId]: nuevaReaccion }));
    
    // Enviar al servidor sin esperar recarga completa
    try { 
      await axios.post(`/api/publicacion/${publicacionId}/dislike`, {}, { withCredentials: true }); 
    } catch (e) {
      console.error('Error al dar dislike:', e);
      // Revertir cambios locales en caso de error
      setPuntuaciones(prev => ({
        ...prev,
        [publicacionId]: (parseInt(prev[publicacionId]) || 0) - (reaccionActual === 'dislike' ? 1 : reaccionActual === 'like' ? -2 : -1)
      }));
      setReacciones(prev => ({ ...prev, [publicacionId]: reaccionActual }));
    }
  };

  // ⭐ Funciones optimizadas para reacciones a comentarios
  const likeComentario = async (comentarioId, publicacionId) => {
    const reaccionActual = reaccionesComentarios[comentarioId];
    const nuevaReaccion = reaccionActual === 'like' ? null : 'like';
    
    // Calcular ajuste de puntuación
    let ajuste = 0;
    if (reaccionActual === 'like') {
      ajuste = -1; // Quitar like
    } else if (reaccionActual === 'dislike') {
      ajuste = 2;  // Cambiar de dislike a like: +2
    } else {
      ajuste = 1;  // Nuevo like
    }
    
    // Actualizar estados locales inmediatamente
    setComentarios(prev => ({
      ...prev,
      [publicacionId]: prev[publicacionId].map(c => 
        c.id === comentarioId ? { ...c, puntuacion: (c.puntuacion ?? 0) + ajuste } : c
      )
    }));
    
    setReaccionesComentarios(prev => ({ ...prev, [comentarioId]: nuevaReaccion }));
    
    // Enviar al servidor sin recargar todo
    try { 
      await axios.post(`/api/reaccion-comentario/${comentarioId}/like`, {}, { 
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
    } catch (e) {
      console.error(`Error al dar like al comentario ${comentarioId}:`, e);
      // Revertir cambios locales en caso de error
      setComentarios(prev => ({
        ...prev,
        [publicacionId]: prev[publicacionId].map(c => 
          c.id === comentarioId ? { ...c, puntuacion: (c.puntuacion ?? 0) - ajuste } : c
        )
      }));
      setReaccionesComentarios(prev => ({ ...prev, [comentarioId]: reaccionActual }));
    }
  };

  const dislikeComentario = async (comentarioId, publicacionId) => {
    const reaccionActual = reaccionesComentarios[comentarioId];
    const nuevaReaccion = reaccionActual === 'dislike' ? null : 'dislike';
    
    // Calcular ajuste de puntuación
    let ajuste = 0;
    if (reaccionActual === 'dislike') {
      ajuste = 1; // Quitar dislike
    } else if (reaccionActual === 'like') {
      ajuste = -2; // Cambiar de like a dislike: -2
    } else {
      ajuste = -1; // Nuevo dislike
    }
    
    // Actualizar estados locales inmediatamente
    setComentarios(prev => ({
      ...prev,
      [publicacionId]: prev[publicacionId].map(c => 
        c.id === comentarioId ? { ...c, puntuacion: (c.puntuacion ?? 0) + ajuste } : c
      )
    }));
    
    setReaccionesComentarios(prev => ({ ...prev, [comentarioId]: nuevaReaccion }));
    
    // Enviar al servidor sin recargar todo
    try { 
      await axios.post(`/api/reaccion-comentario/${comentarioId}/dislike`, {}, { 
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
    } catch (e) {
      console.error(`Error al dar dislike al comentario ${comentarioId}:`, e);
      // Revertir cambios locales en caso de error
      setComentarios(prev => ({
        ...prev,
        [publicacionId]: prev[publicacionId].map(c => 
          c.id === comentarioId ? { ...c, puntuacion: (c.puntuacion ?? 0) - ajuste } : c
        )
      }));
      setReaccionesComentarios(prev => ({ ...prev, [comentarioId]: reaccionActual }));
    }
  };

  // Toggle para mostrar/ocultar comentarios
  const toggleComentarios = (publicacionId) => {
    setComentariosVisibles(prev => ({ ...prev, [publicacionId]: !prev[publicacionId] }));
  };

  // Mostrar/Ocultar caja para comentar
  const toggleCajaComentar = (publicacionId) => {
    setMostrarCajaComentar(prev => ({ ...prev, [publicacionId]: !prev[publicacionId] }));
    // Limpiar el campo de texto al cerrar
    if (mostrarCajaComentar[publicacionId]) {
      setContenidoComentario(prev => ({ ...prev, [publicacionId]: '' }));
    }
  };

  // Mostrar/Ocultar caja para responder a un comentario
  const toggleCajaResponder = (comentarioId) => {
    setMostrarCajaResponder(prev => ({ ...prev, [comentarioId]: !prev[comentarioId] }));
    // Limpiar el campo de texto al cerrar
    if (mostrarCajaResponder[comentarioId]) {
      setContenidoRespuesta(prev => ({ ...prev, [comentarioId]: '' }));
    }
  };

  // Toggle para mostrar/ocultar respuestas
  const toggleRespuestas = (comentarioId) => {
    setRespuestasVisibles(prev => ({ ...prev, [comentarioId]: !prev[comentarioId] }));
  };

  // ⭐ Función optimizada para obtener el comentario padre
  const obtenerComentarioPadre = useCallback((comentarioId, publicacionId) => {
    const comentariosPublicacion = comentarios[publicacionId] || [];
    const comentario = comentariosPublicacion.find(c => c.id === comentarioId);
    
    if (!comentario || !comentario.respuestaA) {
      return comentarioId; // Es un comentario principal o no existe
    }
    
    // Buscar recursivamente hasta encontrar el comentario principal
    return obtenerComentarioPadre(comentario.respuestaA, publicacionId);
  }, [comentarios]);

  // ⭐ Función optimizada para comentar o responder
  const handleComentar = async (publicacionId, respuestaA = null, usuarioNombre = '') => {
    let texto = respuestaA ? contenidoRespuesta[respuestaA] : contenidoComentario[publicacionId];
    if (!texto?.trim()) return;

    // Guardar el texto para usarlo en la petición
    const contenidoParaEnviar = texto.trim();

    // Limpiar el contenido ANTES de cerrar la caja
    if (respuestaA) {
      // Limpiar el campo de respuesta
      setContenidoRespuesta(prev => ({ ...prev, [respuestaA]: '' }));
      // Cerrar la caja de responder
      setMostrarCajaResponder(prev => ({ ...prev, [respuestaA]: false }));
    } else {
      // Limpiar el campo de comentario
      setContenidoComentario(prev => ({ ...prev, [publicacionId]: '' }));
      // Cerrar la caja de comentar
      setMostrarCajaComentar(prev => ({ ...prev, [publicacionId]: false }));
    }

    // Asegurarse de que el nombre de usuario esté en la respuesta
    let textoFinal = contenidoParaEnviar;
    if (respuestaA && usuarioNombre && !textoFinal.startsWith(`@${usuarioNombre} `)) {
      textoFinal = `@${usuarioNombre} ` + textoFinal;
    }

    // Encontrar el comentario padre para agrupar las respuestas
    const comentarioPadreId = respuestaA ? obtenerComentarioPadre(respuestaA, publicacionId) : null;
    
    // Crear nuevo comentario localmente con ID temporal
    const nuevoComentarioId = `temp-${Math.random().toString(36).substring(2)}`;
    const nuevoComentario = {
      id: nuevoComentarioId,
      contenido: textoFinal,
      fecha: new Date().toISOString(),
      usuario_nombre: usuarioActual.nombre || 'Tú',
      respuestaA: comentarioPadreId,
      puntuacion: 0,
      respondidoA: respuestaA !== comentarioPadreId ? respuestaA : null,
      respondidoUsuario: respuestaA !== comentarioPadreId ? usuarioNombre : null,
      _esNuevo: true // Marcador para identificar comentarios nuevos
    };

    // Actualizar la UI inmediatamente
    setComentarios(prev => {
      const comentariosActualizados = [...(prev[publicacionId] || [])];
      // Evitar duplicados por actualización múltiple
      if (!comentariosActualizados.some(c => c.contenido === textoFinal && c._esNuevo)) {
        comentariosActualizados.push(nuevoComentario);
      }
      return {
        ...prev,
        [publicacionId]: comentariosActualizados
      };
    });

    // Preparar payload para API
    const payload = {
      contenido: textoFinal,
      respuestaA: comentarioPadreId
    };
    
    // Añadir info de respuesta si es necesario
    if (respuestaA !== comentarioPadreId) {
      payload.respondidoA = respuestaA;
      payload.respondidoUsuario = usuarioNombre;
    }

    // Enviar al servidor
    try {
      const response = await axios.post(`/api/publicacion/${publicacionId}/comentar`, payload, { withCredentials: true });
      
      // Actualizar comentario con ID real del servidor
      if (response.data && response.data.id) {
        setComentarios(prev => ({
          ...prev,
          [publicacionId]: prev[publicacionId].map(c => 
            c.id === nuevoComentarioId ? { ...c, id: response.data.id, _esNuevo: false } : c
          )
        }));
      }
      
      // Solo actualizamos los comentarios de esta publicación
      await fetchComentarios(publicacionId);
    } catch (e) {
      console.error('Error al enviar comentario:', e);
      // Quitar comentario local si falla
      setComentarios(prev => ({
        ...prev,
        [publicacionId]: prev[publicacionId].filter(c => c.id !== nuevoComentarioId)
      }));
    }
    
    // Asegurar visibilidad de comentarios
    setComentariosVisibles(prev => ({ ...prev, [publicacionId]: true }));
    if (comentarioPadreId) {
      setRespuestasVisibles(prev => ({ ...prev, [comentarioPadreId]: true }));
    }
  };

  // Formatear contenido del comentario
  const formatearContenidoComentario = (comentario) => {
    if (comentario.respondidoA && comentario.respondidoUsuario) {
      return (
        <>
          <strong>{comentario.usuario_nombre ?? 'Usuario'}</strong> ➔ {comentario.contenido}
        </>
      );
    }
    
    return (
      <>
        <div><strong>{comentario.usuario_nombre ?? 'Usuario'}</strong></div>
        <div>{comentario.contenido}</div>
      </>
    );
  };

  return (
    <div className="feed">
      <div className="new-post mb-4">
        <div className="d-flex mb-2">
          <input className="form-control" placeholder="¿Qué está pasando?" disabled />
        </div>
        <div className="text-end">
          <Button variant="secondary" disabled>Postear</Button>
        </div>
      </div>

      {cargando ? (
        <div className="loader"></div>
      ) : publicaciones && publicaciones.length > 0 ? (
        publicaciones.map(publi => (
          <div key={publi.id} className="post border rounded p-3 mb-4 bg-white">
            <div className="d-flex align-items-center mb-2">
              <strong>{publi.usuario_nombre ?? `Usuario ${publi.usuario_id}`}</strong>
            </div>
            {publi.imagen && <img src={publi.imagen} alt="Publicación" className="img-fluid rounded mb-2" />}
            <p>{publi.descripcion}</p>

            <div className="d-flex gap-2 mb-2">
              <Button 
                variant={reacciones[publi.id] === 'like' ? 'primary' : 'outline-primary'} 
                size="sm" 
                onClick={() => handleLike(publi.id)}
              >
                👍 Like
              </Button>
              <Button 
                variant={reacciones[publi.id] === 'dislike' ? 'danger' : 'outline-danger'} 
                size="sm" 
                onClick={() => handleDislike(publi.id)}
              >
                👎 Dislike
              </Button>
              <span><strong>Puntuación: {puntuaciones[publi.id] ?? 0}</strong></span>
            </div>

            <div className="d-flex gap-2">
              <Button variant="success" size="sm" onClick={() => toggleCajaComentar(publi.id)}>
                {mostrarCajaComentar[publi.id] ? 'Cancelar' : 'Comentar'}
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={() => toggleComentarios(publi.id)}>
                {comentariosVisibles[publi.id] ? 'Ocultar comentarios' : `Mostrar comentarios (${comentarios[publi.id]?.length ?? 0})`}
              </Button>
            </div>

            {mostrarCajaComentar[publi.id] && (
              <div className="mt-3">
                <textarea
                  className="form-control mb-2"
                  placeholder="Escribe un comentario..."
                  rows={2}
                  value={contenidoComentario[publi.id] || ''}
                  onChange={(e) => setContenidoComentario(prev => ({ ...prev, [publi.id]: e.target.value }))}
                />
                <Button variant="primary" size="sm" onClick={() => handleComentar(publi.id)}>Enviar</Button>
              </div>
            )}

            {comentariosVisibles[publi.id] && comentarios[publi.id] && (
              <div className="mt-3">
                {comentarios[publi.id].filter(c => !c.respuestaA).map(c => (
                  <div key={c.id} className="comentario p-2 border rounded mb-2">
                    <div><strong>{c.usuario_nombre ?? 'Usuario'}</strong></div>
                    <div>{c.contenido}</div>

                    <div className="d-flex gap-2 align-items-center mt-1">
                      <Button 
                        size="sm" 
                        variant={reaccionesComentarios[c.id] === 'like' ? 'primary' : 'outline-primary'} 
                        onClick={() => likeComentario(c.id, publi.id)}
                      >
                        👍
                      </Button>
                      <Button 
                        size="sm" 
                        variant={reaccionesComentarios[c.id] === 'dislike' ? 'danger' : 'outline-danger'} 
                        onClick={() => dislikeComentario(c.id, publi.id)}
                      >
                        👎
                      </Button>
                      <span><strong>{c.puntuacion ?? 0}</strong></span>
                      <Button size="sm" variant="outline-primary" onClick={() => toggleCajaResponder(c.id)}>
                        {mostrarCajaResponder[c.id] ? 'Cancelar' : 'Responder'}
                      </Button>
                      {comentarios[publi.id].some(r => r.respuestaA === c.id) && (
                        <Button size="sm" variant="outline-secondary" onClick={() => toggleRespuestas(c.id)}>
                          {respuestasVisibles[c.id] ? 'Ocultar respuestas' : `Mostrar respuestas (${comentarios[publi.id].filter(r => r.respuestaA === c.id).length})`}
                        </Button>
                      )}
                    </div>

                    {mostrarCajaResponder[c.id] && (
                      <div className="mt-2">
                        <textarea
                          className="form-control mb-2"
                          placeholder="Escribe una respuesta..."
                          rows={2}
                          value={contenidoRespuesta[c.id] || ''}
                          onChange={(e) => setContenidoRespuesta(prev => ({ ...prev, [c.id]: e.target.value }))}
                        />
                        <Button variant="success" size="sm" onClick={() => handleComentar(publi.id, c.id, c.usuario_nombre)}>Enviar respuesta</Button>
                      </div>
                    )}

                    {respuestasVisibles[c.id] && comentarios[publi.id].filter(r => r.respuestaA === c.id).map(r => (
                      <div key={r.id} className="respuesta p-2 mt-2 border rounded">
                        {formatearContenidoComentario(r)}
                        <div className="d-flex gap-2 align-items-center mt-1">
                          <Button 
                            size="sm" 
                            variant={reaccionesComentarios[r.id] === 'like' ? 'primary' : 'outline-primary'} 
                            onClick={() => likeComentario(r.id, publi.id)}
                          >
                            👍
                          </Button>
                          <Button 
                            size="sm" 
                            variant={reaccionesComentarios[r.id] === 'dislike' ? 'danger' : 'outline-danger'} 
                            onClick={() => dislikeComentario(r.id, publi.id)}
                          >
                            👎
                          </Button>
                          <span><strong>{r.puntuacion ?? 0}</strong></span>
                          <Button size="sm" variant="outline-primary" onClick={() => toggleCajaResponder(r.id)}>
                            {mostrarCajaResponder[r.id] ? 'Cancelar' : 'Responder'}
                          </Button>
                        </div>

                        {mostrarCajaResponder[r.id] && (
                          <div className="mt-2">
                            <textarea
                              className="form-control mb-2"
                              placeholder="Escribe una respuesta..."
                              rows={2}
                              value={contenidoRespuesta[r.id] || ''}
                              onChange={(e) => setContenidoRespuesta(prev => ({ ...prev, [r.id]: e.target.value }))}
                            />
                            <Button variant="success" size="sm" onClick={() => handleComentar(publi.id, r.id, r.usuario_nombre)}>Enviar respuesta</Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="alert alert-info">No hay publicaciones disponibles.</div>
      )}
    </div>
  );
}
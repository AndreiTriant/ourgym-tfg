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
  const [cargandoComentarios, setCargandoComentarios] = useState({});
  const [usuarioActual, setUsuarioActual] = useState({ nombre: 'Tú' });
  const [conteosComentarios, setConteosComentarios] = useState({});
  const [datosCompletamenteCargados, setDatosCompletamenteCargados] = useState(false);
  const [respuestas, setRespuestas] = useState({});
  const [conteosRespuestas, setConteosRespuestas] = useState({});
  const [cargandoRespuestas, setCargandoRespuestas] = useState({});

  
  const cargarReaccionesComentarios = useCallback(async () => {
    try {
      const reaccionesComentariosResponse = await axios.get('/api/reacciones/comentarios', { 
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        params: { _t: new Date().getTime() }
      });
      
      const puntuacionesComentariosResponse = await axios.get('/api/comentarios/puntuaciones', {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        params: { _t: new Date().getTime() }
      });
      
      if (reaccionesComentariosResponse.data) {
        setReaccionesComentarios(prevReacciones => {
          const reaccionesActualizadas = { ...prevReacciones };
          Object.entries(reaccionesComentariosResponse.data).forEach(([id, valor]) => {
            reaccionesActualizadas[id] = valor;
          });
          return reaccionesActualizadas;
        });
      }
      
      if (puntuacionesComentariosResponse.data) {
        setComentarios(prevComentarios => {
          const comentariosActualizados = { ...prevComentarios };
          
          Object.keys(comentariosActualizados).forEach(publicacionId => {
            if (comentariosActualizados[publicacionId] && comentariosActualizados[publicacionId].length > 0) {
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

  const fetchConteoRespuestas = useCallback(async (comentarioId) => {
    try {
      const response = await axios.get(`/api/comentario/${comentarioId}/respuestas/conteo`, { withCredentials: true });
      setConteosRespuestas(prev => ({
        ...prev,
        [comentarioId]: response.data.count
      }));
    } catch (error) {
      console.error(`Error al obtener conteo de respuestas para comentario ${comentarioId}:`, error);
    }
  }, []);

  const fetchComentarios = useCallback(async (publicacionId) => {
    try {
      setCargandoComentarios(prev => ({
        ...prev,
        [publicacionId]: true
      }));
      
      const comentariosResponse = await axios.get(`/api/publicacion/${publicacionId}/comentarios`, { withCredentials: true });
      
      setComentarios(prevComentarios => ({
        ...prevComentarios,
        [publicacionId]: comentariosResponse.data
      }));
      
      await cargarReaccionesComentarios();

      comentariosResponse.data
        .filter(c => c.respuestaA === null) 
        .forEach(c => {
          fetchConteoRespuestas(c.id);
        });
    } catch (error) {
      console.error(`Error al cargar comentarios de la publicación ${publicacionId}:`, error);
    } finally {
      setCargandoComentarios(prev => ({
        ...prev,
        [publicacionId]: false
      }));
    }
  }, [cargarReaccionesComentarios, fetchConteoRespuestas]);

  const fetchConteosComentarios = useCallback(async () => {
    try {
      const conteosResponses = await Promise.all(
        publicaciones.map(publi => 
          axios.get(`/api/publicacion/${publi.id}/comentarios/conteo`, { withCredentials: true })
        )
      );
      const nuevosConteos = {};
      conteosResponses.forEach((response, index) => {
        const publicacionId = publicaciones[index].id;
        if (response.data && response.data.count !== undefined) {
          nuevosConteos[publicacionId] = response.data.count;
        }
      });
      
      setConteosComentarios(nuevosConteos);
      setDatosCompletamenteCargados(true);
    } catch (error) {
      console.error('Error al cargar conteos de comentarios:', error);
      setDatosCompletamenteCargados(true);
    }
  }, [publicaciones]);

  const fetchRespuestas = useCallback(async (comentarioId) => {
    try {
      setCargandoRespuestas(prev => ({
        ...prev,
        [comentarioId]: true
      }));

      const response = await axios.get(`/api/comentario/${comentarioId}/respuestas`, { withCredentials: true });

      setRespuestas(prev => ({
        ...prev,
        [comentarioId]: response.data
      }));
    } catch (error) {
      console.error(`Error al cargar respuestas del comentario ${comentarioId}:`, error);
    } finally {
      setCargandoRespuestas(prev => ({
        ...prev,
        [comentarioId]: false
      }));
    }
  }, []);  

  const fetchData = useCallback(async () => {
    try {
      const [pubsResponse, puntosResponse, reaccionesResponse] = await Promise.all([
        axios.get('/api/publicaciones'),
        axios.get('/api/publicaciones/puntuaciones'),
        axios.get('/api/reacciones', { withCredentials: true })
      ]);
  
      setPublicaciones(pubsResponse.data);
      setPuntuaciones(puntosResponse.data || {});
      setReacciones(reaccionesResponse.data || {});
  
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
  }, []);
  

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Efecto para cargar los conteos de comentarios una vez que se han cargado las publicaciones
  useEffect(() => {
    if (publicaciones.length > 0 && !cargando) {
      fetchConteosComentarios();
    }
  }, [publicaciones, cargando, fetchConteosComentarios]);

  const handleLike = async (publicacionId) => {
    const reaccionActual = reacciones[publicacionId];
    const nuevaReaccion = reaccionActual === 'like' ? null : 'like';
    
    setPuntuaciones(prev => ({
      ...prev,
      [publicacionId]: (parseInt(prev[publicacionId]) || 0) + (reaccionActual === 'like' ? -1 : reaccionActual === 'dislike' ? 2 : 1)
    }));
    setReacciones(prev => ({ ...prev, [publicacionId]: nuevaReaccion }));
    
    try { 
      await axios.post(`/api/publicacion/${publicacionId}/like`, {}, { withCredentials: true }); 
    } catch (e) {
      console.error('Error al dar like:', e);
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
    
    setPuntuaciones(prev => ({
      ...prev,
      [publicacionId]: (parseInt(prev[publicacionId]) || 0) + (reaccionActual === 'dislike' ? 1 : reaccionActual === 'like' ? -2 : -1)
    }));
    setReacciones(prev => ({ ...prev, [publicacionId]: nuevaReaccion }));
    
    try { 
      await axios.post(`/api/publicacion/${publicacionId}/dislike`, {}, { withCredentials: true }); 
    } catch (e) {
      console.error('Error al dar dislike:', e);
      setPuntuaciones(prev => ({
        ...prev,
        [publicacionId]: (parseInt(prev[publicacionId]) || 0) - (reaccionActual === 'dislike' ? 1 : reaccionActual === 'like' ? -2 : -1)
      }));
      setReacciones(prev => ({ ...prev, [publicacionId]: reaccionActual }));
    }
  };

  const likeComentario = async (comentarioId, publicacionId) => {
    const reaccionActual = reaccionesComentarios[comentarioId];
    const nuevaReaccion = reaccionActual === 'like' ? null : 'like';
  
    let ajuste = 0;
    if (reaccionActual === 'like') {
      ajuste = -1;
    } else if (reaccionActual === 'dislike') {
      ajuste = 2;
    } else {
      ajuste = 1;
    }
  
    setComentarios(prev => ({
      ...prev,
      [publicacionId]: prev[publicacionId].map(c =>
        c.id === comentarioId ? { ...c, puntuacion: (c.puntuacion ?? 0) + ajuste } : c
      )
    }));

    setRespuestas(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(parentId => {
        updated[parentId] = updated[parentId].map(r =>
          r.id === comentarioId ? { ...r, puntuacion: (r.puntuacion ?? 0) + ajuste } : r
        );
      });
      return updated;
    });    
  
    setReaccionesComentarios(prev => ({ ...prev, [comentarioId]: nuevaReaccion }));
  
    try {
      if (nuevaReaccion === null) {
        // quitar reacción
        await axios.delete(`/api/reaccion-comentario/${comentarioId}`, { withCredentials: true });
      } else {
        // poner like
        await axios.post(`/api/reaccion-comentario/${comentarioId}/like`, {}, { withCredentials: true });
      }
    } catch (e) {
      console.error(`Error al cambiar reacción al comentario ${comentarioId}:`, e);
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

    let ajuste = 0;
    if (reaccionActual === 'dislike') {
      ajuste = 1; 
    } else if (reaccionActual === 'like') {
      ajuste = -2; 
    } else {
      ajuste = -1; 
    }

    setComentarios(prev => ({
      ...prev,
      [publicacionId]: prev[publicacionId].map(c =>
        c.id === comentarioId ? { ...c, puntuacion: (c.puntuacion ?? 0) + ajuste } : c
      )
    }));

    setRespuestas(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(parentId => {
        updated[parentId] = updated[parentId].map(r =>
          r.id === comentarioId ? { ...r, puntuacion: (r.puntuacion ?? 0) + ajuste } : r
        );
      });
      return updated;
    });

    setReaccionesComentarios(prev => ({ ...prev, [comentarioId]: nuevaReaccion }));

    try {
      if (nuevaReaccion === null) {
        await axios.delete(`/api/reaccion-comentario/${comentarioId}`, { withCredentials: true });
      } else {
        await axios.post(`/api/reaccion-comentario/${comentarioId}/dislike`, {}, { withCredentials: true });
      }
    } catch (e) {
      console.error(`Error al cambiar reacción al comentario ${comentarioId}:`, e);
      setComentarios(prev => ({
        ...prev,
        [publicacionId]: prev[publicacionId].map(c =>
          c.id === comentarioId ? { ...c, puntuacion: (c.puntuacion ?? 0) - ajuste } : c
        )
      }));
      setRespuestas(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(parentId => {
          updated[parentId] = updated[parentId].map(r =>
            r.id === comentarioId ? { ...r, puntuacion: (r.puntuacion ?? 0) - ajuste } : r
          );
        });
        return updated;
      });
      setReaccionesComentarios(prev => ({ ...prev, [comentarioId]: reaccionActual }));
    }
  };

  
  const toggleComentarios = async (publicacionId) => {
    if (comentariosVisibles[publicacionId]) {
      setComentariosVisibles(prev => ({ ...prev, [publicacionId]: false }));
      return;
    }
    
    setComentariosVisibles(prev => ({ ...prev, [publicacionId]: true }));
    
    if (!comentarios[publicacionId] || comentarios[publicacionId].length === 0) {
      await fetchComentarios(publicacionId);
    }
  };

  const toggleCajaComentar = async (publicacionId) => {
    const isOpen = mostrarCajaComentar[publicacionId];
    setMostrarCajaComentar(prev => ({ ...prev, [publicacionId]: !isOpen }));

    if (isOpen) {
      setContenidoComentario(prev => ({ ...prev, [publicacionId]: '' }));
    } else {
      if (!comentarios[publicacionId] || comentarios[publicacionId].length === 0) {
        await fetchComentarios(publicacionId);
      }
    }
  };


  const toggleCajaResponder = async (comentarioId) => {
    const isOpen = mostrarCajaResponder[comentarioId];
    setMostrarCajaResponder(prev => ({ ...prev, [comentarioId]: !isOpen }));

    if (isOpen) {
      setContenidoRespuesta(prev => ({ ...prev, [comentarioId]: '' }));
    } else {
      if (!respuestas[comentarioId] || respuestas[comentarioId].length === 0) {
        await fetchRespuestas(comentarioId);
      }
    }
  };


  const toggleRespuestas = async (comentarioId) => {
    if (respuestasVisibles[comentarioId]) {
      setRespuestasVisibles(prev => ({
        ...prev,
        [comentarioId]: false
      }));
    } else {
      setRespuestasVisibles(prev => ({
        ...prev,
        [comentarioId]: true
      }));

      if (!respuestas[comentarioId]) {
        await fetchRespuestas(comentarioId);
      }
    }
  };
  

  const obtenerComentarioPadre = useCallback((comentarioId, publicacionId) => {
    const comentariosPublicacion = comentarios[publicacionId] || [];
    const comentario = comentariosPublicacion.find(c => c.id === comentarioId);
    
    if (!comentario || !comentario.respuestaA) {
      return comentarioId;
    }
    
    return obtenerComentarioPadre(comentario.respuestaA, publicacionId);
  }, [comentarios]);

  const handleComentar = async (publicacionId, respuestaA = null, usuarioNombre = '') => {
    let texto = respuestaA ? contenidoRespuesta[respuestaA] : contenidoComentario[publicacionId];
    if (!texto?.trim()) return;

    const contenidoParaEnviar = texto.trim();

    if (respuestaA) {
      setContenidoRespuesta(prev => ({ ...prev, [respuestaA]: '' }));
      setMostrarCajaResponder(prev => ({ ...prev, [respuestaA]: false }));
    } else {
      setContenidoComentario(prev => ({ ...prev, [publicacionId]: '' }));
      setMostrarCajaComentar(prev => ({ ...prev, [publicacionId]: false }));
    }

    let textoFinal = contenidoParaEnviar;
    if (respuestaA && usuarioNombre && !textoFinal.startsWith(`@${usuarioNombre} `)) {
      textoFinal = `@${usuarioNombre} ` + textoFinal;
    }

    const comentarioPadreId = respuestaA ? obtenerComentarioPadre(respuestaA, publicacionId) : null;

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
      _esNuevo: true
    };

    setComentarios(prev => {
      const comentariosActualizados = [...(prev[publicacionId] || [])];
      if (!comentariosActualizados.some(c => c.id === nuevoComentarioId)) {
        comentariosActualizados.push(nuevoComentario);
      }
      return {
        ...prev,
        [publicacionId]: comentariosActualizados
      };
    });

    if (respuestaA) {
      setRespuestas(prev => {
        const respuestasActualizadas = [...(prev[comentarioPadreId] || [])];
        if (!respuestasActualizadas.some(r => r.id === nuevoComentarioId)) {
          respuestasActualizadas.push(nuevoComentario);
        }
        return {
          ...prev,
          [comentarioPadreId]: respuestasActualizadas
        };
      });
    }

    setComentariosVisibles(prev => ({ ...prev, [publicacionId]: true }));
    if (comentarioPadreId) {
      setRespuestasVisibles(prev => ({ ...prev, [comentarioPadreId]: true }));
    }


    setReaccionesComentarios(prev => ({
      ...prev,
      [nuevoComentarioId]: null
    }));

    try {
      const payload = {
        contenido: textoFinal,
        respuestaA: comentarioPadreId
      };

      if (respuestaA !== comentarioPadreId) {
        payload.respondidoA = respuestaA;
        payload.respondidoUsuario = usuarioNombre;
      }

      const response = await axios.post(`/api/publicacion/${publicacionId}/comentar`, payload, { withCredentials: true });

      if (response.data && response.data.id) {
        setComentarios(prev => ({
          ...prev,
          [publicacionId]: prev[publicacionId].map(c =>
            c.id === nuevoComentarioId ? { ...c, id: response.data.id, _esNuevo: false } : c
          )
        }));

        if (respuestaA) {
          setRespuestas(prev => ({
            ...prev,
            [comentarioPadreId]: prev[comentarioPadreId].map(r =>
              r.id === nuevoComentarioId ? { ...r, id: response.data.id, _esNuevo: false } : r
            )
          }));
        }

        setReaccionesComentarios(prev => {
          const updated = { ...prev };
          if (updated[nuevoComentarioId]) {
            updated[response.data.id] = updated[nuevoComentarioId];
            delete updated[nuevoComentarioId];
          }
          return updated;
        });
      }

      const conteoResponse = await axios.get(`/api/publicacion/${publicacionId}/comentarios/conteo`, { withCredentials: true });
      if (conteoResponse.data && conteoResponse.data.count !== undefined) {
        setConteosComentarios(prev => ({
          ...prev,
          [publicacionId]: conteoResponse.data.count
        }));
      }

      if (respuestaA) {
        const conteoRespuestasResponse = await axios.get(`/api/comentario/${comentarioPadreId}/respuestas/conteo`, { withCredentials: true });
        if (conteoRespuestasResponse.data && conteoRespuestasResponse.data.count !== undefined) {
          setConteosRespuestas(prev => ({
            ...prev,
            [comentarioPadreId]: conteoRespuestasResponse.data.count
          }));
        }
      }
    } catch (e) {
      console.error('Error al enviar comentario:', e);
      setComentarios(prev => ({
        ...prev,
        [publicacionId]: prev[publicacionId].filter(c => c.id !== nuevoComentarioId)
      }));
      setConteosComentarios(prev => ({
        ...prev,
        [publicacionId]: Math.max(0, (prev[publicacionId] || 0) - 1)
      }));
    }

    setComentariosVisibles(prev => ({ ...prev, [publicacionId]: true }));
    if (comentarioPadreId) {
      setRespuestasVisibles(prev => ({ ...prev, [comentarioPadreId]: true }));
    }
  };


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
      ) : !datosCompletamenteCargados ? (
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
                {comentariosVisibles[publi.id] 
                  ? 'Ocultar comentarios' 
                  : `Mostrar comentarios (${conteosComentarios[publi.id] ?? 0})`
                }
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

            {comentariosVisibles[publi.id] && (
              <div className="mt-3">
                {cargandoComentarios[publi.id] ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <span>Cargando comentarios...</span>
                  </div>
                ) : comentarios[publi.id] && comentarios[publi.id].length > 0 ? (
                  comentarios[publi.id].filter(c => !c.respuestaA).map(c => (
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
                        {
                          (conteosRespuestas[c.id] === undefined || conteosRespuestas[c.id] > 0) && (
                            <Button size="sm" variant="outline-secondary" onClick={() => toggleRespuestas(c.id)}>
                              {respuestasVisibles[c.id]
                                ? 'Ocultar respuestas'
                                : `Mostrar respuestas (${conteosRespuestas[c.id] ?? '...'})`}
                            </Button>
                          )
                        }
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

                      {respuestasVisibles[c.id] && (
                        c.id in cargandoRespuestas && cargandoRespuestas[c.id] ? (
                          <div className="text-center py-2">
                            <div className="spinner-border spinner-border-sm text-secondary me-2" role="status">
                              <span className="visually-hidden">Cargando...</span>
                            </div>
                            <span>Cargando respuestas...</span>
                          </div>
                        ) : respuestas[c.id]?.length > 0 ? (
                          respuestas[c.id]?.map(r => {
                            const comentarioActualizado = comentarios[publi.id]?.find(c => c.id === r.id) || r;
                        
                            return (
                              <div key={r.id} className="respuesta p-2 mt-2 border rounded">
                                {formatearContenidoComentario(comentarioActualizado)}
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
                                  <span><strong>{comentarioActualizado.puntuacion ?? 0}</strong></span>
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
                                    <Button variant="success" size="sm" onClick={() => handleComentar(publi.id, r.id, r.usuario_nombre)}>
                                      Enviar respuesta
                                    </Button>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="alert alert-info mt-2">No hay respuestas aún.</div>
                        )
                      )}
                    </div>
                  ))
                ) : (
                  <div className="alert alert-info">No hay comentarios para esta publicación.</div>
                )}
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
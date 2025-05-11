import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Feed from '../components/Feed';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import './Home.css';

export default function PerfilUsuario() {
  const { username } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [fotoLocal, setFotoLocal] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [verificandoSesion, setVerificandoSesion] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('publicaciones');
  const [publicaciones, setPublicaciones] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [likes, setLikes] = useState([]);
  const [siguiendo, setSiguiendo] = useState(false);
  const [numSeguidores, setNumSeguidores] = useState(0);
  const [numSeguidos, setNumSeguidos] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editandoDescripcion, setEditandoDescripcion] = useState(false);
  const [nuevaDescripcion, setNuevaDescripcion] = useState('');

  const menuItems = ["Inicio", "Explorar", "Notificaciones", "Mensajes", "Guardados", "Premium"];

  // 🔐 Verificar sesión antes de cargar
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch("/api/usuario/yo", { credentials: "include" });
        if (!res.ok) throw new Error("No autenticado");
      } catch {
        navigate("/login");
      } finally {
        setVerificandoSesion(false);
      }
    };

    verificarSesion();
  }, [navigate]);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const [userResponse, actualResponse] = await Promise.all([
          fetch(`/api/usuarios/username/${username}`).then(res => res.json()),
          axios.get('/api/usuario/yo', { withCredentials: true }).then(res => res.data).catch(() => null),
        ]);

        setUsuario(userResponse);
        setUsuarioActual(actualResponse);

        if (userResponse.foto_perfil.includes('fotoUsuario_placeholder')) {
          setFotoLocal(userResponse.foto_perfil);
        } else {
          setFotoLocal(`http://localhost:8080${userResponse.foto_perfil}`);
        }

        const [pubsData, commentsData, likesData, contadoresRes] = await Promise.all([
          fetch(`/api/usuarios/${userResponse.id}/publicaciones`).then(res => res.json()),
          fetch(`/api/usuarios/${userResponse.id}/comentarios`).then(res => res.json()),
          fetch(`/api/usuarios/${userResponse.id}/likes`).then(res => res.json()),
          axios.get(`/api/seguimientos/contar/${userResponse.id}`)
        ]);

        setPublicaciones(pubsData);
        setComentarios(commentsData);
        setLikes(likesData);
        setNumSeguidores(contadoresRes.data.seguidores);
        setNumSeguidos(contadoresRes.data.seguidos);

        if (actualResponse && actualResponse.id !== userResponse.id) {
          const siguiendoRes = await axios.get(`/api/seguimientos/is-following/${userResponse.id}`);
          setSiguiendo(siguiendoRes.data.siguiendo);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    if (!verificandoSesion) {
      fetchPerfil();
    }
  }, [username, verificandoSesion]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && showSidebar) {
        setShowSidebar(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showSidebar]);

  if (verificandoSesion) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8f9fa',
          zIndex: 9999
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Verificando sesión...</span>
          </div>
          <p className="mt-3">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  const esMiPerfil = usuarioActual && usuarioActual.id === usuario?.id;

  const getFotoPerfil = () => {
    return fotoLocal || '/imagenes/fotoUsuario_placeholder.png';
  };

  const toggleSeguir = async () => {
    const estabaSiguiendo = siguiendo;
    setSiguiendo(!estabaSiguiendo);
    setNumSeguidores(prev => Math.max(0, estabaSiguiendo ? prev - 1 : prev + 1));

    try {
      if (estabaSiguiendo) {
        await axios.delete(`/api/seguimientos/${usuario.id}`);
      } else {
        await axios.post('/api/seguimientos', { seguido_id: usuario.id });
      }
    } catch (error) {
      console.error('Error al seguir/dejar de seguir:', error);
      setSiguiendo(estabaSiguiendo);
      setNumSeguidores(prev => Math.max(0, estabaSiguiendo ? prev + 1 : prev - 1));
    }
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Guardamos ruta actual por si hay que borrarla luego
    const fotoAnterior = usuario.foto_perfil;

    // Actualizamos vista localmente
    const reader = new FileReader();
    reader.onload = () => {
     if (response.data.foto_perfil.includes('fotoUsuario_placeholder')) {
        setFotoLocal(response.data.foto_perfil);
      } else {
        setFotoLocal(`http://localhost:8080${response.data.foto_perfil}`);
      }
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('foto', file);

    try {
      const response = await axios.post('/api/usuario/foto-perfil', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      // Guardamos en BD
      setUsuario(prev => ({ ...prev, foto_perfil: response.data.foto_perfil }));
      setFotoLocal(`http://localhost:8080${response.data.foto_perfil}`);

      // Borramos la anterior si no era la placeholder
      if (!fotoAnterior.includes('fotoUsuario_placeholder')) {
        await axios.delete('/api/usuario/foto-perfil', {
          params: { path: fotoAnterior },
          withCredentials: true,
        });
      }

    } catch (err) {
      console.error('Error al subir la foto de perfil:', err);
    }
  };

  const guardarDescripcion = async () => {
    setUsuario(prev => ({ ...prev, descripcion: nuevaDescripcion }));
    setEditandoDescripcion(false);
    try {
      await axios.put('/api/usuario/editar', { descripcion: nuevaDescripcion }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
    } catch (error) {
      console.error('Error al actualizar la descripción:', error);
      alert('No se pudo guardar la descripción.');
    }
  };

  return (
    <div className="app-container">
      <div className="fixed-header">
        <Header onMenuClick={() => setShowSidebar(true)} />
      </div>

      <Sidebar items={menuItems} show={showSidebar} onHide={() => setShowSidebar(false)} mobile />
      <div className="content-grid">
        <div className="sidebar-area d-none d-lg-block">
          <Sidebar items={menuItems} show mobile={false} />
        </div>

        <main className="feed-area">
          {cargando ? (
            <p>Cargando perfil...</p>
          ) : (
            <>
              <h1>Perfil de {usuario.nomUsu}</h1>
              <img
                src={getFotoPerfil()}
                alt="Foto de perfil"
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
              />

              {esMiPerfil && (
                <>
                  <button onClick={() => fileInputRef.current.click()} style={{ marginTop: '1rem' }}>📷 Cambiar foto</button>
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFotoChange} style={{ display: 'none' }} />
                </>
              )}

              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>Fecha de creación:</strong> {usuario.fechaCreacion}</p>

              {!editandoDescripcion ? (
                <p><strong>Descripción:</strong> {usuario.descripcion || 'Sin descripción'}</p>
              ) : (
                <div style={{ marginTop: '1rem' }}>
                  <textarea
                    className="form-control mb-2"
                    value={nuevaDescripcion}
                    onChange={(e) => setNuevaDescripcion(e.target.value)}
                    rows={3}
                  />
                  <button className="btn btn-success me-2" onClick={guardarDescripcion}>Guardar</button>
                  <button className="btn btn-secondary" onClick={() => setEditandoDescripcion(false)}>Cancelar</button>
                </div>
              )}

              {esMiPerfil && !editandoDescripcion && (
                <button onClick={() => {
                  setEditandoDescripcion(true);
                  setNuevaDescripcion(usuario.descripcion || '');
                }} style={{ marginTop: '1rem' }}>✏️ Editar mi perfil</button>
              )}

              <div style={{ marginTop: '1rem' }}>
                <p><strong>Seguidores:</strong> {numSeguidores}</p>
                <p><strong>Seguidos:</strong> {numSeguidos}</p>
              </div>

              {!esMiPerfil && (
                <button
                  className={`btn ${siguiendo ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={toggleSeguir}
                  style={{ marginTop: '1rem' }}
                >
                  {siguiendo ? 'Siguiendo' : 'Seguir'}
                </button>
              )}

              <div style={{ marginTop: '2rem' }}>
                <button onClick={() => setActiveTab('publicaciones')}>📝 Publicaciones</button>
                <button onClick={() => setActiveTab('comentarios')}>💬 Comentarios</button>
                <button onClick={() => setActiveTab('likes')}>❤️ Likes</button>
              </div>

              <div style={{ marginTop: '1rem' }}>
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
                  <h2>Likes</h2>
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
            </>
          )}
        </main>
      </div>
    </div>
  );
}

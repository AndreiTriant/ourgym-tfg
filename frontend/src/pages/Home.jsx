import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Subnav from "../components/Subnav";
import Feed from "../components/Feed";
import Trending from "../components/Trending";
import "./Home.css";

export default function Home({ usuarioActual }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [filtro, setFiltro] = useState('para-ti');
  const [seguidos, setSeguidos] = useState([]);
  const [verificandoSesion, setVerificandoSesion] = useState(true); // loader durante la verificación

  const navigate = useNavigate();

  // Verifica si hay sesión activa (con cookies)
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const res = await fetch("/api/usuario/yo", {
          credentials: "include"
        });
        if (!res.ok) throw new Error("No autenticado");
      } catch {
        navigate("/login");
      } finally {
        setVerificandoSesion(false);
      }
    };

    verificarSesion();
  }, [navigate]);

  // Carga la lista de usuarios seguidos
  useEffect(() => {
    const fetchSeguidos = async () => {
      try {
        const res = await fetch('/api/seguimientos/seguidos', {
          credentials: 'include'
        });
        const data = await res.json();
        setSeguidos(data); // ← lista de IDs
      } catch (err) {
        console.error('Error al cargar seguidos:', err);
      }
    };

    fetchSeguidos();
  }, []);

  // Cierra el offcanvas al hacer resize
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
          backgroundColor: '#f8f9fa', // opcional, fondo claro
          zIndex: 9999
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Verificando sesión...</p>
        </div>
      </div>
    );

  }

  const menuItems = [
    "Inicio",
    "Explorar",
    "Notificaciones",
    "Mensajes",
    "Guardados",
    "Premium",
  ];

  return (
    <div className="app-container">
      {/* Fixed Header */}
      <div className="fixed-header">
        <Header onMenuClick={() => setShowSidebar(true)} />
        <Subnav filtro={filtro} setFiltro={setFiltro} />
      </div>

      {/* Mobile Sidebar (Offcanvas) */}
      <Sidebar
        items={menuItems}
        show={showSidebar}
        onHide={() => setShowSidebar(false)}
        mobile
      />

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Left Sidebar - Desktop */}
        <div className="sidebar-area d-none d-lg-block">
          <Sidebar items={menuItems} show mobile={false} />
        </div>

        {/* Main Feed Area */}
        <main className="feed-area">
          <Feed filtro={filtro} usuarioActual={usuarioActual} seguidos={seguidos} />
        </main>

        {/* Right Sidebar - Desktop */}
        <div className="trending-area d-none d-lg-block">
          <Trending />
        </div>
      </div>
    </div>
  );
}

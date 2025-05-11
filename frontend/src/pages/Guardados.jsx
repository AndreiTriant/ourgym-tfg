import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Feed from "../components/Feed";
import Header from "../components/Header";

export default function Guardados() {
  const [guardadas, setGuardadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [verificandoSesion, setVerificandoSesion] = useState(true);
  const navigate = useNavigate();

  // 🔐 Verificar sesión antes de cargar los datos
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
    const fetchGuardados = async () => {
      try {
        const favoritosResponse = await axios.get("/api/favoritos", {
          withCredentials: true,
        });
        const idsGuardados = favoritosResponse.data;

        if (idsGuardados.length === 0) {
          setGuardadas([]);
          setCargando(false);
          return;
        }

        const publicacionesResponse = await axios.get("/api/publicaciones");

        const publicacionesFiltradas = publicacionesResponse.data.filter((publi) =>
          idsGuardados.includes(publi.id)
        );

        setGuardadas(publicacionesFiltradas);
      } catch (error) {
        console.error("Error al cargar publicaciones guardadas:", error);
      } finally {
        setCargando(false);
      }
    };

    if (!verificandoSesion) {
      fetchGuardados();
    }
  }, [verificandoSesion]);

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

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h1>Mis Guardados</h1>
        {cargando ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <div className="mt-2">Cargando tus publicaciones guardadas...</div>
          </div>
        ) : guardadas.length > 0 ? (
          <Feed publicaciones={guardadas} />
        ) : (
          <div className="alert alert-info mt-4">
            No tienes publicaciones guardadas todavía.
          </div>
        )}
      </div>
    </div>
  );
}

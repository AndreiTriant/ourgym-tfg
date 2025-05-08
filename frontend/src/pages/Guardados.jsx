import React, { useEffect, useState } from "react";
import axios from "axios";
import Feed from "../components/Feed";
import Header from "../components/Header";

export default function Guardados() {
  const [guardadas, setGuardadas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchGuardados = async () => {
      try {
        // Primero obtenemos las publicaciones guardadas
        const favoritosResponse = await axios.get("/api/favoritos", {
          withCredentials: true,
        });
        const idsGuardados = favoritosResponse.data;

        if (idsGuardados.length === 0) {
          setGuardadas([]);
          setCargando(false);
          return;
        }

        // Obtenemos todas las publicaciones
        const publicacionesResponse = await axios.get("/api/publicaciones");

        // Filtramos solo las guardadas
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

    fetchGuardados();
  }, []);

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h1>Mis Guardados</h1>
        {cargando ? (
          <div className="text-center py-5">
            <div
              className="spinner-border text-primary"
              role="status"
            ></div>
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

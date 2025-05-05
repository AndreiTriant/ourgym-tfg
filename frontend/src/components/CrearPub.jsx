import React, { useState, useEffect } from "react";
import { Button, Form, Row, Col, Image } from "react-bootstrap";
import axios from "axios";

export default function CrearPub({ onPublicacionCreada }) {
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null);
  const [tipo, setTipo] = useState("POST"); // Valor por defecto
  const [cargando, setCargando] = useState(false);
  const [usuario, setUsuario] = useState({ nombre: "User" });

  // Obtener información del usuario actual
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get("/api/usuario/actual", {
          withCredentials: true,
        });
        if (response.data) {
          setUsuario(response.data);
        }
      } catch (error) {
        console.error("Error al obtener información del usuario:", error);
      }
    };

    fetchUsuario();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!descripcion.trim()) return;

    const formData = new FormData();
    formData.append("descripcion", descripcion);
    formData.append("tipo", tipo); // Añadimos el tipo
    if (imagen) {
      formData.append("imagen", imagen);
    }

    try {
      setCargando(true);
      const response = await axios.post("/api/publicaciones", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        onPublicacionCreada(response.data);
        setDescripcion("");
        setImagen(null);
        setTipo("POST"); // Reset al valor por defecto
      }
    } catch (error) {
      console.error("Error al crear publicación:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="p-0 border rounded shadow-sm mb-4"
      style={{ backgroundColor: "#ffffff", borderColor: "#e0e0e0" }}
    >
      {/* Header with type selector */}
      <div
        className="border-bottom p-2"
        style={{ backgroundColor: "#f8f8f8", borderColor: "#e0e0e0" }}
      >
        <Row className="align-items-center">
          <Col>
            <Form.Select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              disabled={cargando}
              style={{
                border: "none",
                backgroundColor: "transparent",
                boxShadow: "none",
                paddingLeft: "0",
              }}
              className="fw-medium text-secondary"
            >
              <option value="POST">Normal</option>
              <option value="RUTINA">Rutina</option>
              <option value="DIETA">Dieta</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      <div className="p-3">
        {/* User avatar and textarea */}
        <Row className="mb-3">
          <Col xs="auto">
            <Image
              src={`https://ui-avatars.com/api/?name=${
                usuario.nombre || "User"
              }&background=random`}
              roundedCircle
              width={40}
              height={40}
            />
          </Col>
          <Col>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="¿Qué está pasando?"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              disabled={cargando}
              style={{
                border: "none",
                resize: "none",
                boxShadow: "none",
                padding: "0",
                backgroundColor: "transparent",
              }}
            />
          </Col>
        </Row>

        {/* Display selected image name if any */}
        {imagen && (
          <div className="mb-2 ps-5">
            <small className="text-muted">
              <i className="bi bi-paperclip me-1"></i>
              {imagen.name}
            </small>
          </div>
        )}

        {/* Action buttons */}
        <div className="d-flex justify-content-between align-items-center border-top pt-2">
          <div>
            {/* Camera button */}
            <Button
              variant="link"
              className="text-secondary p-2 rounded-circle camera-btn"
              style={{
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => document.getElementById("file-upload").click()}
            >
              <i className="bi bi-camera fs-5"></i>
              <Form.Control
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
                disabled={cargando}
                className="d-none"
              />
            </Button>
          </div>

          {/* Publish button */}
          <Button
            type="submit"
            style={{
              backgroundColor: "#ff7043",
              borderColor: "#ff7043",
              color: "white",
            }}
            className="rounded-pill px-4"
            disabled={cargando || !descripcion.trim()}
          >
            {cargando ? "Publicando..." : "Publish"}
          </Button>
        </div>
      </div>
    </Form>
  );
}

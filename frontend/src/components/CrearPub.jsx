import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

export default function CrearPub({ onPublicacionCreada }) {
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null);
  const [tipo, setTipo] = useState('POST');  // Valor por defecto
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!descripcion.trim()) return;

    const formData = new FormData();
    formData.append('descripcion', descripcion);
    formData.append('tipo', tipo);  // Añadimos el tipo
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      setCargando(true);
      const response = await axios.post('/api/publicaciones', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data) {
        onPublicacionCreada(response.data);
        setDescripcion('');
        setImagen(null);
        setTipo('POST');  // Reset al valor por defecto
      }
    } catch (error) {
      console.error('Error al crear publicación:', error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3 border rounded" style={{ backgroundColor: '#ffe6e6' }}>
      {/* Selector de tipo de publicación */}
      <Form.Group className="mb-2">
        <Form.Select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          disabled={cargando}
          style={{ backgroundColor: '#f0f2f5' }}
        >
          <option value="POST">Normal</option>
          <option value="RUTINA">Rutina</option>
          <option value="DIETA">Dieta</option>
        </Form.Select>
      </Form.Group>

      {/* Campo de texto para la descripción */}
      <Form.Group className="mb-2">
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="¿Qué está pasando?"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          disabled={cargando}
          style={{ backgroundColor: '#f0f2f5' }}
        />
      </Form.Group>

      {/* Selector de imagen */}
      <Form.Group className="mb-2">
        <Form.Control
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
          disabled={cargando}
        />
      </Form.Group>

      {/* Botón de envío */}
      <div className="text-end">
        <Button type="submit" variant="secondary" disabled={cargando || !descripcion.trim()}>
          {cargando ? 'Publicando...' : 'Postear'}
        </Button>
      </div>
    </Form>
  );
}

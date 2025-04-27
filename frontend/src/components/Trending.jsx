// src/components/Trending.jsx
import React from 'react';
import { Button } from 'react-bootstrap';

export default function Trending() {
  return (
    <aside className="trending">
      <div className="bg-white p-3 rounded border mb-3">
        <h6>Suscríbete a Premium</h6>
        <p className="small">
          Desbloquea nuevas funciones y recibe un pago si eres elegible.
        </p>
        <Button size="sm">Suscribirse</Button>
      </div>
      <div className="bg-white p-3 rounded border mb-3">
        <h6>A quién seguir</h6>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span>marta🌸✨</span>
          <Button variant="outline-dark" size="sm">Seguir</Button>
        </div>
      </div>
      <div className="bg-white p-3 rounded border">
        <h6>Qué está pasando</h6>
        <p className="mb-1 small">
          <strong>Broncano</strong> · 2.058 publicaciones
        </p>
      </div>
    </aside>
  );
}

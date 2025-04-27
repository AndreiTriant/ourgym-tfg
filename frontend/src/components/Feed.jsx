// src/components/Feed.jsx
import React from 'react';
import { Button } from 'react-bootstrap';

export default function Feed() {
  return (
    <div className="feed">
      {/* Caja de nueva publicación */}
      <div className="mb-3 border rounded p-3 bg-white">
        <div className="d-flex mb-2">
          <img
            src="https://via.placeholder.com/40"
            className="profile-pic me-2"
            alt="perfil"
          />
          <input className="form-control" placeholder="¿Qué está pasando?" />
        </div>
        <div className="text-end">
          <Button variant="secondary">Postear</Button>
        </div>
      </div>

      {/* Ejemplo de post */}
      <div className="border rounded p-3 mb-3 bg-white">
        <div className="d-flex align-items-center mb-2">
          <img
            src="https://via.placeholder.com/40"
            className="profile-pic me-2"
            alt="perfil"
          />
          <strong>México Mágico</strong>
        </div>
        <img
          src="https://i.imgur.com/3sZKj8a.jpeg"
          alt="Meme"
          className="img-fluid rounded"
        />
        <p className="mt-2 mb-0">DONA UN MEME !! Y LLÉVATE LOS Q QUIERAS!!!</p>
        <div className="text-muted small">
          1 mil me gusta · 702 retuits · 3 M visualizaciones
        </div>
      </div>
      <div className="border rounded p-3 mb-3 bg-white">
        <div className="d-flex align-items-center mb-2">
          <img
            src="https://via.placeholder.com/40"
            className="profile-pic me-2"
            alt="perfil"
          />
          <strong>México Mágico</strong>
        </div>
        <img
          src="https://i.imgur.com/3sZKj8a.jpeg"
          alt="Meme"
          className="img-fluid rounded"
        />
        <p className="mt-2 mb-0">DONA UN MEME !! Y LLÉVATE LOS Q QUIERAS!!!</p>
        <div className="text-muted small">
          1 mil me gusta · 702 retuits · 3 M visualizaciones
        </div>
      </div>
      <div className="border rounded p-3 mb-3 bg-white">
        <div className="d-flex align-items-center mb-2">
          <img
            src="https://via.placeholder.com/40"
            className="profile-pic me-2"
            alt="perfil"
          />
          <strong>México Mágico</strong>
        </div>
        <img
          src="https://i.imgur.com/3sZKj8a.jpeg"
          alt="Meme"
          className="img-fluid rounded"
        />
        <p className="mt-2 mb-0">DONA UN MEME !! Y LLÉVATE LOS Q QUIERAS!!!</p>
        <div className="text-muted small">
          1 mil me gusta · 702 retuits · 3 M visualizaciones
        </div>
      </div>
      <div className="border rounded p-3 mb-3 bg-white">
        <div className="d-flex align-items-center mb-2">
          <img
            src="https://via.placeholder.com/40"
            className="profile-pic me-2"
            alt="perfil"
          />
          <strong>México Mágico</strong>
        </div>
        <img
          src="https://i.imgur.com/3sZKj8a.jpeg"
          alt="Meme"
          className="img-fluid rounded"
        />
        <p className="mt-2 mb-0">DONA UN MEME !! Y LLÉVATE LOS Q QUIERAS!!!</p>
        <div className="text-muted small">
          1 mil me gusta · 702 retuits · 3 M visualizaciones
        </div>
      </div>
      
    </div>
  );
}

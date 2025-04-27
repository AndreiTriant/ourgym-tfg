// src/components/Subnav.jsx
import React from 'react';

export default function Subnav() {
  return (
    <nav className="subnav">
      <div className="dropdown">
        <button
          className="btn btn-link dropdown-toggle fw-bold text-dark text-decoration-none"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Para ti
        </button>
        <ul className="dropdown-menu">
          <li><a className="dropdown-item" href="#">Siguiendo</a></li>
          <li><a className="dropdown-item" href="#">Populares</a></li>
          <li><a className="dropdown-item" href="#">Novedades</a></li>
        </ul>
      </div>
    </nav>
  );
}

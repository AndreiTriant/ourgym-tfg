import React from "react";
import { Dropdown } from "react-bootstrap";

export default function Subnav({ filtro, setFiltro }) {
  const opciones = [
    { key: "para-ti", label: "Para ti" },
    { key: "siguiendo", label: "Siguiendo" },
    { key: "populares", label: "Populares" },
    { key: "novedades", label: "Novedades" },
  ];

  const filtroLabel = opciones.find(o => o.key === filtro)?.label || "Para ti";

  return (
    <nav className="subnav">
      <Dropdown>
        <Dropdown.Toggle
          variant="light"
          id="dropdown-basic"
          className="fw-bold border-0"
        >
          {filtroLabel}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {opciones.map(opcion => (
            <Dropdown.Item
              key={opcion.key}
              onClick={() => setFiltro(opcion.key)}
            >
              {opcion.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </nav>
  );
}

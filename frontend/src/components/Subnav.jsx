import React from "react";
import { Dropdown } from "react-bootstrap";

export default function Subnav() {
  return (
    <nav className="subnav">
      <Dropdown>
        <Dropdown.Toggle
          variant="light"
          id="dropdown-basic"
          className="fw-bold border-0"
        >
          Para ti
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#">Siguiendo</Dropdown.Item>
          <Dropdown.Item href="#">Populares</Dropdown.Item>
          <Dropdown.Item href="#">Novedades</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </nav>
  );
}

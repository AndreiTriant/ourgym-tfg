// src/components/Sidebar.jsx
import React from "react";
import { Offcanvas, Button, Nav } from "react-bootstrap";

export default function Sidebar({ items, show, onHide, mobile }) {
  const renderMenuItems = () => {
    return items.map((text) => (
      <Nav.Item key={text} className="mb-3">
        <Nav.Link href={getHrefForMenuItem(text)} className="text-dark ps-0">
          {getIconForMenuItem(text)}
          <span className="ms-2">{text}</span>
        </Nav.Link>
      </Nav.Item>
    ));
  };

  const getIconForMenuItem = (text) => {
    switch (text) {
      case "Inicio":
        return <i className="bi bi-house-door"></i>;
      case "Explorar":
        return <i className="bi bi-hash"></i>;
      case "Notificaciones":
        return <i className="bi bi-bell"></i>;
      case "Mensajes":
        return <i className="bi bi-envelope"></i>;
      case "Guardados":
        return <i className="bi bi-bookmark"></i>;
      case "Premium":
        return <i className="bi bi-gem"></i>;
      default:
        return <i className="bi bi-circle"></i>;
    }
  };

  const getHrefForMenuItem = (text) => {
    switch (text) {
      case "Inicio":
        return "/";
      case "Explorar":
        return "/explorar"; // Ajusta según tengas la ruta
      case "Notificaciones":
        return "/notificaciones"; // Ajusta según tengas la ruta
      case "Mensajes":
        return "/mensajes"; // Ajusta según tengas la ruta
      case "Guardados":
        return "/guardados";
      case "Premium":
        return "/suscripcion";
      default:
        return "/";
    }
  };

  if (mobile) {
    return (
      <Offcanvas
        show={show}
        onHide={onHide}
        backdrop
        scroll={false}
        placement="start"
        className="sidebar-mobile"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menú</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <div className="p-3">
            <Nav className="flex-column">{renderMenuItems()}</Nav>
            <Button className="w-100 mt-3 rounded-pill" variant="primary">
              Postear
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    );
  }

  return (
    <div className="sidebar sidebar-desktop p-3">
      <Nav className="flex-column">{renderMenuItems()}</Nav>
      <Button className="w-100 mt-4 rounded-pill" variant="primary">
        Postear
      </Button>
    </div>
  );
}

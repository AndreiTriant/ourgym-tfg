// src/components/Sidebar.jsx
import React from 'react';
import { Offcanvas, Button } from 'react-bootstrap';

export default function Sidebar({ items, show, onHide, mobile }) {
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
            {items.map(text => (
              <h5 className="fw-bold mb-4" key={text}>
                <a href="#">{text}</a>
              </h5>
            ))}
            <Button className="w-100 mt-3">Postear</Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    );
  }
  return (
    <div className="sidebar sidebar-desktop p-3">
      {items.map(text => (
        <h5 className="fw-bold mb-4" key={text}>
          <a href="#">{text}</a>
        </h5>
      ))}
      <Button className="w-100 mt-3">Postear</Button>
    </div>
  );
}

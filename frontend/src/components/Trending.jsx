import React from "react";
import { Button, Card } from "react-bootstrap";

export default function Trending() {
  return (
    <div className="trending">
      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <h6 className="mb-2">Suscríbete a Premium</h6>
          <p className="small text-muted mb-3">
            Desbloquea nuevas funciones y recibe un pago si eres elegible.
          </p>
          <Button className="w-100" size="sm" variant="primary">
            Suscribirse
          </Button>
        </Card.Body>
      </Card>

      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <h6 className="mb-3">A quién seguir</h6>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img
                src="https://ui-avatars.com/api/?name=Marta&background=random"
                alt="Avatar"
                className="profile-pic me-2"
                style={{ width: "32px", height: "32px" }}
              />
              <span>marta🌸✨</span>
            </div>
            <Button variant="outline-dark" size="sm" className="rounded-pill">
              Seguir
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <h6 className="mb-3">Qué está pasando</h6>
          <div className="mb-2">
            <p className="mb-1 small">
              <strong>Broncano</strong> · 2.058 publicaciones
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

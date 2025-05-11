import React from "react";
import { Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Trending() {
  const navigate = useNavigate();
  return (
    <div className="trending">
      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <h6 className="mb-2">Suscríbete a Premium</h6>
          <p className="small text-muted mb-3">
            Desbloquea nuevas funciones y recibe un pago si eres elegible.
          </p>
          <Button
            className="w-100"
            size="sm"
            variant="primary"
            onClick={() => navigate('/suscripcion')}
          >
            Suscribirse
          </Button>

        </Card.Body>
      </Card>

    </div>
  );
}

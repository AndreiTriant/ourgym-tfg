<?php

namespace App\Entity;

use App\Entity\Usuario;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Notificacion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(length: 255)]
    private string $mensaje;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $fecha;

    #[ORM\Column(type: 'boolean')]
    private bool $leida = false;

    #[ORM\ManyToOne(inversedBy: 'notificaciones')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario = null;

    public function getId(): ?int { return $this->id; }

    public function getMensaje(): string { return $this->mensaje; }
    public function setMensaje(string $mensaje): static { $this->mensaje = $mensaje; return $this; }

    public function getFecha(): \DateTimeInterface { return $this->fecha; }
    public function setFecha(\DateTimeInterface $fecha): static { $this->fecha = $fecha; return $this; }

    public function isLeida(): bool { return $this->leida; }
    public function setLeida(bool $leida): static { $this->leida = $leida; return $this; }

    public function getUsuario(): ?Usuario { return $this->usuario; }
    public function setUsuario(?Usuario $usuario): static { $this->usuario = $usuario; return $this; }
}

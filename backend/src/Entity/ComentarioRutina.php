<?php

namespace App\Entity;

use App\Entity\Rutina;
use App\Entity\Usuario;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class ComentarioRutina
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'text')]
    private string $contenido;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $fecha;

    #[ORM\ManyToOne(inversedBy: 'comentariosRutina')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(inversedBy: 'comentarios')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Rutina $rutina = null;

    public function getId(): ?int { return $this->id; }

    public function getContenido(): string { return $this->contenido; }
    public function setContenido(string $contenido): static { $this->contenido = $contenido; return $this; }

    public function getFecha(): \DateTimeInterface { return $this->fecha; }
    public function setFecha(\DateTimeInterface $fecha): static { $this->fecha = $fecha; return $this; }

    public function getUsuario(): ?Usuario { return $this->usuario; }
    public function setUsuario(?Usuario $usuario): static { $this->usuario = $usuario; return $this; }

    public function getRutina(): ?Rutina { return $this->rutina; }
    public function setRutina(?Rutina $rutina): static { $this->rutina = $rutina; return $this; }
}

<?php

namespace App\Entity;

use App\Entity\Usuario;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class MensajePrivado
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'text')]
    private string $contenido;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $fecha;

    #[ORM\Column(type: 'boolean')]
    private bool $leido = false;

    #[ORM\ManyToOne(inversedBy: 'mensajesEnviados')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $emisor = null;

    #[ORM\ManyToOne(inversedBy: 'mensajesRecibidos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $receptor = null;

    public function getId(): ?int { return $this->id; }

    public function getContenido(): string { return $this->contenido; }
    public function setContenido(string $contenido): static { $this->contenido = $contenido; return $this; }

    public function getFecha(): \DateTimeInterface { return $this->fecha; }
    public function setFecha(\DateTimeInterface $fecha): static { $this->fecha = $fecha; return $this; }

    public function isLeido(): bool { return $this->leido; }
    public function setLeido(bool $leido): static { $this->leido = $leido; return $this; }

    public function getEmisor(): ?Usuario { return $this->emisor; }
    public function setEmisor(?Usuario $emisor): static { $this->emisor = $emisor; return $this; }

    public function getReceptor(): ?Usuario { return $this->receptor; }
    public function setReceptor(?Usuario $receptor): static { $this->receptor = $receptor; return $this; }
}

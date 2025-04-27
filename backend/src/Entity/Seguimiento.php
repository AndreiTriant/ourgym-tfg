<?php

namespace App\Entity;

use App\Entity\Usuario;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Seguimiento
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\ManyToOne(inversedBy: 'seguidos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $seguidor = null;

    #[ORM\ManyToOne(inversedBy: 'seguidores')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $seguido = null;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $fecha;

    public function getId(): ?int { return $this->id; }

    public function getSeguidor(): ?Usuario { return $this->seguidor; }
    public function setSeguidor(?Usuario $seguidor): static { $this->seguidor = $seguidor; return $this; }

    public function getSeguido(): ?Usuario { return $this->seguido; }
    public function setSeguido(?Usuario $seguido): static { $this->seguido = $seguido; return $this; }

    public function getFecha(): \DateTimeInterface { return $this->fecha; }
    public function setFecha(\DateTimeInterface $fecha): static { $this->fecha = $fecha; return $this; }
}

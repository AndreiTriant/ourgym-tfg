<?php

namespace App\Entity;

use App\Entity\Usuario;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Progreso
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\ManyToOne(inversedBy: 'progresos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario = null;

    #[ORM\Column(length: 100)]
    private string $nombreEjercicio;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $fecha;

    #[ORM\Column(type: 'float')]
    private float $peso;

    #[ORM\Column(type: 'integer')]
    private int $repeticiones;

    #[ORM\Column(type: 'integer')]
    private int $series;

    public function getId(): ?int { return $this->id; }

    public function getUsuario(): ?Usuario { return $this->usuario; }
    public function setUsuario(?Usuario $usuario): static { $this->usuario = $usuario; return $this; }

    public function getNombreEjercicio(): string { return $this->nombreEjercicio; }
    public function setNombreEjercicio(string $nombreEjercicio): static { $this->nombreEjercicio = $nombreEjercicio; return $this; }

    public function getFecha(): \DateTimeInterface { return $this->fecha; }
    public function setFecha(\DateTimeInterface $fecha): static { $this->fecha = $fecha; return $this; }

    public function getPeso(): float { return $this->peso; }
    public function setPeso(float $peso): static { $this->peso = $peso; return $this; }

    public function getRepeticiones(): int { return $this->repeticiones; }
    public function setRepeticiones(int $repeticiones): static { $this->repeticiones = $repeticiones; return $this; }

    public function getSeries(): int { return $this->series; }
    public function setSeries(int $series): static { $this->series = $series; return $this; }
}

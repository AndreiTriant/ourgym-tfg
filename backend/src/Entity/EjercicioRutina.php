<?php

namespace App\Entity;

use App\Entity\Ejercicio;
use App\Entity\Rutina;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class EjercicioRutina
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\ManyToOne(inversedBy: 'ejercicios')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Rutina $rutina = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ejercicio $ejercicio = null;

    #[ORM\Column(type: 'integer')]
    private int $series;

    #[ORM\Column(type: 'integer')]
    private int $repeticiones;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $descanso = null;

    public function getId(): ?int { return $this->id; }

    public function getRutina(): ?Rutina { return $this->rutina; }
    public function setRutina(?Rutina $rutina): static { $this->rutina = $rutina; return $this; }

    public function getEjercicio(): ?Ejercicio { return $this->ejercicio; }
    public function setEjercicio(?Ejercicio $ejercicio): static { $this->ejercicio = $ejercicio; return $this; }

    public function getSeries(): int { return $this->series; }
    public function setSeries(int $series): static { $this->series = $series; return $this; }

    public function getRepeticiones(): int { return $this->repeticiones; }
    public function setRepeticiones(int $repeticiones): static { $this->repeticiones = $repeticiones; return $this; }

    public function getDescanso(): ?string { return $this->descanso; }
    public function setDescanso(?string $descanso): static { $this->descanso = $descanso; return $this; }
}

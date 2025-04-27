<?php

namespace App\Entity;

use App\Entity\EjercicioRutina;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Ejercicio
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(length: 100)]
    private string $nombre;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $imagen = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $video = null;

    #[ORM\OneToMany(mappedBy: 'ejercicio', targetEntity: EjercicioRutina::class, orphanRemoval: true)]
    private $rutinas;

    public function __construct()
    {
        $this->rutinas = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }
    public function getNombre(): string { return $this->nombre; }
    public function setNombre(string $nombre): static { $this->nombre = $nombre; return $this; }

    public function getDescripcion(): ?string { return $this->descripcion; }
    public function setDescripcion(?string $descripcion): static { $this->descripcion = $descripcion; return $this; }

    public function getImagen(): ?string { return $this->imagen; }
    public function setImagen(?string $imagen): static { $this->imagen = $imagen; return $this; }

    public function getVideo(): ?string { return $this->video; }
    public function setVideo(?string $video): static { $this->video = $video; return $this; }

    public function getRutinas(): \Doctrine\Common\Collections\Collection { return $this->rutinas; }
}

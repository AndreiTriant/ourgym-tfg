<?php

namespace App\Entity;

use App\Entity\ComentarioRutina;
use App\Entity\EjercicioRutina;
use App\Entity\Favorito;
use App\Entity\Usuario;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Rutina
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(length: 100)]
    private string $nombre;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $fechaCreacion;

    #[ORM\ManyToOne(inversedBy: 'rutinas')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario = null;

    #[ORM\OneToMany(mappedBy: 'rutina', targetEntity: ComentarioRutina::class, orphanRemoval: true)]
    private Collection $comentarios;

    #[ORM\OneToMany(mappedBy: 'rutina', targetEntity: EjercicioRutina::class, orphanRemoval: true)]
    private Collection $ejercicios;

    #[ORM\OneToMany(mappedBy: 'rutina', targetEntity: Favorito::class, orphanRemoval: true)]
    private Collection $favoritos;

    public function __construct()
    {
        $this->comentarios = new ArrayCollection();
        $this->ejercicios = new ArrayCollection();
        $this->favoritos = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }
    public function getNombre(): string { return $this->nombre; }
    public function setNombre(string $nombre): static { $this->nombre = $nombre; return $this; }

    public function getDescripcion(): ?string { return $this->descripcion; }
    public function setDescripcion(?string $descripcion): static { $this->descripcion = $descripcion; return $this; }

    public function getFechaCreacion(): \DateTimeInterface { return $this->fechaCreacion; }
    public function setFechaCreacion(\DateTimeInterface $fechaCreacion): static { $this->fechaCreacion = $fechaCreacion; return $this; }

    public function getUsuario(): ?Usuario { return $this->usuario; }
    public function setUsuario(?Usuario $usuario): static { $this->usuario = $usuario; return $this; }

    public function getComentarios(): Collection { return $this->comentarios; }
    public function getEjercicios(): Collection { return $this->ejercicios; }
    public function getFavoritos(): Collection { return $this->favoritos; }
}

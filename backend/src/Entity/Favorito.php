<?php

namespace App\Entity;

use App\Entity\Publicacion;
use App\Entity\Rutina;
use App\Entity\Usuario;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Favorito
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\ManyToOne(inversedBy: 'favoritos')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(targetEntity: Publicacion::class, inversedBy: 'favoritos')]
    private ?Publicacion $publicacion = null;

    #[ORM\ManyToOne(targetEntity: Rutina::class, inversedBy: 'favoritos')]
    private ?Rutina $rutina = null;

    public function getId(): ?int { return $this->id; }

    public function getUsuario(): ?Usuario { return $this->usuario; }
    public function setUsuario(?Usuario $usuario): static { $this->usuario = $usuario; return $this; }

    public function getPublicacion(): ?Publicacion { return $this->publicacion; }
    public function setPublicacion(?Publicacion $publicacion): static { $this->publicacion = $publicacion; return $this; }

    public function getRutina(): ?Rutina { return $this->rutina; }
    public function setRutina(?Rutina $rutina): static { $this->rutina = $rutina; return $this; }
}

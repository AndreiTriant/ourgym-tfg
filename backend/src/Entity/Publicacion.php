<?php

namespace App\Entity;

use App\Entity\Comentario;
use App\Entity\Favorito;
use App\Entity\Reaccion;
use App\Entity\Usuario;
use App\Enum\TipoPublicacion;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Publicacion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $imagen = null;

    #[ORM\Column(length: 500)]
    private string $descripcion;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $fecha;

    #[ORM\Column(type: 'string', enumType: TipoPublicacion::class)]
    private TipoPublicacion $tipo;

    #[ORM\ManyToOne(inversedBy: 'publicaciones')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario = null;

    #[ORM\OneToMany(mappedBy: 'publicacion', targetEntity: Comentario::class, orphanRemoval: true)]
    private Collection $comentarios;

    #[ORM\OneToMany(mappedBy: 'publicacion', targetEntity: Reaccion::class, orphanRemoval: true)]
    private Collection $reacciones;

    #[ORM\OneToMany(mappedBy: 'publicacion', targetEntity: Favorito::class, orphanRemoval: true)]
    private Collection $favoritos;

    public function __construct()
    {
        $this->comentarios = new ArrayCollection();
        $this->reacciones = new ArrayCollection();
        $this->favoritos = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }
    public function getImagen(): ?string { return $this->imagen; }
    public function setImagen(?string $imagen): static { $this->imagen = $imagen; return $this; }

    public function getDescripcion(): string { return $this->descripcion; }
    public function setDescripcion(string $descripcion): static { $this->descripcion = $descripcion; return $this; }

    public function getFecha(): \DateTimeInterface { return $this->fecha; }
    public function setFecha(\DateTimeInterface $fecha): static { $this->fecha = $fecha; return $this; }

    public function getTipo(): TipoPublicacion { return $this->tipo; }
    public function setTipo(TipoPublicacion $tipo): static { $this->tipo = $tipo; return $this; }

    public function getUsuario(): ?Usuario { return $this->usuario; }
    public function setUsuario(?Usuario $usuario): static { $this->usuario = $usuario; return $this; }

    public function getComentarios(): Collection { return $this->comentarios; }
    public function getReacciones(): Collection { return $this->reacciones; }
    public function getFavoritos(): Collection { return $this->favoritos; }
}

<?php

namespace App\Entity;

use App\Entity\Publicacion;
use App\Entity\Usuario;
use App\Enum\TipoReaccion;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Reaccion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\ManyToOne(inversedBy: 'reacciones')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(inversedBy: 'reacciones')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Publicacion $publicacion = null;

    #[ORM\Column(type: 'string', enumType: TipoReaccion::class)]
    private TipoReaccion $tipo;

    public function getId(): ?int { return $this->id; }

    public function getUsuario(): ?Usuario { return $this->usuario; }
    public function setUsuario(?Usuario $usuario): static { $this->usuario = $usuario; return $this; }

    public function getPublicacion(): ?Publicacion { return $this->publicacion; }
    public function setPublicacion(?Publicacion $publicacion): static { $this->publicacion = $publicacion; return $this; }

    public function getTipo(): TipoReaccion { return $this->tipo; }
    public function setTipo(TipoReaccion $tipo): static { $this->tipo = $tipo; return $this; }
}

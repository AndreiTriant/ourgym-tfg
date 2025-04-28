<?php

namespace App\Entity;

use App\Entity\Publicacion;
use App\Entity\Usuario;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Comentario
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(type: 'text')]
    private string $contenido;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $fecha;

    #[ORM\ManyToOne(inversedBy: 'comentarios')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Usuario $usuario = null;

    #[ORM\ManyToOne(inversedBy: 'comentarios')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Publicacion $publicacion = null;

    #[ORM\ManyToOne(targetEntity: self::class)]
    #[ORM\JoinColumn(name: "respuesta_a_id", referencedColumnName: "id", nullable: true)]
    private ?Comentario $respuestaA = null;

    #[ORM\Column(type: 'integer')]
    private int $puntuacion = 0;

    // Getters y Setters

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getContenido(): string
    {
        return $this->contenido;
    }

    public function setContenido(string $contenido): static
    {
        $this->contenido = $contenido;
        return $this;
    }

    public function getFecha(): \DateTimeInterface
    {
        return $this->fecha;
    }

    public function setFecha(\DateTimeInterface $fecha): static
    {
        $this->fecha = $fecha;
        return $this;
    }

    public function getUsuario(): ?Usuario
    {
        return $this->usuario;
    }

    public function setUsuario(?Usuario $usuario): static
    {
        $this->usuario = $usuario;
        return $this;
    }

    public function getPublicacion(): ?Publicacion
    {
        return $this->publicacion;
    }

    public function setPublicacion(?Publicacion $publicacion): static
    {
        $this->publicacion = $publicacion;
        return $this;
    }

    public function getRespuestaA(): ?Comentario
    {
        return $this->respuestaA;
    }

    public function setRespuestaA(?Comentario $respuestaA): static
    {
        $this->respuestaA = $respuestaA;
        return $this;
    }

    // Métodos de puntuacion

    public function getPuntuacion(): int
    {
        return $this->puntuacion;
    }

    public function setPuntuacion(int $puntuacion): static
    {
        $this->puntuacion = $puntuacion;
        return $this;
    }

    public function incrementarLikes(): void
    {
        $this->puntuacion++;
    }

    public function decrementarLikes(): void
    {
        $this->puntuacion--;
    }
}

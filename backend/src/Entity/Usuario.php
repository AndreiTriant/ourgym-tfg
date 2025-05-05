<?php

namespace App\Entity;

use App\Entity\Comentario;
use App\Entity\Favorito;
use App\Entity\MensajePrivado;
use App\Entity\Notificacion;
use App\Entity\Progreso;
use App\Entity\Publicacion;
use App\Entity\Reaccion;
use App\Entity\Rutina;
use App\Entity\Seguimiento;
use App\Entity\ComentarioRutina;
use App\Enum\TipoUsuario;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\Controller\UsuarioPorUsernameController;


use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[Get(
    uriTemplate: '/usuarios/username/{nomUsu}',
    requirements: ['nomUsu' => '.+'],
    controller: \App\Controller\UsuarioPorUsernameController::class,

    name: 'api_usuarios_por_username',
    read: false,
    deserialize: false,
    stateless: false
)]

#[ApiResource]
#[ORM\Entity]
class Usuario implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private int $id;

    #[ORM\Column(name: "nom_usu", length: 20)]
    private string $nomUsu;

    #[ORM\Column(length: 100)]
    private string $email;

    #[ORM\Column(length: 255)]
    private string $contrasenya;

    #[ORM\Column(type: 'string', enumType: TipoUsuario::class)]
    private TipoUsuario $tipoUsu;

    #[ORM\Column(type: 'datetime')]
    private \DateTimeInterface $fechaCreacion;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $fotoPerfil = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $ultConexion = null;

    #[ORM\Column(type: 'boolean')]
    private bool $verificado = false;

    #[ORM\OneToMany(mappedBy: 'usuario', targetEntity: Publicacion::class, orphanRemoval: true)]
    private Collection $publicaciones;

    #[ORM\OneToMany(mappedBy: 'usuario', targetEntity: Comentario::class, orphanRemoval: true)]
    private Collection $comentarios;

    #[ORM\OneToMany(mappedBy: 'usuario', targetEntity: ComentarioRutina::class, orphanRemoval: true)]
    private Collection $comentariosRutina;

    #[ORM\OneToMany(mappedBy: 'usuario', targetEntity: Reaccion::class, orphanRemoval: true)]
    private Collection $reacciones;

    #[ORM\OneToMany(mappedBy: 'usuario', targetEntity: Rutina::class, orphanRemoval: true)]
    private Collection $rutinas;

    #[ORM\OneToMany(mappedBy: 'emisor', targetEntity: MensajePrivado::class, orphanRemoval: true)]
    private Collection $mensajesEnviados;

    #[ORM\OneToMany(mappedBy: 'receptor', targetEntity: MensajePrivado::class, orphanRemoval: true)]
    private Collection $mensajesRecibidos;

    #[ORM\OneToMany(mappedBy: 'usuario', targetEntity: Notificacion::class, orphanRemoval: true)]
    private Collection $notificaciones;

    #[ORM\OneToMany(mappedBy: 'seguidor', targetEntity: Seguimiento::class, orphanRemoval: true)]
    private Collection $seguidos;

    #[ORM\OneToMany(mappedBy: 'seguido', targetEntity: Seguimiento::class, orphanRemoval: true)]
    private Collection $seguidores;

    #[ORM\OneToMany(mappedBy: 'usuario', targetEntity: Progreso::class, orphanRemoval: true)]
    private Collection $progresos;

    #[ORM\OneToMany(mappedBy: 'usuario', targetEntity: Favorito::class, orphanRemoval: true)]
    private Collection $favoritos;

    public function __construct()
    {
        $this->publicaciones = new ArrayCollection();
        $this->comentarios = new ArrayCollection();
        $this->comentariosRutina = new ArrayCollection();
        $this->reacciones = new ArrayCollection();
        $this->rutinas = new ArrayCollection();
        $this->mensajesEnviados = new ArrayCollection();
        $this->mensajesRecibidos = new ArrayCollection();
        $this->notificaciones = new ArrayCollection();
        $this->seguidos = new ArrayCollection();
        $this->seguidores = new ArrayCollection();
        $this->progresos = new ArrayCollection();
        $this->favoritos = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }
    public function getNomUsu(): string { return $this->nomUsu; }
    public function setNomUsu(string $nomUsu): static { $this->nomUsu = $nomUsu; return $this; }

    public function getEmail(): string { return $this->email; }
    public function setEmail(string $email): static { $this->email = $email; return $this; }

    public function getContrasenya(): string { return $this->contrasenya; }
    public function setContrasenya(string $contrasenya): static { $this->contrasenya = $contrasenya; return $this; }

    public function getTipoUsu(): TipoUsuario { return $this->tipoUsu; }
    public function setTipoUsu(TipoUsuario $tipoUsu): static { $this->tipoUsu = $tipoUsu; return $this; }

    public function getFechaCreacion(): \DateTimeInterface { return $this->fechaCreacion; }
    public function setFechaCreacion(\DateTimeInterface $fechaCreacion): static { $this->fechaCreacion = $fechaCreacion; return $this; }

    public function getDescripcion(): ?string { return $this->descripcion; }
    public function setDescripcion(?string $descripcion): static { $this->descripcion = $descripcion; return $this; }

    public function getFotoPerfil(): ?string { return $this->fotoPerfil; }
    public function setFotoPerfil(?string $fotoPerfil): static { $this->fotoPerfil = $fotoPerfil; return $this; }

    public function getUltConexion(): ?\DateTimeInterface { return $this->ultConexion; }
    public function setUltConexion(?\DateTimeInterface $ultConexion): static { $this->ultConexion = $ultConexion; return $this; }

    public function isVerificado(): bool { return $this->verificado; }
    public function setVerificado(bool $verificado): static { $this->verificado = $verificado; return $this; }

    public function getPublicaciones(): Collection { return $this->publicaciones; }
    public function getComentarios(): Collection { return $this->comentarios; }
    public function getComentariosRutina(): Collection { return $this->comentariosRutina; }
    public function getReacciones(): Collection { return $this->reacciones; }
    public function getRutinas(): Collection { return $this->rutinas; }
    public function getMensajesEnviados(): Collection { return $this->mensajesEnviados; }
    public function getMensajesRecibidos(): Collection { return $this->mensajesRecibidos; }
    public function getNotificaciones(): Collection { return $this->notificaciones; }
    public function getSeguidos(): Collection { return $this->seguidos; }
    public function getSeguidores(): Collection { return $this->seguidores; }
    public function getProgresos(): Collection { return $this->progresos; }
    public function getFavoritos(): Collection { return $this->favoritos; }
    public function getUserIdentifier(): string
{
    return $this->email;
}

public function getPassword(): string
{
    return $this->contrasenya;
}

public function getRoles(): array
{
    return ['ROLE_USER']; // o $this->roles si lo tienes
}

public function eraseCredentials(): void
{
    // vacío a menos que guardes datos sensibles temporalmente
}

public function getSalt(): ?string
{
    return null; // no es necesario con bcrypt
}

}


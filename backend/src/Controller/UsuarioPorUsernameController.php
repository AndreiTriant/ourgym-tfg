<?php

namespace App\Controller;

use App\Repository\UsuarioRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[AsController]
class UsuarioPorUsernameController
{
    private UsuarioRepository $usuarioRepository;

    public function __construct(UsuarioRepository $usuarioRepository)
    {
        $this->usuarioRepository = $usuarioRepository;
    }

    public function __invoke(string $nomUsu): JsonResponse
    {
        $usuario = $this->usuarioRepository->findOneBy(['nomUsu' => $nomUsu]);

        if (!$usuario) {
            throw new NotFoundHttpException('Usuario no encontrado');
        }

        return new JsonResponse([
            'id' => $usuario->getId(),
            'nomUsu' => $usuario->getNomUsu(),
            'email' => $usuario->getEmail(),
            'descripcion' => $usuario->getDescripcion(),
            'fechaCreacion' => $usuario->getFechaCreacion()->format('Y-m-d'),
            'publicaciones' => array_map(function ($publicacion) {
                return [
                    'id' => $publicacion->getId(),
                    'descripcion' => $publicacion->getDescripcion(),
                    'fecha' => $publicacion->getFecha()->format('Y-m-d'),
                    'tipo' => $publicacion->getTipo()->value, // si es enum
                    'imagen' => $publicacion->getImagen(),
                ];
            }, $usuario->getPublicaciones()->toArray()),
            'comentarios' => array_map(function ($comentario) {
                return [
                    'id' => $comentario->getId(),
                    'contenido' => $comentario->getContenido(),
                    'fecha' => $comentario->getFecha()->format('Y-m-d'),
                ];
            }, $usuario->getComentarios()->toArray()),
           'reacciones' => array_map(function ($reaccion) {
                return [
                    'id' => $reaccion->getId(),
                    'tipo' => $reaccion->getTipo()->value,
                    'publicacionId' => $reaccion->getPublicacion()?->getId(),
                ];
            }, $usuario->getReacciones()->toArray()),




        ]);
        
        
    }
}

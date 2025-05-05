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
            'fechaCreacion' => $usuario->getFechaCreacion()->format('Y-m-d'),
        ]);
    }
}

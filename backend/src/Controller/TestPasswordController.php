<?php

namespace App\Controller;

use App\Repository\UsuarioRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class TestPasswordController extends AbstractController
{
    #[Route('/api/test-password', name: 'test_password')]
    public function testPassword(
        UsuarioRepository $usuarioRepository,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $usuario = $usuarioRepository->findOneBy(['email' => 'admin@ourgym.com']);

        if (!$usuario) {
            return $this->json(['error' => 'Usuario no encontrado'], 404);
        }

        $esValida = $passwordHasher->isPasswordValid($usuario, '123456');

        return $this->json([
            'valida' => $esValida
        ]);
    }
}

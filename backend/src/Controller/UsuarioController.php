<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\Usuario;

class UsuarioController extends AbstractController
{
    #[Route('/api/usuario/yo', name: 'api_usuario_yo', methods: ['GET'])]
    public function me(?UserInterface $user = null): JsonResponse
    {
        if (!$user) {
            return new JsonResponse(['error' => 'No estás autenticado'], 401);
        }

        // Asegúrate que $user es instancia de tu entidad Usuario
        if (!$user instanceof Usuario) {
            return new JsonResponse(['error' => 'Tipo de usuario no válido'], 400);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'nom_usu' => $user->getNomUsu(),
            'email' => $user->getEmail(),
            'foto_perfil' => $user->getFotoPerfil(),
            'tipo_usu' => $user->getTipoUsu(),
            'verificado' => $user->isVerificado(), // o getVerificado() si no tienes isVerificado()
        ]);
    }
}

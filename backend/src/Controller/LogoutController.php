<?php
// src/Controller/LogoutController.php
namespace App\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class LogoutController extends AbstractController
{
    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(RequestStack $requestStack, TokenStorageInterface $tokenStorage): JsonResponse
    {
        $session = $requestStack->getSession();
        $session->invalidate();

        // Limpiar el token del usuario
        $tokenStorage->setToken(null);

        // Crear respuesta
        $response = new JsonResponse(['message' => 'Logout successful']);

        // Eliminar cookie de sesión (usualmente PHPSESSID)
        $response->headers->clearCookie('PHPSESSID', '/', null, true, true);

        return $response;
    }
}

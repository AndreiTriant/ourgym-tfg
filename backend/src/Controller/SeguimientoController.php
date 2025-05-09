<?php

namespace App\Controller;

use App\Entity\Seguimiento;
use App\Entity\Usuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SeguimientoController extends AbstractController
{
    #[Route('/api/seguimientos', name: 'api_seguir_usuario', methods: ['POST'])]
    public function seguirUsuario(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $datos = json_decode($request->getContent(), true);

        // Comprobamos si se envió 'seguido_id'
        if (!isset($datos['seguido_id'])) {
            return $this->json(['error' => 'Falta el seguido_id'], 400);
        }

        $usuarioActual = $this->getUser();

        if (!$usuarioActual) {
            return $this->json(['error' => 'No autenticado'], 401);
        }

        $seguido = $em->getRepository(Usuario::class)->find($datos['seguido_id']);

        if (!$seguido) {
            return $this->json(['error' => 'Usuario a seguir no encontrado'], 404);
        }

        // Comprobar si ya lo sigue
        $existe = $em->getRepository(Seguimiento::class)->findOneBy([
            'seguidor' => $usuarioActual,
            'seguido' => $seguido
        ]);

        if ($existe) {
            return $this->json(['error' => 'Ya sigues a este usuario'], 400);
        }

        $seguimiento = new Seguimiento();
        $seguimiento->setSeguidor($usuarioActual);
        $seguimiento->setSeguido($seguido);
        $seguimiento->setFecha(new \DateTime());

        $em->persist($seguimiento);
        $em->flush();

        return $this->json([
            'message' => 'Usuario seguido correctamente',
            'id' => $seguimiento->getId()
        ]);
    }

    #[Route('/api/seguimientos/{seguidoId}', name: 'api_dejar_de_seguir_usuario', methods: ['DELETE'])]
    public function dejarDeSeguir(
        int $seguidoId,
        EntityManagerInterface $em
    ): JsonResponse {
        $usuarioActual = $this->getUser();

        if (!$usuarioActual) {
            return $this->json(['error' => 'No autenticado'], 401);
        }

        $seguido = $em->getRepository(Usuario::class)->find($seguidoId);

        if (!$seguido) {
            return $this->json(['error' => 'Usuario a dejar de seguir no encontrado'], 404);
        }

        $seguimiento = $em->getRepository(Seguimiento::class)->findOneBy([
            'seguidor' => $usuarioActual,
            'seguido' => $seguido
        ]);

        if (!$seguimiento) {
            return $this->json(['error' => 'No estás siguiendo a este usuario'], 400);
        }

        $em->remove($seguimiento);
        $em->flush();

        return $this->json(['message' => 'Has dejado de seguir al usuario']);
    }

    #[Route('/api/seguimientos/contar/{usuarioId}', name: 'api_contar_seguidores_seguidos', methods: ['GET'])]
    public function contarSeguidoresSeguidos(
        int $usuarioId,
        EntityManagerInterface $em
    ): JsonResponse {
        $usuario = $em->getRepository(Usuario::class)->find($usuarioId);

        if (!$usuario) {
            return $this->json(['error' => 'Usuario no encontrado'], 404);
        }

        // Contar seguidores
        $seguidores = $em->getRepository(Seguimiento::class)->count([
            'seguido' => $usuario
        ]);

        // Contar seguidos
        $seguidos = $em->getRepository(Seguimiento::class)->count([
            'seguidor' => $usuario
        ]);

        return $this->json([
            'seguidores' => $seguidores,
            'seguidos' => $seguidos
        ]);
    }

    #[Route('/api/seguimientos/is-following/{usuarioId}', name: 'api_is_following', methods: ['GET'])]
    public function isFollowing(
        int $usuarioId,
        EntityManagerInterface $em
    ): JsonResponse {
        $usuarioActual = $this->getUser();

        if (!$usuarioActual) {
            return $this->json(['error' => 'No autenticado'], 401);
        }

        $usuarioObjetivo = $em->getRepository(Usuario::class)->find($usuarioId);

        if (!$usuarioObjetivo) {
            return $this->json(['error' => 'Usuario no encontrado'], 404);
        }

        $seguimiento = $em->getRepository(Seguimiento::class)->findOneBy([
            'seguidor' => $usuarioActual,
            'seguido' => $usuarioObjetivo
        ]);

        return $this->json([
            'siguiendo' => $seguimiento !== null
        ]);
    }



}

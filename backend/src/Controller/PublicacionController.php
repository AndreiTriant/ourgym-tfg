<?php

namespace App\Controller;

use App\Entity\Publicacion;
use App\Entity\Reaccion;
use App\Enum\TipoReaccion;
use App\Repository\PublicacionRepository;
use App\Repository\ReaccionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class PublicacionController extends AbstractController
{
    #[Route('/api/publicaciones', name: 'api_publicaciones', methods: ['GET'])]
    public function listar(PublicacionRepository $publicacionRepository): JsonResponse
    {
        $publicaciones = $publicacionRepository->findBy([], ['fecha' => 'DESC']);

        $data = array_map(function ($publicacion) {
            $usuario = $publicacion->getUsuario();

            return [
                'id' => $publicacion->getId(),
                'usuario_id' => $usuario ? $usuario->getId() : null,
                'usuario_nombre' => $usuario ? $usuario->getNomUsu() : null,
                'imagen' => $publicacion->getImagen(),
                'descripcion' => $publicacion->getDescripcion(),
                'fecha' => $publicacion->getFecha()->format('Y-m-d H:i:s'),
                'tipo' => $publicacion->getTipo()->name,
            ];
        }, $publicaciones);

        return $this->json($data);
    }

    #[Route('/api/publicacion/{id}/like', name: 'api_publicacion_like', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function like(
        Publicacion $publicacion,
        EntityManagerInterface $em,
        ReaccionRepository $reaccionRepository
    ): JsonResponse {
        $usuario = $this->getUser();

        $reaccion = $reaccionRepository->findOneBy([
            'usuario' => $usuario,
            'publicacion' => $publicacion
        ]);

        if ($reaccion && $reaccion->getTipo() === TipoReaccion::LIKE) {
            $em->remove($reaccion);
        } else {
            if (!$reaccion) {
                $reaccion = new Reaccion();
                $reaccion->setUsuario($usuario);
                $reaccion->setPublicacion($publicacion);
            }
            $reaccion->setTipo(TipoReaccion::LIKE);
            $em->persist($reaccion);
        }

        $em->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/api/publicacion/{id}/dislike', name: 'api_publicacion_dislike', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function dislike(
        Publicacion $publicacion,
        EntityManagerInterface $em,
        ReaccionRepository $reaccionRepository
    ): JsonResponse {
        $usuario = $this->getUser();

        $reaccion = $reaccionRepository->findOneBy([
            'usuario' => $usuario,
            'publicacion' => $publicacion
        ]);

        if ($reaccion && $reaccion->getTipo() === TipoReaccion::DISLIKE) {
            $em->remove($reaccion);
        } else {
            if (!$reaccion) {
                $reaccion = new Reaccion();
                $reaccion->setUsuario($usuario);
                $reaccion->setPublicacion($publicacion);
            }
            $reaccion->setTipo(TipoReaccion::DISLIKE);
            $em->persist($reaccion);
        }

        $em->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/api/publicaciones/puntuaciones', name: 'api_publicaciones_puntuaciones', methods: ['GET'])]
    public function puntuaciones(ReaccionRepository $reaccionRepository): JsonResponse
    {
        $resultados = $reaccionRepository->calcularPuntuaciones();

        return $this->json($resultados);
    }

    #[Route('/api/reacciones', name: 'api_reacciones', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function misReacciones(ReaccionRepository $reaccionRepository): JsonResponse
    {
        $usuario = $this->getUser();
        $reacciones = $reaccionRepository->findBy(['usuario' => $usuario]);

        $resultado = [];
        foreach ($reacciones as $reaccion) {
            $resultado[$reaccion->getPublicacion()->getId()] = $reaccion->getTipo()->value;
        }

        return $this->json($resultado);
    }
}

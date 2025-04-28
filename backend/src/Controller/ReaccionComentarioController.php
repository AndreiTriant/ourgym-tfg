<?php

namespace App\Controller;

use App\Entity\Comentario;
use App\Entity\ReaccionComentario;
use App\Repository\ComentarioRepository;
use App\Repository\ReaccionComentarioRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

class ReaccionComentarioController extends AbstractController
{
    private EntityManagerInterface $em;
    private TokenStorageInterface $tokenStorage;
    private ReaccionComentarioRepository $reaccionComentarioRepository;

    public function __construct(
        EntityManagerInterface $em,
        TokenStorageInterface $tokenStorage,
        ReaccionComentarioRepository $reaccionComentarioRepository
    ) {
        $this->em = $em;
        $this->tokenStorage = $tokenStorage;
        $this->reaccionComentarioRepository = $reaccionComentarioRepository;
    }

    private function getUserActual()
    {
        return $this->tokenStorage->getToken()?->getUser();
    }

    #[Route('/api/reaccion-comentario/{id}/like', name: 'like_comentario', methods: ['POST'])]
    public function likeComentario(int $id, ComentarioRepository $comentarioRepository): Response
    {
        $usuario = $this->getUserActual();
        $comentario = $comentarioRepository->find($id);

        if (!$comentario || !$usuario) {
            return new Response('Comentario o usuario no encontrado', 404);
        }

        $reaccion = $this->reaccionComentarioRepository->findOneBy([
            'comentario' => $comentario,
            'usuario' => $usuario
        ]);

        if (!$reaccion) {
            $reaccion = new ReaccionComentario();
            $reaccion->setComentario($comentario);
            $reaccion->setUsuario($usuario);
        }

        $reaccion->setTipo('like');
        $this->em->persist($reaccion);
        $this->em->flush();

        return new Response(null, 204);
    }

    #[Route('/api/reaccion-comentario/{id}/dislike', name: 'dislike_comentario', methods: ['POST'])]
    public function dislikeComentario(int $id, ComentarioRepository $comentarioRepository): Response
    {
        $usuario = $this->getUserActual();
        $comentario = $comentarioRepository->find($id);

        if (!$comentario || !$usuario) {
            return new Response('Comentario o usuario no encontrado', 404);
        }

        $reaccion = $this->reaccionComentarioRepository->findOneBy([
            'comentario' => $comentario,
            'usuario' => $usuario
        ]);

        if (!$reaccion) {
            $reaccion = new ReaccionComentario();
            $reaccion->setComentario($comentario);
            $reaccion->setUsuario($usuario);
        }

        $reaccion->setTipo('dislike');
        $this->em->persist($reaccion);
        $this->em->flush();

        return new Response(null, 204);
    }

    #[Route('/api/reacciones/comentarios', name: 'reacciones_comentarios', methods: ['GET'])]
    public function reaccionesComentarios(): JsonResponse
    {
        $usuario = $this->getUserActual();

        if (!$usuario) {
            return new JsonResponse([]);
        }

        $reacciones = $this->reaccionComentarioRepository->findBy(['usuario' => $usuario]);
        $resultado = [];

        foreach ($reacciones as $reaccion) {
            $resultado[$reaccion->getComentario()->getId()] = $reaccion->getTipo();
        }

        return new JsonResponse($resultado);
    }
}

<?php

namespace App\Controller;

use App\Repository\ComentarioRepository;
use App\Repository\ReaccionComentarioRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ComentarioController extends AbstractController
{
    private ComentarioRepository $comentRepo;
    private ReaccionComentarioRepository $reacRepo;

    public function __construct(
        ComentarioRepository $comentRepo,
        ReaccionComentarioRepository $reacRepo
    ) {
        $this->comentRepo = $comentRepo;
        $this->reacRepo   = $reacRepo;
    }

    #[Route('/api/comentarios/puntuaciones', name: 'comentarios_puntuaciones', methods: ['GET'])]
    public function puntuacionesComentarios(): JsonResponse
    {
        $resultado   = [];
        $comentarios = $this->comentRepo->findAll();

        foreach ($comentarios as $c) {
            $likes    = $this->reacRepo->count(['comentario' => $c, 'tipo' => 'like']);
            $dislikes = $this->reacRepo->count(['comentario' => $c, 'tipo' => 'dislike']);

            $resultado[$c->getId()] = $likes - $dislikes;
        }

        return new JsonResponse($resultado);
    }
}

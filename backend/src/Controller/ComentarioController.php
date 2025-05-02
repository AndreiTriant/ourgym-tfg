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

    #[Route('/api/comentario/{id}/respuestas', name: 'comentario_respuestas', methods: ['GET'])]
    public function respuestasComentario($id, ComentarioRepository $comentarioRepository): JsonResponse
    {
        $respuestas = $comentarioRepository->findBy(['respuestaA' => $id]);

        $resultado = [];
        foreach ($respuestas as $r) {
            // Calculamos puntuación real
            $likes = $this->reacRepo->count(['comentario' => $r, 'tipo' => 'like']);
            $dislikes = $this->reacRepo->count(['comentario' => $r, 'tipo' => 'dislike']);
            $puntuacion = $likes - $dislikes;

            $resultado[] = [
                'id' => $r->getId(),
                'contenido' => $r->getContenido(),
                'fecha' => $r->getFecha()->format('Y-m-d H:i:s'),
                'usuario_nombre' => $r->getUsuario()->getNomUsu(),
                'respuestaA' => $r->getRespuestaA() ? $r->getRespuestaA()->getId() : null,
                'puntuacion' => $puntuacion
            ];
        }

    return new JsonResponse($resultado);
}


    #[Route('/api/comentario/{id}/respuestas/conteo', name: 'comentario_respuestas_conteo', methods: ['GET'])]
    public function getRespuestasConteo($id, ComentarioRepository $comentarioRepository): JsonResponse
    {
        $count = $comentarioRepository->count(['respuestaA' => $id]);
        return $this->json(['count' => $count]);
    }


    //En principio no me hace falta pero lo dejo por si acaso
    #[Route('/api/publicacion/{id}/comentarios/conteo', name: 'comentarios_conteo', methods: ['GET'])]
    public function getComentariosConteo($id, ComentarioRepository $comentarioRepository): JsonResponse
    {
        $count = $comentarioRepository->count(['publicacion' => $id]);

        return $this->json(['count' => $count]);
    }

}

<?php

namespace App\Controller;

use App\Entity\Comentario;
use App\Entity\Publicacion;
use App\Entity\Reaccion;
use App\Enum\TipoReaccion;
use App\Enum\TipoPublicacion;
use App\Repository\ComentarioRepository;
use App\Repository\PublicacionRepository;
use App\Repository\ReaccionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

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
                'usuario_tipo_usu' => $usuario ? $usuario->getTipoUsu()->value : null,  // 👈 añadimos esto
                'imagen' => $publicacion->getImagen(),
                'descripcion' => $publicacion->getDescripcion(),
                'fecha' => $publicacion->getFecha()->format('Y-m-d H:i:s'),
                'tipo' => $publicacion->getTipo()->name,
            ];
        }, $publicaciones);

        return $this->json($data);
    }

    #[Route('/api/publicaciones', name: 'api_publicaciones_crear', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function crear(
        Request $request,
        EntityManagerInterface $em,
        ParameterBagInterface $params
    ): JsonResponse {
        /** @var \App\Entity\Usuario $usuario */
        $usuario = $this->getUser();

        $uploadsDirectory = $params->get('uploads_directory');

        $descripcion = $request->request->get('descripcion');
        $tipo = $request->request->get('tipo', 'POST');  // por defecto POST
        $archivo = $request->files->get('imagen');

        if (!$descripcion || empty(trim($descripcion))) {
            return new JsonResponse(['error' => 'La descripción no puede estar vacía'], 400);
        }

        $publicacion = new Publicacion();
        $publicacion->setUsuario($usuario);
        $publicacion->setDescripcion(trim($descripcion));
        $publicacion->setFecha(new \DateTime());

        if (in_array($tipo, ['POST', 'RUTINA', 'DIETA'])) {
            $publicacion->setTipo(TipoPublicacion::from($tipo));
        } else {
            $publicacion->setTipo(TipoPublicacion::POST);
        }

        if ($archivo) {
            $nombreArchivo = uniqid() . '.' . $archivo->guessExtension();
            $archivo->move($uploadsDirectory, $nombreArchivo);
            $publicacion->setImagen('/uploads/' . $nombreArchivo);
        }

        $em->persist($publicacion);
        $em->flush();

        return new JsonResponse([
            'success' => true,
            'id' => $publicacion->getId(),
            'usuario_id' => $usuario->getId(),
            'usuario_nombre' => $usuario->getNomUsu(),
            'imagen' => $publicacion->getImagen(),
            'descripcion' => $publicacion->getDescripcion(),
            'fecha' => $publicacion->getFecha()->format('Y-m-d H:i:s'),
            'tipo' => $publicacion->getTipo()->name,
        ], 201);
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

    #[Route('/api/publicacion/{id}/comentar', name: 'api_publicacion_comentar', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function comentar(
        int $id,
        Request $request,
        PublicacionRepository $publicacionRepository,
        EntityManagerInterface $em,
        ComentarioRepository $comentarioRepository
    ): JsonResponse {
        $usuario = $this->getUser();

        if (!$usuario) {
            return new JsonResponse(['error' => 'No autenticado'], 401);
        }

        $publicacion = $publicacionRepository->find($id);

        if (!$publicacion) {
            return new JsonResponse(['error' => 'Publicación no encontrada'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (!isset($data['contenido']) || empty(trim($data['contenido']))) {
            return new JsonResponse(['error' => 'El contenido no puede estar vacío'], 400);
        }

        $comentario = new Comentario();
        $comentario->setUsuario($usuario);
        $comentario->setPublicacion($publicacion);
        $comentario->setContenido(trim($data['contenido']));
        $comentario->setFecha(new \DateTime());

        if (isset($data['respuestaA'])) {
            $respuestaA = $comentarioRepository->find($data['respuestaA']);
            if (!$respuestaA) {
                return new JsonResponse(['error' => 'Comentario al que responde no encontrado'], 404);
            }
            $comentario->setRespuestaA($respuestaA);
        }

        $em->persist($comentario);
        $em->flush();

        return new JsonResponse([
            'id' => $comentario->getId(),
            'mensaje' => 'Comentario creado correctamente'
        ], 201);
    }

    #[Route('/api/publicacion/{id}/comentarios', name: 'api_publicacion_comentarios', methods: ['GET'])]
    public function listarComentarios(
        int $id,
        PublicacionRepository $publicacionRepository,
        ComentarioRepository $comentarioRepository
    ): JsonResponse {
        $publicacion = $publicacionRepository->find($id);

        if (!$publicacion) {
            return new JsonResponse(['error' => 'Publicación no encontrada'], 404);
        }

        $comentarios = $comentarioRepository->createQueryBuilder('c')
            ->where('c.publicacion = :publicacionId')
            ->andWhere('c.respuestaA IS NULL')
            ->setParameter('publicacionId', $id)
            ->orderBy('c.fecha', 'ASC')
            ->getQuery()
            ->getResult();

        $resultado = [];

        foreach ($comentarios as $comentario) {
            $resultado[] = [
                'id' => $comentario->getId(),
                'contenido' => $comentario->getContenido(),
                'fecha' => $comentario->getFecha()->format('Y-m-d H:i:s'),
                'usuario_id' => $comentario->getUsuario()?->getId(),
                'usuario_nombre' => $comentario->getUsuario()?->getNomUsu(),
                'respuestaA' => $comentario->getRespuestaA()?->getId(),
                'puntuacion' => $comentario->getPuntuacion(),
            ];
        }

        return $this->json($resultado);
    }

    #[Route('/api/publicaciones/conteos-comentarios', name: 'publicaciones_conteos_comentarios', methods: ['GET'])]
    public function obtenerConteosComentarios(EntityManagerInterface $em): JsonResponse
    {
        $results = $em->createQuery('
            SELECT p.id AS publicacion_id, COUNT(c.id) AS count
            FROM App\\Entity\\Publicacion p
            LEFT JOIN App\\Entity\\Comentario c WITH c.publicacion = p
            GROUP BY p.id
        ')->getResult();

        $conteos = [];
        foreach ($results as $result) {
            $conteos[$result['publicacion_id']] = (int)$result['count'];
        }

        return $this->json($conteos);
    }

    #[Route('/api/usuarios/{id}/publicaciones', name: 'api_usuario_publicaciones', methods: ['GET'])]
    public function publicacionesPorUsuario(
        int $id,
        PublicacionRepository $publicacionRepository
    ): JsonResponse {
        $publicaciones = $publicacionRepository->createQueryBuilder('p')
            ->where('p.usuario = :usuarioId')
            ->setParameter('usuarioId', $id)
            ->orderBy('p.fecha', 'DESC')
            ->getQuery()
            ->getResult();

        $resultado = [];

        foreach ($publicaciones as $publicacion) {
            $resultado[] = [
                'id' => $publicacion->getId(),
                'usuario_id' => $publicacion->getUsuario()->getId(),
                'usuario_nombre' => $publicacion->getUsuario()->getNomUsu(),
                'imagen' => $publicacion->getImagen(),
                'descripcion' => $publicacion->getDescripcion(),
                'fecha' => $publicacion->getFecha()->format('Y-m-d H:i:s'),
                'tipo' => $publicacion->getTipo()->name,
            ];
        }

        return $this->json($resultado);
    }

    #[Route('/api/publicaciones/{id}', name: 'api_publicacion_eliminar', methods: ['DELETE'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function eliminarPublicacion(
        int $id,
        PublicacionRepository $publicacionRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $usuario = $this->getUser();

        $publicacion = $publicacionRepository->find($id);

        if (!$publicacion) {
            return new JsonResponse(['error' => 'Publicación no encontrada'], 404);
        }

        if ($publicacion->getUsuario() !== $usuario) {
            return new JsonResponse(['error' => 'No tienes permiso para eliminar esta publicación'], 403);
        }

        $em->remove($publicacion);
        $em->flush();

        return new JsonResponse(['success' => true, 'message' => 'Publicación eliminada correctamente']);
    }

}

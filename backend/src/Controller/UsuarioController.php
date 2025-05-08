<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\Usuario;
use App\Enum\TipoUsuario;
use App\Repository\ComentarioRepository;
use App\Repository\ReaccionRepository;
use App\Repository\UsuarioRepository;
use Doctrine\ORM\EntityManagerInterface;



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
            'descripcion' => $user->getDescripcion(),
            'foto_perfil' => $user->getFotoPerfil(),
            'tipo_usu' => $user->getTipoUsu()->value, // si es enum, saca el valor
            'verificado' => $user->isVerificado(),
            'fecha_creacion' => $user->getFechaCreacion()->format('Y-m-d'),
        ]);
    }

    #[Route('/api/usuarios/{id}/comentarios', name: 'api_usuario_comentarios', methods: ['GET'])]
    public function comentariosPorUsuario(int $id, ComentarioRepository $comentarioRepository): JsonResponse
    {
        $comentarios = $comentarioRepository->createQueryBuilder('c')
            ->where('c.usuario = :usuarioId')
            ->setParameter('usuarioId', $id)
            ->orderBy('c.fecha', 'DESC')
            ->getQuery()
            ->getResult();

        $resultado = [];

        foreach ($comentarios as $comentario) {
            $resultado[] = [
                'id' => $comentario->getId(),
                'contenido' => $comentario->getContenido(),
                'fecha' => $comentario->getFecha()->format('Y-m-d H:i:s'),
                'publicacion_id' => $comentario->getPublicacion()->getId(),
                'publicacion_descripcion' => $comentario->getPublicacion()->getDescripcion(),
            ];
        }

        return $this->json($resultado);
    }

    #[Route('/api/usuarios/{id}/likes', name: 'api_usuario_likes', methods: ['GET'])]
    public function likesPorUsuario(int $id, ReaccionRepository $reaccionRepository): JsonResponse
    {
        $likes = $reaccionRepository->createQueryBuilder('r')
            ->join('r.publicacion', 'p')
            ->where('r.usuario = :usuarioId')
            ->andWhere('r.tipo = :tipo')
            ->setParameter('usuarioId', $id)
            ->setParameter('tipo', \App\Enum\TipoReaccion::LIKE->value)
            ->orderBy('r.id', 'DESC')
            ->getQuery()
            ->getResult();

        $resultado = [];

        foreach ($likes as $like) {
            $resultado[] = [
                'id' => $like->getPublicacion()->getId(),
                'usuario_id' => $like->getPublicacion()->getUsuario()->getId(),
                'usuario_nombre' => $like->getPublicacion()->getUsuario()->getNomUsu(),
                'descripcion' => $like->getPublicacion()->getDescripcion(),
            ];
            
            
        }

        return $this->json($resultado);
    }

    #[Route('/api/usuario/hacer-premium', name: 'usuario_hacer_premium', methods: ['PATCH'])]
    public function hacerPremium(UsuarioRepository $usuarioRepository, EntityManagerInterface $em): JsonResponse
    {
        /** @var \App\Entity\Usuario $usuario */
        $usuario = $this->getUser();
    
        if (!$usuario) {
            return new JsonResponse(['error' => 'No autenticado'], 401);
        }
    
        if ($usuario->getTipoUsu() === TipoUsuario::PREMIUM) {
            return new JsonResponse(['message' => 'Ya eres premium']);
        }
    
        $usuario->setTipoUsu(TipoUsuario::PREMIUM);
        $em->persist($usuario);
        $em->flush();
    
        return new JsonResponse(['message' => '¡Ahora eres premium!']);
    }

    #[Route('/api/usuario/cancelar-premium', name: 'usuario_cancelar_premium', methods: ['PATCH'])]
    public function cancelarPremium(EntityManagerInterface $em): JsonResponse
    {
        /** @var \App\Entity\Usuario $usuario */
        $usuario = $this->getUser();

        if (!$usuario) {
            return new JsonResponse(['error' => 'No autenticado'], 401);
        }

        if ($usuario->getTipoUsu() === TipoUsuario::NORMAL) {
            return new JsonResponse(['message' => 'No tienes suscripción premium']);
        }

        $usuario->setTipoUsu(TipoUsuario::NORMAL);
        $em->persist($usuario);
        $em->flush();

        return new JsonResponse(['message' => 'Suscripción premium cancelada']);
    }


}

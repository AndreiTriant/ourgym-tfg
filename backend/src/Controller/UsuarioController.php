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
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\Exception\FileNotFoundException;


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

    #[Route('/api/usuario/editar', name: 'api_editar_usuario', methods: ['PUT'])]
    public function editarUsuario(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        /** @var Usuario $usuario */
        $usuario = $this->getUser();

        if (!$usuario) {
            return $this->json(['error' => 'No autenticado'], 401);
        }

        // Leer los datos enviados
        $datos = json_decode($request->getContent(), true);

        // Cambiar nombre de usuario si se envía
        if (isset($datos['nomUsu'])) {
            // Comprobar si ya existe ese nombre en otro usuario
            $usuarioExistente = $em->getRepository(Usuario::class)->findOneBy(['nomUsu' => $datos['nomUsu']]);

            if ($usuarioExistente && $usuarioExistente->getId() !== $usuario->getId()) {
                return $this->json(['error' => 'El nombre de usuario ya está en uso'], 400);
            }

            $usuario->setNomUsu($datos['nomUsu']);
        }


        // Cambiar descripción si se envía
        if (isset($datos['descripcion'])) {
            $usuario->setDescripcion($datos['descripcion']);
        }

        // Cambiar foto de perfil si se envía
        if (isset($datos['fotoPerfil'])) {
            $usuario->setFotoPerfil($datos['fotoPerfil']);
        }

        // Cambiar la contraseña si se envía
        if (!empty($datos['contrasenya'])) {
            if (empty($datos['confirmarContrasenya']) || $datos['contrasenya'] !== $datos['confirmarContrasenya']) {
                return $this->json(['error' => 'Las contraseñas no coinciden'], 400);
            }
            $usuario->setContrasenya(
                $passwordHasher->hashPassword($usuario, $datos['contrasenya'])
            );
        }

        // Guardar cambios en la base de datos
        $em->persist($usuario);
        $em->flush();

        return $this->json(['message' => 'Datos actualizados correctamente']);
    }

    #[Route('/api/usuario/foto-perfil', name: 'api_usuario_foto_perfil', methods: ['POST'])]
    public function subirFotoPerfil(
        Request $request,
        EntityManagerInterface $em,
        SluggerInterface $slugger
    ): JsonResponse {
        /** @var Usuario $usuario */
        $usuario = $this->getUser();

        if (!$usuario) {
            return new JsonResponse(['error' => 'No autenticado'], 401);
        }

        /** @var UploadedFile|null $foto */
        $foto = $request->files->get('foto');

        if (!$foto) {
            return new JsonResponse(['error' => 'No se ha enviado ninguna imagen'], 400);
        }

        if (!$foto->isValid()) {
            return new JsonResponse(['error' => 'Archivo inválido'], 400);
        }

        // Aseguramos un nombre seguro y único para el archivo
        $nombreOriginal = pathinfo($foto->getClientOriginalName(), PATHINFO_FILENAME);
        $nombreSeguro = $slugger->slug($nombreOriginal);
        $nombreArchivo = $nombreSeguro . '-' . uniqid() . '.' . $foto->guessExtension();

        // Ruta absoluta donde se guardará
        $directorioDestino = $this->getParameter('kernel.project_dir') . '/public/uploads/perfiles';

        try {
            $foto->move($directorioDestino, $nombreArchivo);
        } catch (FileException $e) {
            return new JsonResponse(['error' => 'Error al guardar la imagen'], 500);
        }

        // Guardamos la ruta en la base de datos (ej: /uploads/perfiles/miFoto123.jpg)
        $ruta = '/uploads/perfiles/' . $nombreArchivo;
        $usuario->setFotoPerfil($ruta);
        $em->persist($usuario);
        $em->flush();

        return new JsonResponse(['foto_perfil' => $ruta]);
    }

    #[Route('/api/usuario/foto-perfil', name: 'api_eliminar_foto_perfil', methods: ['DELETE'])]
    public function eliminarFotoPerfil(Request $request): JsonResponse
    {
        $fotoPath = $request->query->get('path');

        // Protección: no permitir borrar la imagen por defecto
        if (!$fotoPath || str_contains($fotoPath, 'fotoUsuario_placeholder')) {
            return new JsonResponse(['message' => 'No se elimina placeholder o ruta inválida.'], 400);
        }

        $rutaAbsoluta = $this->getParameter('kernel.project_dir') . '/public' . $fotoPath;

        try {
            if (file_exists($rutaAbsoluta)) {
                unlink($rutaAbsoluta);
                return new JsonResponse(['message' => 'Imagen eliminada.']);
            } else {
                throw new FileNotFoundException("Archivo no encontrado");
            }
        } catch (\Throwable $e) {
            return new JsonResponse(['error' => 'Error al borrar la imagen: ' . $e->getMessage()], 500);
        }
    }


}

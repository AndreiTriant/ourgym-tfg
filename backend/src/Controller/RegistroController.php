<?php

namespace App\Controller;

use App\Entity\Usuario;
use App\Enum\TipoUsuario;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class RegistroController extends AbstractController
{
    #[Route('/api/registro', name: 'api_registro', methods: ['POST'])]
    public function registro(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $nomUsu = $data['nom_usu'] ?? null;
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        // Validaciones básicas
        if (!$nomUsu || !$email || !$password) {
            return new JsonResponse(['message' => 'Faltan datos obligatorios'], 400);
        }

        // Comprobar si ya existe el email
        $usuarioExistente = $entityManager->getRepository(Usuario::class)->findOneBy(['email' => $email]);
        if ($usuarioExistente) {
            return new JsonResponse(['message' => 'El email ya está registrado'], 409);
        }

        // Comprobar si ya existe el nombre de usuario
        $nombreExistente = $entityManager->getRepository(Usuario::class)->findOneBy(['nomUsu' => $nomUsu]);
        if ($nombreExistente) {
            return new JsonResponse(['message' => 'El nombre de usuario ya está en uso'], 409);
        }

        // Crear nuevo usuario
        $usuario = new Usuario();
        $usuario->setNomUsu($nomUsu);
        $usuario->setEmail($email);

        // Asignar tipo de usuario por defecto (Normal)
        $usuario->setTipoUsu(TipoUsuario::NORMAL);

        // Hashear la contraseña
        $hashedPassword = $passwordHasher->hashPassword($usuario, $password);
        $usuario->setContrasenya($hashedPassword);

        // Asignar imagen de perfil por defecto
        $usuario->setFotoPerfil('/imagenes/fotoUsuario_placeholder.png');

        // Asignar fecha de creación
        $usuario->setFechaCreacion(new \DateTime());

        // Guardar en base de datos
        $entityManager->persist($usuario);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Usuario registrado correctamente'], 201);
    }
}

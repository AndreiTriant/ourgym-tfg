<?php

namespace App\Repository;

use App\Entity\Reaccion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ReaccionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Reaccion::class);
    }

    public function calcularPuntuaciones(): array
    {
        $qb = $this->createQueryBuilder('r')
            ->select('IDENTITY(r.publicacion) AS publicacion_id, SUM(CASE WHEN r.tipo = :like THEN 1 WHEN r.tipo = :dislike THEN -1 ELSE 0 END) AS puntuacion')
            ->setParameter('like', 'like')
            ->setParameter('dislike', 'dislike')
            ->groupBy('r.publicacion');

        $result = $qb->getQuery()->getResult();

        $puntuaciones = [];
        foreach ($result as $fila) {
            $puntuaciones[$fila['publicacion_id']] = $fila['puntuacion'];
        }

        return $puntuaciones;
    }
}

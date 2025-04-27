<?php

namespace App\Enum;

enum TipoUsuario: string
{
    case ADMIN = 'admin';
    case NORMAL = 'normal';
    case PREMIUM = 'premium';
    case ENTRENADOR = 'entrenador';
}

<?php

namespace App\Enum;

enum TipoPublicacion: string
{
    case TEXTO = 'texto';
    case IMAGEN = 'imagen';
    case VIDEO = 'video';
}

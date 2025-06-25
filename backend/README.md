# OurGym - Backend

Proyecto Symfony con MySQL para la plataforma OurGym.

## Instalación

### 1. Clona el repositorio
```bash
git clone https://github.com/AndreiTriant/ourgym-tfg.git
cd ourgym-tfg/backend
```

### 2. Levanta la base de datos con Docker
```bash
docker compose up -d
```
> Asegúrate de que el puerto 3307 esté libre.

### 3. Instala dependencias PHP
```bash
composer install
```

### 4. Configura el entorno
Copia el archivo `.env` o crea uno llamado `.env.local` con este contenido:
```env
DATABASE_URL="mysql://ourgym:ourgym@127.0.0.1:3307/ourgym?serverVersion=8.0"
```

### 5. Ejecuta las migraciones
```bash
php bin/console doctrine:migrations:migrate
```

---

## Estructura del proyecto
- `src/Entity`: Entidades Doctrine
- `src/Enum`: Enumeraciones de tipos
- `migrations/`: Archivos de migración de base de datos
- `docker-compose.yml`: Configuración de contenedores



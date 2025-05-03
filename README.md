# Guía de instalación y puesta en marcha del proyecto

Este documento explica paso a paso cómo clonar, configurar y ejecutar el proyecto en una nueva máquina local.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalados:

- Git
- Docker y Docker Compose
- Node.js y npm
- Composer
- Symfony CLI (opcional, pero recomendado)

## Pasos detallados

### 1. Clonar el repositorio

Abre una terminal y ejecuta:

```
git clone <URL_DEL_REPOSITORIO>
cd <nombre-del-repositorio>
```

### 2. Configurar el archivo .env

El archivo `.env` contiene las variables de entorno necesarias. Si no está en el repositorio (porque suele estar en `.gitignore`), realiza uno de estos pasos:

- Si existe un archivo `.env.example`:
    ```
    cp .env.example .env
    ```

- Si no existe, crea un archivo `.env` manualmente con al menos las siguientes líneas (ajústalas según tu configuración):

    ```
    DATABASE_URL=mysql://root:root@db:3306/ourgym?serverVersion=8.0
    APP_ENV=dev
    ```

### 3. Levantar los contenedores Docker

Esto iniciará el servidor web, base de datos y demás servicios necesarios:

```
docker-compose up -d
```

### 4. Instalar las dependencias del backend (Symfony)

Ejecuta:

```
composer install
```

Si estás trabajando dentro del contenedor, puedes acceder primero con:

```
docker exec -it <nombre-del-contenedor-app> bash
```

y luego correr `composer install` dentro.

### 5. Instalar las dependencias del frontend (React/Vite)

Si tienes una carpeta `frontend` para el cliente React, entra en ella y ejecuta:

```
cd frontend
npm install
```

### 6. Aplicar las migraciones de la base de datos

Esto creará las tablas necesarias:

```
php bin/console doctrine:migrations:migrate
```

Si necesitas cargar datos de prueba (fixtures), puedes usar:

```
php bin/console doctrine:fixtures:load
```

### 7. Verificar carpetas necesarias

Asegúrate de que la carpeta `public/uploads` exista, ya que normalmente no se sube al repositorio. Si no existe, créala:

```
mkdir -p public/uploads
```

### 8. Levantar el frontend (React/Vite)

Si usas Vite, ejecuta:

```
cd frontend
npm run dev
```

### 9. Acceso a la aplicación

Por defecto, podrás acceder a:

- Backend (Symfony): http://localhost:8080
- Frontend (React): http://localhost:5173

### Notas adicionales

- Si cambias el puerto en Docker, `.env` u otros archivos, asegúrate de actualizarlo en todo el proyecto.
- Si tienes problemas de permisos en la carpeta `uploads`, asegúrate de que tu usuario tenga permisos de lectura/escritura.
- Si no tienes Symfony CLI, puedes acceder directamente al backend usando los puertos configurados en Docker.

## Resumen de comandos principales

```
git clone <URL_DEL_REPOSITORIO>
cd <nombre-del-repositorio>
cp .env.example .env
docker-compose up -d
composer install
cd frontend
npm install
cd ..
php bin/console doctrine:migrations:migrate
npm run dev
```

Si tienes alguna duda, consulta al responsable del proyecto.

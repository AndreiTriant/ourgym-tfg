# OurGym - Documentación de Arranque

Este proyecto está dividido en **Frontend (React)** y **Backend (Symfony + API Platform)**, y utiliza **Docker** para crear los contenedores necesarios.

---

## 🔄 Requisitos previos

- Tener **Docker** instalado
- Tener **Docker Compose** instalado
- Tener **Git** instalado
- Tener **Node.js** y **npm** instalado


## 👀 Clonar el repositorio

```bash
# Clona el proyecto en tu ordenador
https://github.com/AndreiTriant/ourgym-TFG.git

cd ourgym-TFG
```

---

## 📦 Backend (Symfony + API Platform)

### 1. Arrancar Docker (base de datos + API Symfony)

Desde la carpeta **raíz** del proyecto (donde está `docker-compose.yml`):

```bash
docker compose up -d
```

- Esto crea dos contenedores:
  - **MySQL** en el puerto `3307`
  - **Symfony API** en el puerto `8000`

---

### 2. Entrar en el contenedor de Symfony (backend)

```bash
docker compose exec backend bash
```

Dentro del contenedor ya puedes trabajar como si fuera tu servidor local.

### 3. Instalar dependencias de Symfony

Una vez dentro del contenedor:

```bash
composer install
```

Esto instalará todas las librerías necesarias (API Platform, seguridad, contraseñas, etc).

### 4. Crear la base de datos y migraciones

```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

Esto crea la base de datos `ourgym` y las tablas necesarias.

---

## 🌐 Frontend (React + Vite)

### 1. Instalar dependencias de React

Desde la carpeta `/frontend`:

```bash
cd frontend
npm install
```

Esto instala Bootstrap, React, React Router, Axios, etc.

### 2. Arrancar el frontend

```bash
npm run dev
```

Esto levanta el frontend en `http://localhost:5173/`.

> El `vite.config.js` ya está preparado para redirigir las llamadas `/api` al backend `localhost:8000`.


---

## 🔎 Comprobaciones rápidas

- API disponible en: [http://localhost:8000/api](http://localhost:8000/api)
- Frontend disponible en: [http://localhost:5173](http://localhost:5173)


---

## 🧬 Comandos útiles

| Comando                          | Para qué sirve                                |
|----------------------------------|------------------------------------------------|
| `docker compose up -d`           | Levantar contenedores                          |
| `docker compose down`            | Apagar contenedores                            |
| `docker compose exec backend bash`| Entrar en el contenedor de Symfony             |
| `composer install`               | Instalar dependencias backend                  |
| `php bin/console doctrine:migrations:migrate` | Ejecutar migraciones de base de datos |
| `npm install`                    | Instalar dependencias frontend                 |
| `npm run dev`                    | Levantar el frontend React                     |


---

## 🌟 Notas importantes

- El login se hace a través de la ruta `/api/login`.
- Symfony guarda la sesión mediante cookies (no usamos token JWT).
- Para ver los datos de la sesión, puedes inspeccionar las cookies en el navegador.
- Asegúrate de tener **Docker corriendo** antes de arrancar nada.
- Si hay problemas de permisos en Linux/Mac, puede ser necesario usar `sudo` delante de algunos comandos.


---

# 👋 ¡Listo!
Ahora puedes trabajar tanto en el frontend como en el backend de OurGym sin problemas.

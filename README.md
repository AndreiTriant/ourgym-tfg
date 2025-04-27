# OurGym - Documentación de Arranque

Proyecto dividido en **Frontend (React)** y **Backend (Symfony + API Platform)**, usando **Docker** para facilitar la instalación.

---

## 🔄 Requisitos Previos

- **Docker** y **Docker Compose** instalados.
- **Git** instalado.
- **Node.js** y **npm** instalados.
- **Composer** instalado localmente (solo para algunos comandos).

---

## 👀 Clonar el repositorio

```bash
git clone https://github.com/AndreiTriant/ourgym-TFG.git
cd ourgym-TFG
```

---

## 📦 Backend (Symfony + API Platform)

Desde la **carpeta raíz** (donde está `docker-compose.yml`):

### 1. Levantar Docker

```bash
docker compose up -d
```

👉 Esto levanta dos contenedores:
- **MySQL** (`localhost:3307`)
- **Symfony Backend** (`localhost:8000`)

---

### 2. Instalar dependencias backend

**Importante**: Primero entra al contenedor del backend:

```bash
docker compose exec backend bash
```

Dentro del contenedor ejecuta:

```bash
composer install
```

Esto instalará Symfony, API Platform y demás dependencias.

---

### 3. Configurar base de datos

Crear base de datos y aplicar migraciones:

```bash
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
```

Si ves algún error sobre `.env`, recuerda que debes tener el archivo `.env` bien configurado (debería venir en el proyecto).

---

## 🌐 Frontend (React + Vite)

Desde la carpeta `frontend/`:

### 1. Instalar dependencias frontend

```bash
cd frontend
npm install
```

Instala React, Vite, React Router, Axios, Bootstrap, etc.

---

### 2. Ejecutar el frontend

```bash
npm run dev
```

Esto levanta el frontend en:

👉 [http://localhost:5173](http://localhost:5173)

> Las llamadas `/api` ya están configuradas para apuntar al backend (`localhost:8000`) usando `vite.config.js`.

---

## ⚡ Comprobaciones Rápidas

- Ver API en [http://localhost:8000/api](http://localhost:8000/api)
- Ver Frontend en [http://localhost:5173](http://localhost:5173)

---

## 📁 Comandos útiles

| Comando                                  | Explicación                                  |
| ----------------------------------------- | -------------------------------------------- |
| `docker compose up -d`                   | Levanta los contenedores                    |
| `docker compose down`                    | Apaga los contenedores                      |
| `docker compose exec backend bash`       | Entra en el contenedor de Symfony backend   |
| `composer install`                       | Instala dependencias Symfony dentro del contenedor |
| `php bin/console doctrine:migrations:migrate` | Aplica las migraciones de la base de datos |
| `npm install` (en `frontend/`)            | Instala dependencias React                  |
| `npm run dev` (en `frontend/`)            | Lanza el servidor de desarrollo de React    |

---

## 🌟 Notas importantes

- **Autenticación**: se maneja por sesiones (no tokens JWT).
- **Rutas públicas**: `/api/login` (login), `/api/registro` (registro).
- **Protección de rutas**: cualquier `/api/*` excepto `/api/login` y `/api/registro` requiere estar logueado.
- **Errores comunes**:
  - Si no ves cambios: borrar caché (`docker compose down`, `docker compose up -d`).
  - Asegúrate que el `.env` exista en `backend/` para que Symfony arranque correctamente.

---

# ✅ ¡Todo listo!

Ahora puedes desarrollar el **Frontend** y el **Backend** tranquilamente en local.


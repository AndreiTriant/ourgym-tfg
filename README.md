# OurGym - Proyecto TFG

Este proyecto contiene el **frontend** (React) y el **backend** (Symfony + ApiPlatform) de la plataforma OurGym.


## Requisitos previos

* Tener instalado **Git**
* Tener instalado **Docker + Docker Compose**
* Tener instalado **Node.js + npm**
* Tener instalado **Composer** 

---

## Pasos para levantar el proyecto

### 1. Clonar el repositorio

```
git clone https://github.com/tu-usuario/OurGym.git
```

### 2. Preparar el backend (Symfony)

```
cd backend
docker-compose up -d --build
```

### 3. Instalar dependencias backend

Dentro del contenedor:

```
docker exec -it ourgym_backend composer install
```

### 4. Aplicar migraciones (opcional, si existieran)

```
docker exec -it ourgym_backend bin/console doctrine:migrations:migrate
```

(Si no hay migraciones, mostrará un aviso y puedes continuar)

### 5. Preparar el frontend (React)

```
cd frontend
npm install
npm run dev
```

Esto abrirá el frontend en `http://localhost:5173`.

---


## Estructura del proyecto

* `/frontend` → React + Vite
* `/backend` → Symfony + ApiPlatform + Docker

---


# OurGym - Proyecto TFG

Este proyecto contiene el **frontend** (React) y el **backend** (Symfony + ApiPlatform) de la plataforma OurGym.

Aquí tienes todos los pasos para clonar, instalar y levantar el proyecto correctamente.

---

## ✅ Requisitos previos

* Tener instalado **Git**
* Tener instalado **Docker + Docker Compose**
* Tener instalado **Node.js + npm**
* (Opcional) Tener instalado **Composer** si quieres correrlo fuera de Docker

---

## 🚀 Pasos para levantar el proyecto

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/OurGym.git
cd OurGym
```

### 2️⃣ Preparar el backend (Symfony)

```bash
cd backend
docker-compose up -d --build
```

### 3️⃣ Instalar dependencias backend

Dentro del contenedor:

```bash
docker exec -it ourgym_backend composer install
```

### 4️⃣ Aplicar migraciones (opcional, si existieran)

```bash
docker exec -it ourgym_backend bin/console doctrine:migrations:migrate
```

(Si no hay migraciones, mostrará un aviso y puedes continuar)

### 5️⃣ Crear datos manualmente

Usa la funcionalidad del **frontend** o herramientas como Postman para crear usuarios, publicaciones y otros datos necesarios.

---

### 6️⃣ Preparar el frontend (React)

En una terminal aparte:

```bash
cd frontend
npm install
npm run dev
```

Esto abrirá el frontend en `http://localhost:5173`.

---

### 7️⃣ Verificar URLs

* Frontend → [http://localhost:5173](http://localhost:5173)
* Backend API → [http://localhost:8000/api](http://localhost:8000/api)

---

## 🛠 Notas adicionales

* Si ves advertencias de `npm audit`, puedes ignorarlas en desarrollo.
* Si levantas en Windows, asegúrate de tener los saltos de línea en formato `LF` (no `CRLF`), especialmente en `bin/console`.
* Si necesitas datos de prueba automáticos, se puede agregar soporte para DoctrineFixturesBundle.

---

## 📦 Estructura del proyecto

* `/frontend` → React + Vite + Tailwind + shadcn/ui
* `/backend` → Symfony + ApiPlatform + Docker

---

Si tienes dudas, contacta a Andrei (creador del proyecto) ✉️

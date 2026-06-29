# DeluleBot

Aplicación de chat con personajes ficticios. Construida con React + Vite en el frontend y Express en el backend.

---

## Características

- Registro e inicio de sesión con sesión persistente (cookie HttpOnly)
- Chat con 8 personajes, respuestas automáticas por palabras clave
- Reacciones a mensajes (una sola vez por mensaje)
- Eliminación suave de mensajes
- Búsqueda dentro del chat
- Edición de perfil con foto (compresión automática en canvas)
- Conversaciones persistidas en el servidor
- Diseño responsive (mobile y desktop)

---

## Stack tecnológico

| Capa       | Tecnología                          |
|------------|-------------------------------------|
| Frontend   | React 19, React Router v7, Vite     |
| Backend    | Node.js, Express 5                  |
| Auth       | Cookie HttpOnly, pbkdf2 + salt      |
| Estilos    | CSS custom + Bootstrap 5 (parcial)  |
| Datos      | JSON files (via módulo `config/db`) |

---

## Estructura del proyecto

```
DeluleBot/
├── .gitignore              # Archivos ignorados por git
├── README.md               # Este archivo
├── delulebot-frontend/     # React + Vite (código fuente)
│   ├── src/
│   │   ├── context/        # AuthContext (estado de sesión)
│   │   ├── hooks/          # useMessages (cache en memoria)
│   │   ├── services/       # Llamadas a la API
│   │   ├── pages/          # LoginPage, AppPage
│   │   ├── components/     # Sidebar, ChatPanel, ProfileModal, etc.
│   │   ├── data/           # Contactos locales, respuestas del bot
│   │   └── utils/          # bot.js (lógica de respuestas)
│   └── public/             # CSS, iconos, imágenes
│
└── delulebot-backend/      # Express API
    ├── src/
    │   ├── controllers/    # auth, mensajes, perfil, contactos
    │   ├── services/       # Lógica de negocio
    │   ├── routes/         # Definición de rutas
    │   └── middleware/     # requireAuth
    ├── config/             # db.js (lectura/escritura de JSON)
    ├── data/               # Archivos JSON (generados en runtime)
    └── server.js           # Entry point
```

> El build de producción (`DeluleBot-build/`) se genera con `npm run build` y no se sube al repositorio.

---

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/aye1104/DeluleBot.git
cd DeluleBot
```

### 2. Instalar dependencias del backend

```bash
cd delulebot-backend
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

El archivo `.env` mínimo:

```env
PORT=3000
```

### 4. Instalar dependencias del frontend y generar el build

```bash
cd ../delulebot-frontend
npm install
npm run build
```

---

## Correr en producción

```bash
cd delulebot-backend
npm start
```

Abrir en el navegador: [http://localhost:3000](http://localhost:3000)

---

## Correr en desarrollo

Se necesitan **dos terminales**:

**Terminal 1 — Backend:**
```bash
cd delulebot-backend
npm run dev
```

**Terminal 2 — Frontend (Vite con proxy):**
```bash
cd delulebot-frontend
npm run dev
```

Abrir en el navegador: [http://localhost:5173](http://localhost:5173)

---

## Seguridad

- Token de sesión exclusivamente en **cookie HttpOnly** — inaccesible desde JavaScript
- Contraseñas hasheadas con `crypto.pbkdf2Sync` + salt aleatorio (10.000 iteraciones)
- Rotación de token en cada inicio de sesión
- Datos aislados por usuario — cada usuario solo accede a sus propios mensajes y perfil
- Validación en cliente y servidor
- Sin riesgo de XSS — React renderiza mensajes como texto plano
- CORS restringido a orígenes conocidos

---

## Variables de entorno

| Variable   | Descripción                                                        | Default |
|------------|--------------------------------------------------------------------|---------|
| `PORT`     | Puerto del servidor Express                                        | `3000`  |
| `NODE_ENV` | Entorno (`production` activa `secure` en la cookie de sesión)      | —       |

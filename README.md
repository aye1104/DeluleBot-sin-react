# DeluleBot

Aplicación de chat con personajes ficticios. Frontend en HTML/CSS/JS vanilla servido directamente por Express — sin bundler, sin framework.

---

## Stack

| Capa       | Tecnología                                        |
|------------|---------------------------------------------------|
| Frontend   | HTML, CSS, JavaScript (ES Modules, sin bundler)   |
| Backend    | Node.js + Express                                 |
| Auth       | `express-session` + cookie HttpOnly               |
| Contraseñas| `crypto.pbkdf2Sync` + salt aleatorio (10.000 it.) |
| Datos      | JSON files por usuario (`config/db.js`)           |
| Seguridad  | Rate limiting (`express-rate-limit`), XSS escape  |

---

## Estructura

```
DeluleBot/
├── .gitignore
├── README.md
│
├── delulebot-vanilla/          # Frontend estático
│   ├── index.html
│   ├── assets/
│   │   ├── icons/              # SVG de la UI
│   │   └── img/                # Fotos de los personajes
│   ├── css/
│   │   ├── main.css
│   │   ├── chat.css
│   │   ├── sidebar.css
│   │   └── responsive.css
│   └── js/
│       ├── main.js             # Router SPA
│       ├── api.js              # fetch wrapper + interceptor 401
│       ├── auth.js             # Sesión en localStorage (cache)
│       ├── messages.js         # Estado de mensajes + rollback optimista
│       ├── bot.js              # Lógica de respuestas automáticas
│       ├── utils.js            # escapeHtml, safeFoto
│       ├── components/         # chatPanel, sidebar, chatCard, messageBubble, profileModal
│       ├── pages/              # login.js, app.js
│       └── data/               # contacts.js, responses.js (datos locales del bot)
│
└── delulebot-backend/          # API Express
    ├── server.js               # Entry point
    ├── .env.example            # Variables de entorno de ejemplo
    ├── config/
    │   └── db.js               # Lectura/escritura JSON con cache en memoria
    ├── data/
    │   └── contactos.json      # Seed de personajes (trackeado en git)
    └── src/
        ├── controllers/        # auth, mensajes, perfil, contactos
        ├── services/           # Lógica de negocio por dominio
        ├── routes/             # Definición de rutas REST
        └── middleware/
            └── auth.middleware.js
```

---

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

---

## Instalación

```bash
git clone https://github.com/aye1104/DeluleBot.git
cd DeluleBot/delulebot-backend
npm install
cp .env.example .env
```

Editá `.env` y cambiá `SESSION_SECRET` por una clave aleatoria larga.

---

## Correr el proyecto

```bash
cd delulebot-backend
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000). El backend sirve el frontend estático directamente — no se necesita una segunda terminal.

---

## Variables de entorno

| Variable         | Descripción                                                   | Default |
|------------------|---------------------------------------------------------------|---------|
| `PORT`           | Puerto del servidor                                           | `3000`  |
| `SESSION_SECRET` | Clave secreta para firmar la cookie de sesión                 | —       |
| `NODE_ENV`       | `production` activa `secure: true` en la cookie de sesión     | —       |

---

## Seguridad

- Sesión server-side con `express-session` — cookie `HttpOnly`, `SameSite: strict`
- Contraseñas con PBKDF2 + salt aleatorio, nunca en texto plano
- Rate limiting: máx. 20 intentos cada 15 min en rutas de auth
- XSS prevenido: todo contenido de usuario se escapa con `escapeHtml()` antes de insertar en `innerHTML`
- URLs de foto validadas con `safeFoto()` — solo `/assets/` o data URLs de imagen
- Datos aislados por usuario — cada usuario accede únicamente a sus propios mensajes y perfil

---

## API

| Método   | Ruta                                          | Descripción                     |
|----------|-----------------------------------------------|---------------------------------|
| `POST`   | `/api/auth/registro`                          | Crear cuenta                    |
| `POST`   | `/api/auth/login`                             | Iniciar sesión                  |
| `POST`   | `/api/auth/logout`                            | Cerrar sesión                   |
| `GET`    | `/api/perfil`                                 | Obtener perfil del usuario      |
| `PUT`    | `/api/perfil`                                 | Actualizar perfil / foto        |
| `GET`    | `/api/contactos`                              | Listar personajes disponibles   |
| `GET`    | `/api/contactos/:id/mensajes`                 | Historial de mensajes           |
| `POST`   | `/api/contactos/:id/mensajes`                 | Enviar mensaje                  |
| `PATCH`  | `/api/contactos/:id/mensajes/:msgId/status`   | Actualizar estado del mensaje   |
| `PATCH`  | `/api/contactos/:id/mensajes/:msgId/reaction` | Agregar reacción                |
| `DELETE` | `/api/contactos/:id/mensajes/:msgId`          | Eliminar mensaje (soft delete)  |
| `DELETE` | `/api/contactos/:id/mensajes`                 | Borrar conversación             |

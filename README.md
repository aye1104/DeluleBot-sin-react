# DeluleBot

Aplicación de chat con personajes ficticios (Two-Face, Messi, Homero Simpson, Hatsune Miku y más).
Frontend en HTML/CSS/JS vanilla servido directamente por Express — sin bundler, sin framework de frontend.

---

## Stack

| Capa         | Tecnología                                           |
|--------------|------------------------------------------------------|
| Frontend     | HTML, CSS, JavaScript (ES Modules, sin bundler)      |
| Estilos      | CSS propio + Bootstrap 5.3.3 (CDN, parcial)          |
| Backend      | Node.js 18+ · Express 5                              |
| Auth         | `express-session` + cookie `HttpOnly` / `SameSite`  |
| Sesiones     | `session-file-store` (persisten entre reinicios)     |
| Contraseñas  | `crypto.pbkdf2Sync` + salt aleatorio (10 000 iter.)  |
| Datos        | Archivos JSON por usuario (`config/db.js`)           |
| Seguridad    | Rate limiting, XSS escape, validación de foto        |

---

## Estructura

```
DeluleBot/
├── .gitignore
├── README.md
│
├── delulebot-vanilla/              # Frontend estático
│   ├── index.html
│   ├── assets/
│   │   ├── icons/                  # SVG de la UI
│   │   └── img/                    # Fotos de los personajes
│   ├── css/
│   │   ├── main.css
│   │   ├── chat.css
│   │   ├── sidebar.css
│   │   └── responsive.css
│   └── js/
│       ├── main.js                 # Router SPA (pushState)
│       ├── api.js                  # fetch wrapper + interceptor 401
│       ├── auth.js                 # Estado de sesión (localStorage)
│       ├── messages.js             # Estado de mensajes + rollback optimista
│       ├── bot.js                  # Respuestas automáticas por personaje
│       ├── utils.js                # escapeHtml, safeFoto
│       ├── components/
│       │   ├── chatPanel.js
│       │   ├── chatCard.js
│       │   ├── sidebar.js
│       │   ├── messageBubble.js
│       │   └── profileModal.js
│       ├── pages/
│       │   ├── login.js
│       │   └── app.js
│       └── data/
│           ├── contacts.js         # Datos locales iniciales (se reemplazan por la API)
│           └── responses.js        # Triggers y respuestas de cada personaje
│
└── delulebot-backend/              # API REST con Express
    ├── server.js                   # Entry point
    ├── .env.example                # Variables de entorno de ejemplo
    ├── config/
    │   └── db.js                   # Lectura/escritura JSON con caché en memoria
    ├── data/
    │   ├── contactos.json          # Seed de personajes (trackeado en git)
    │   ├── sessions/               # Sesiones de usuario (generado, gitignoreado)
    │   ├── usuarios.json           # Cuentas de usuario (generado, gitignoreado)
    │   ├── mensajes_*.json         # Mensajes por usuario (generado, gitignoreado)
    │   └── perfil_*.json           # Perfiles de usuario (generado, gitignoreado)
    └── src/
        ├── controllers/            # auth, mensajes, perfil, contactos
        ├── services/               # Lógica de negocio por dominio
        │   └── seed.js             # Script opcional para resetear datos iniciales
        ├── routes/                 # Definición de rutas REST
        └── middleware/
            └── auth.middleware.js
```

---

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

---

## Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/aye1104/DeluleBot-sin-react.git
cd DeluleBot-sin-react
git checkout develop
cd DeluleBot/delulebot-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Abrí `.env` y reemplazá el valor de `SESSION_SECRET` por una clave larga y aleatoria:

```env
PORT=3000
SESSION_SECRET=una-clave-muy-larga-y-dificil-de-adivinar
```

### 4. Iniciar el servidor

**Desarrollo** (reinicio automático con nodemon):
```bash
npm run dev
```

**Producción**:
```bash
npm start
```

Abrí [http://localhost:3000](http://localhost:3000).
El backend sirve el frontend estático directamente — no se necesita una segunda terminal ni un servidor de desarrollo separado.

---

## Primer uso

1. Andá a [http://localhost:3000](http://localhost:3000)
2. Creá una cuenta con **Registrarse**
3. Elegí un personaje del panel izquierdo y empezá a chatear

---

## Resetear datos iniciales (opcional)

Si necesitás regenerar `contactos.json` o crear el usuario `admin`:

```bash
node src/services/seed.js
```

> Esto sobreescribe `data/contactos.json`. Los usuarios y mensajes existentes no se tocan.

---

## Variables de entorno

| Variable         | Descripción                                               | Default |
|------------------|-----------------------------------------------------------|---------|
| `PORT`           | Puerto del servidor                                       | `3000`  |
| `SESSION_SECRET` | Clave para firmar la cookie de sesión (cambiar siempre)   | —       |
| `NODE_ENV`       | `production` activa `secure: true` en la cookie          | —       |

---

## Seguridad

- Sesión server-side con `express-session` y `session-file-store` — cookie `HttpOnly`, `SameSite: strict`, persiste entre reinicios del servidor
- Contraseñas con PBKDF2 + salt aleatorio — nunca en texto plano
- Rate limiting: máx. 20 intentos cada 15 min en login y registro
- XSS prevenido: todo contenido de usuario se escapa con `escapeHtml()` antes de insertar en `innerHTML`
- URLs de foto validadas con `safeFoto()` — solo rutas `/assets/` o data URLs de imagen (`jpeg`, `png`, `webp`)
- Tamaño máximo de foto de perfil: 300 KB (validado en backend y comprimido en frontend)
- Datos aislados por usuario — cada cuenta accede únicamente a sus propios mensajes y perfil

---

## API

Todas las rutas excepto `/api/auth/*` y `/api/health` requieren sesión activa (cookie).

| Método   | Ruta                                              | Descripción                     |
|----------|---------------------------------------------------|---------------------------------|
| `GET`    | `/api/health`                                     | Estado del servidor             |
| `POST`   | `/api/auth/registro`                              | Crear cuenta                    |
| `POST`   | `/api/auth/login`                                 | Iniciar sesión                  |
| `POST`   | `/api/auth/logout`                                | Cerrar sesión                   |
| `GET`    | `/api/perfil`                                     | Obtener perfil del usuario      |
| `PUT`    | `/api/perfil`                                     | Actualizar perfil / foto        |
| `GET`    | `/api/contactos`                                  | Listar personajes disponibles   |
| `GET`    | `/api/contactos/:id/mensajes`                     | Historial de mensajes           |
| `POST`   | `/api/contactos/:id/mensajes`                     | Enviar mensaje                  |
| `PATCH`  | `/api/contactos/:id/mensajes/:msgId/status`       | Actualizar estado del mensaje   |
| `PATCH`  | `/api/contactos/:id/mensajes/:msgId/reaction`     | Agregar reacción                |
| `DELETE` | `/api/contactos/:id/mensajes/:msgId`              | Eliminar mensaje (soft delete)  |
| `DELETE` | `/api/contactos/:id/mensajes`                     | Borrar conversación             |

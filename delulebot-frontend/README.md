# DeluleBot — Frontend

Aplicación React del cliente de chat. Construida con Vite.

## Stack

- React 19
- React Router v7
- Vite (bundler + dev server con proxy)
- Bootstrap 5 (estilos parciales)

## Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo en http://localhost:5173
npm run build    # Build de producción → ../DeluleBot-build/
npm run preview  # Vista previa del build
```

## Proxy en desarrollo

El `vite.config.js` redirige `/api/*` al backend en `http://localhost:3000`, por lo que no hace falta configurar nada extra al correr ambos servidores en local.

## Estructura de `src/`

```
src/
├── context/        # AuthContext — estado de sesión global
├── hooks/          # useMessages — cache de mensajes en memoria (useRef)
├── services/       # api.js + wrappers por entidad (auth, mensajes, perfil, contactos)
├── pages/          # LoginPage, AppPage
├── components/     # Sidebar, ChatPanel, MessageBubble, ProfileModal
├── data/           # contacts.js (seed), responses.js (respuestas del bot)
└── utils/          # bot.js — lógica de respuestas automáticas
```

## Build de producción

El build genera los archivos en `../DeluleBot-build/`, que Express sirve como archivos estáticos. Ver el README raíz para instrucciones completas.

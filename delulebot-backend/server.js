require('dotenv').config();
const express      = require('express');
const session      = require('express-session');
const rateLimit    = require('express-rate-limit');
const path         = require('path');
const { connectDB } = require('./config/db');
const requireAuth  = require('./src/middleware/auth.middleware');

const app  = express();
const PORT = process.env.PORT || 3000;

connectDB();

// ── Middlewares ────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));

app.use(session({
  secret:            process.env.SESSION_SECRET || 'delulebot-secret-dev',
  resave:            false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   7 * 24 * 60 * 60 * 1000,
  },
}));

// ── Rate limiting en auth ──────────────────────────────────────
const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             20,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Demasiados intentos. Esperá 15 minutos.' },
});

// ── Frontend estático (vanilla) ────────────────────────────────
app.use(express.static(path.join(__dirname, '../delulebot-vanilla')));

// ── Health check (público) ─────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DeluleBot API funcionando' });
});

// ── Auth (público) ─────────────────────────────────────────────
// Rate limit solo en login y registro, no en logout
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/registro', authLimiter);
app.use('/api/auth', require('./src/routes/auth.routes'));

// ── Rutas protegidas (requieren sesión activa) ─────────────────
app.use('/api/contactos',                      requireAuth, require('./src/routes/contactos.routes'));
app.use('/api/contactos/:contactoId/mensajes', requireAuth, require('./src/routes/mensajes.routes'));
app.use('/api/perfil',                         requireAuth, require('./src/routes/perfil.routes'));

// ── Fallback: sirve index.html para rutas desconocidas ─────────
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../delulebot-vanilla', 'index.html'));
});

// ── Manejador global de errores ────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack || err.message);
  res.status(err.status || 500).json({ error: 'Error interno del servidor' });
});

// ── Arrancar ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

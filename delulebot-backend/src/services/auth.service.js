const crypto = require('crypto');
const { getCollection, saveCollection } = require('../../config/db');
const KEY = 'usuarios';

function _hash(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha256').toString('hex');
}

function _all() {
  const data = getCollection(KEY);
  return Array.isArray(data) ? data : [];
}

function _safe(user) {
  const { salt, passwordHash, ...rest } = user;
  return rest;
}

function findByUsername(username) {
  return _all().find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}

function findById(id) {
  const user = _all().find(u => u.id === id);
  return user ? _safe(user) : null;
}

function register(username, password, name) {
  if (findByUsername(username)) throw new Error('El nombre de usuario ya está en uso.');
  const salt    = crypto.randomBytes(16).toString('hex');
  const newUser = {
    id:           crypto.randomUUID(),
    username:     username.trim(),
    name:         (name || username).trim(),
    status:       'disponible',
    photo:        null,
    salt,
    passwordHash: _hash(password, salt),
    createdAt:    new Date().toISOString(),
  };
  const users = _all();
  users.push(newUser);
  saveCollection(KEY, users);
  return _safe(newUser);
}

function login(username, password) {
  const users = _all();
  const idx   = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
  if (idx === -1) return { ok: false, reason: 'not_found' };
  if (_hash(password, users[idx].salt) !== users[idx].passwordHash)
    return { ok: false, reason: 'wrong_password' };
  return { ok: true, user: _safe(users[idx]) };
}

module.exports = { register, login, findById };

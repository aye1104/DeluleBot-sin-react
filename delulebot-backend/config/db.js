const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// In-memory cache: evita leer el disco en cada petición
const _cache = new Map();

function getCollection(name) {
  if (_cache.has(name)) return _cache.get(name);
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(file)) { _cache.set(name, []); return []; }
  const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
  _cache.set(name, data);
  return data;
}

function saveCollection(name, data) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  _cache.set(name, data);
}

function connectDB() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(`✅ Base de datos JSON lista en: ${DATA_DIR}`);
}

module.exports = { connectDB, getCollection, saveCollection };

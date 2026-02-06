const fs = require('fs');
const path = require('path');

const geoPath = path.join(__dirname, '..', 'public', 'geo', 'peru_departamentos.geojson');

if (!fs.existsSync(geoPath)) {
  console.error('No se encontró el archivo:', geoPath);
  process.exit(2);
}

const raw = fs.readFileSync(geoPath, 'utf8');
let json;
try {
  json = JSON.parse(raw);
} catch (e) {
  console.error('Error parseando JSON:', e.message);
  process.exit(3);
}

if (!Array.isArray(json.features)) {
  console.error('El GeoJSON no tiene la propiedad features como array.');
  process.exit(4);
}

const total = json.features.length;
const withGeometry = json.features.filter(f => f.geometry && Array.isArray(f.geometry.coordinates) && f.geometry.coordinates.length>0).length;
const withName = json.features.filter(f => {
  const p = f.properties || {};
  return !!(p.NOMBDEP || p.NOMDEP || p.DEPARTAM || p.DEPARTAMENTO || p.name || p.NAME || p.PROVINCIA);
}).length;

console.log('GeoJSON encontrado:', geoPath);
console.log('Features total:', total);
console.log('Features con geometría:', withGeometry);
console.log('Features con nombre de departamento:', withName);

if (withGeometry === 0) process.exit(5);
console.log('OK: GeoJSON parece contener geometrías.');

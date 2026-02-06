import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import localGeo from '../assets/peru-geo.json';
import { contarCasosPorDepartamento, obtenerColor, obtenerLeyenda } from '../utils/mapUtils';

const MapView = ({ reportes = [], tipoReporte = 'Confirmado', selectedDepartamento = 'Todos' }) => {
  const [geoData, setGeoData] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    // Try to fetch a full GeoJSON from public/geo/peru_departamentos.geojson first
    fetch('/geo/peru_departamentos.geojson')
      .then(res => {
        if (!res.ok) throw new Error('no-file');
        return res.json();
      })
      .then(json => {
        setGeoData(json);
      })
      .catch(() => {
        // Fallback to local asset if it contains coordinates
        const hasCoords = Array.isArray(localGeo.features) && localGeo.features.some(f => Array.isArray(f.geometry.coordinates) && f.geometry.coordinates.length > 0);
        if (hasCoords) {
          setGeoData(localGeo);
        } else {
          setGeoData(null);
          setLoadError('GeoJSON de departamentos no encontrado o vacío. Coloca /public/geo/peru_departamentos.geojson con geometrías.');
        }
      });
  }, []);

  const casosPorDep = contarCasosPorDepartamento(reportes, tipoReporte === 'Todos' ? null : tipoReporte);

  const style = (feature) => {
    const rawName = feature.properties.NOMBDEP || feature.properties.NOMDEP || feature.properties.DEPARTAM || feature.properties.DEPARTAMENTO || feature.properties.name || feature.properties.NAME || '';
    const dep = (rawName || '').toString().toUpperCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    const cantidad = casosPorDep[dep] || 0;
    const fill = obtenerColor(tipoReporte === 'Todos' ? null : tipoReporte, cantidad);
    // If a departamento is specifically selected, emphasize it
    const selected = selectedDepartamento && selectedDepartamento !== 'Todos' && dep === (selectedDepartamento || '').toUpperCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

    return {
      fillColor: fill,
      weight: selected ? 2 : 1,
      opacity: 1,
      color: selected ? '#0d6efd' : '#ffffff',
      dashArray: '',
      fillOpacity: selected ? 0.95 : 0.85,
    };
  };

  const onEachFeature = (feature, layer) => {
    const depName = feature.properties.NOMBDEP || feature.properties.NOMDEP || feature.properties.DEPARTAM || feature.properties.DEPARTAMENTO || feature.properties.name || feature.properties.NAME || 'Desconocido';
    const depUpper = (depName || '').toString().toUpperCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
    const cantidad = casosPorDep[depUpper] || 0;
    layer.bindPopup(`\n      <strong>${depName}</strong><br/>\n      ${tipoReporte === 'Todos' ? 'Casos totales' : tipoReporte}: ${cantidad}\n    `);
  };

  return (
    <div className="card p-3 h-100 border-0">
      <h5 className="mb-3 fw-bold" style={{fontSize: '1rem'}}>Mapa de Vigilancia Epidemiológica</h5>
      {loadError && (
        <div className="alert alert-warning mb-3">{loadError}</div>
      )}
      <div style={{ position: 'relative', height: '450px', width: '100%' }}>
        <MapContainer
          center={[-12.0, -71.5]}
          zoom={6}
          style={{ height: '100%', width: '100%', borderRadius: '8px' }}
          zoomControl={true}
          key={tipoReporte + JSON.stringify(casosPorDep)}
          bounds={[[-18.35, -81.33], [-0.5, -68.65]]}
          maxBounds={[[-19, -82], [1, -67]]}
          maxBoundsViscosity={0.9}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geoData && <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />}
        </MapContainer>
        
        {/* Leyenda posicionada en esquina inferior derecha */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#ffffff',
            padding: '12px 16px',
            borderRadius: '6px',
            border: '2px solid #d1d5db',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 400,
            maxWidth: '220px',
            fontSize: '0.85rem',
          }}
        >
          <div className="fw-bold mb-2" style={{ fontSize: '0.9rem' }}>
            Casos de Dengue
          </div>
          {obtenerLeyenda().map((item, idx) => (
            <div key={idx} className="d-flex align-items-center mb-1">
              <span
                className="me-2"
                style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '18px',
                  backgroundColor: item.color,
                  borderRadius: '2px',
                  border: '1px solid #999',
                }}
              />
              <span style={{ fontSize: '0.75rem' }}>
                {item.rango}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;
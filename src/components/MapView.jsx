import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { obtenerColor, contarCasosPorDepartamento, obtenerCasosPorProvincia, obtenerLeyenda } from '../utils/mapUtils';

// Helper component to handle zoom and bounds
function ZoomHandler({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
    }
  }, [bounds, map]);
  return null;
}

const MapView = ({ filters, reportes, tipoReporte }) => {
  const [geoData, setGeoData] = useState(null);
  const [provGeoData, setProvGeoData] = useState(null);
  const [lastZoomBounds, setLastZoomBounds] = useState(null);

  const selectedDepartamento = filters.departamento;
  // tipoReporte comes from activeTab in Dashboard (StatsCards)

  useEffect(() => {
    // Load departments
    fetch('/geo/peru_departamentos.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data))
      .catch((err) => console.error('Error loading department geojson:', err));

    // Load provinces
    fetch('/geo/peru_provincias.geojson')
      .then((res) => res.json())
      .then((data) => setProvGeoData(data))
      .catch((err) => console.error('Error loading province geojson:', err));
  }, []);

  const activeLayers = {
    sivapre: filters.sivapre,
    noti: filters.noti,
    netlab: filters.netlab
  };

  const casosPorDep = useMemo(() => contarCasosPorDepartamento(reportes, tipoReporte, activeLayers), [reportes, tipoReporte, activeLayers]);

  const casosPorProv = useMemo(() => {
    if (selectedDepartamento === 'Todos') return {};
    return obtenerCasosPorProvincia(selectedDepartamento, reportes, tipoReporte, activeLayers);
  }, [selectedDepartamento, reportes, tipoReporte, activeLayers]);

  // Normalize string for comparison
  const normalize = (str) => {
    if (!str) return '';
    return str.toString().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  };

  const depStyle = (feature) => {
    const rawName = feature.properties.NOMBDEP || feature.properties.NOMDEP || feature.properties.DEPARTAM || feature.properties.DEPARTAMENTO || feature.properties.name || '';
    const dep = normalize(rawName);
    const targetDep = normalize(selectedDepartamento);
    const isTarget = selectedDepartamento === 'Todos' || dep === targetDep;

    if (!isTarget) {
      return {
        fillColor: '#E5E7EB',
        weight: 0.5,
        opacity: 0.2,
        color: '#ffffff',
        fillOpacity: 0.1,
      };
    }

    if (selectedDepartamento !== 'Todos') {
      return {
        fillColor: 'transparent',
        weight: 3,
        opacity: 1,
        color: '#0d6efd',
        dashArray: '5, 5',
        fillOpacity: 0,
      };
    }

    const cantidad = casosPorDep[dep] || 0;
    return {
      fillColor: obtenerColor(null, cantidad),
      weight: 1,
      opacity: 1,
      color: '#ffffff',
      fillOpacity: 0.85,
    };
  };

  const provStyle = (feature) => {
    const rawDep = feature.properties.FIRST_NOMB || feature.properties.DEPARTAM || feature.properties.DEPARTAMENTO || '';
    const rawProv = feature.properties.NOMBPROV || feature.properties.PROVINCIA || '';

    const dep = normalize(rawDep);
    const prov = normalize(rawProv);
    const targetDep = normalize(selectedDepartamento);

    if (dep !== targetDep) return { stroke: false, fill: false, opacity: 0, fillOpacity: 0 };

    const cantidad = casosPorProv[prov] || 0;
    return {
      fillColor: obtenerColor(null, cantidad),
      weight: 1.5,
      opacity: 1,
      color: '#ffffff',
      fillOpacity: 0.9,
    };
  };

  const onEachDep = (feature, layer) => {
    const name = feature.properties.NOMBDEP || feature.properties.NOMDEP || feature.properties.DEPARTAM || feature.properties.DEPARTAMENTO || feature.properties.name || 'Desconocido';
    const depNorm = normalize(name);
    const targetDepNorm = normalize(selectedDepartamento);

    if (selectedDepartamento === 'Todos' || depNorm === targetDepNorm) {
      const cantidad = casosPorDep[depNorm] || 0;
      layer.bindPopup(`<strong>${name}</strong><br/>COVID-19 - Casos: <strong>${Math.round(cantidad)}</strong>`);

      if (selectedDepartamento !== 'Todos' && depNorm === targetDepNorm) {
        setLastZoomBounds(layer.getBounds());
      }
    }
  };

  const onEachProv = (feature, layer) => {
    const name = feature.properties.NOMBPROV || feature.properties.PROVINCIA || 'Provincia';
    const provNorm = normalize(name);
    const cantidad = casosPorProv[provNorm] || 0;
    layer.bindPopup(`<strong>Provincia: ${name}</strong><br/>Casos estimados: <strong>${Math.round(cantidad)}</strong>`);
  };

  return (
    <div style={{ height: 'calc(100vh - 180px)', width: '100%', borderRadius: '12px', overflow: 'hidden' }} className="map-view-container shadow-sm border border-2 border-white bg-light">
      <MapContainer
        center={[-9.19, -75.0152]}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        scrollWheelZoom={true}
        key={selectedDepartamento + tipoReporte + JSON.stringify(casosPorDep)}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {geoData && (
          <GeoJSON
            key={"dep-" + selectedDepartamento}
            data={geoData}
            style={depStyle}
            onEachFeature={onEachDep}
          />
        )}

        {selectedDepartamento !== 'Todos' && provGeoData && (
          <GeoJSON
            key={"prov-" + selectedDepartamento}
            data={provGeoData}
            style={provStyle}
            onEachFeature={onEachProv}
          />
        )}



        {/* Puntos georreferenciados únicos por ubicación (Estilo profesional: pequeños con borde de contraste) */}
        {(() => {
          const uniqueLocations = {};
          // Ordenamos para que el punto que quede sea el más reciente
          [...reportes].sort((a, b) => new Date(b.fecha_reporte) - new Date(a.fecha_reporte)).forEach(r => {
            const key = `${r.departamento}-${r.provincia}-${r.distrito}`;
            if (!uniqueLocations[key]) uniqueLocations[key] = r;
          });

          return Object.values(uniqueLocations).map((report) => (
            <CircleMarker
              key={report.id_reporte}
              center={[report.latitud, report.longitud]}
              radius={4}
              pathOptions={{
                fillColor: report.tipo_reporte === 'Confirmado' ? '#ef4444' : report.tipo_reporte === 'Sospechoso' ? '#ffaa00' : '#3b82f6',
                color: '#1f2937', // Borde oscuro para que resalte como en la imagen de referencia
                weight: 2,
                fillOpacity: 1
              }}
            >
              <Popup>
                <div style={{ fontSize: '0.8rem', minWidth: '160px' }}>
                  <div className="fw-bold border-bottom pb-1 mb-2 text-uppercase" style={{ color: '#1A56DB', letterSpacing: '0.5px' }}>
                    {report.distrito}
                  </div>
                  <div className="mb-1"><strong>ID:</strong> <span className="text-secondary">#{report.id_reporte}</span></div>
                  <div className="mb-1"><strong>Tipo:</strong> <span className="badge bg-primary-subtle text-primary border-primary-subtle" style={{ fontSize: '0.65rem' }}>{report.tipo_reporte}</span></div>
                  <div className="mb-1"><strong>Estado:</strong> {report.estado_caso}</div>
                  <div className="mb-1"><strong>Fuente:</strong> {report.fuente_dato}</div>
                  <div className="mt-2 pt-1 border-top" style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                    <i className="bi bi-calendar3 me-1"></i>
                    {new Date(report.fecha_reporte).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ));
        })()}

        <ZoomHandler bounds={lastZoomBounds} />
      </MapContainer>

      {/* Map Legend */}
      <div className="map-legend-glass">
        <h6 className="legend-title">Rangos de Casos</h6>
        <div className="legend-items">
          {obtenerLeyenda().map((item, index) => (
            <div key={index} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: item.color }}></span>
              <span className="legend-label">{item.rango}</span>
              <span className="legend-status">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;
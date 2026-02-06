import React, { useState } from 'react';

const Filters = ({ filters, onFilterChange, onLayerChange, ubigeo }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const departamentos = Object.keys(ubigeo);
  const provincias = filters.departamento !== 'Todos' ? Object.keys(ubigeo[filters.departamento]) : [];
  const distritos =
    filters.departamento !== 'Todos' && filters.provincia !== 'Todos'
      ? ubigeo[filters.departamento][filters.provincia]
      : [];

  const handleRangoChange = (val) => {
    if (val === 'custom') {
      setShowDatePicker(!showDatePicker);
    } else {
      setShowDatePicker(false);
      onFilterChange('rango', val);
    }
  };

  return (
    <div className="bg-white border-bottom px-3 px-md-4 py-2 d-flex align-items-center gap-3 gap-md-4 flex-wrap position-relative shadow-sm" style={{ zIndex: 1001 }}>
      {/* Rango de Fechas */}
      <div className="d-flex flex-column position-relative">
        <label className="text-muted fw-bold mb-1" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <i className="bi bi-calendar3 me-1"></i> Temporalidad
        </label>
        <div className="d-flex align-items-center gap-2">
          <div className="btn-group border rounded-2 p-1 bg-light shadow-sm" style={{ width: 'fit-content' }}>
            {['24h', '7d', 'Mes', 'Personalizar'].map((label) => {
              const val = label === '24h' ? '24h' : label === '7d' ? '7d' : label.includes('Mes') ? '30d' : 'custom';
              const isActive = filters.rango === val || (val === '30d' && filters.rango === 'Todos');

              return (
                <button
                  key={label}
                  className={`btn btn-sm border-0 ${isActive ? 'btn-primary shadow-sm' : 'text-secondary'}`}
                  style={{ fontSize: '0.65rem', borderRadius: '6px', padding: '0.25rem 0.5rem', fontWeight: isActive ? '600' : '400' }}
                  onClick={() => handleRangoChange(val)}
                >
                  {label === '24h' ? '24h' : label === '7d' ? '7d' : label}
                </button>
              );
            })}
          </div>

          {showDatePicker && (
            <div className="position-absolute top-100 start-0 mt-2 d-flex align-items-center gap-2 animate__animated animate__fadeIn border p-2 rounded-3 bg-white shadow-lg" style={{ zIndex: 2000, width: 'max-content' }}>
              <input type="date" className="form-control form-control-sm border" style={{ fontSize: '0.75rem', width: '130px' }} />
              <span className="text-muted" style={{ fontSize: '0.75rem' }}>a</span>
              <input type="date" className="form-control form-control-sm border" style={{ fontSize: '0.75rem', width: '130px' }} />
              <button className="btn btn-primary btn-sm px-3" style={{ fontSize: '0.7rem', borderRadius: '6px' }} onClick={() => setShowDatePicker(false)}>Aplicar</button>
            </div>
          )}
        </div>
      </div>

      <div className="vr d-none d-lg-block my-2 opacity-10"></div>

      {/* Ubicacion */}
      <div className="d-flex flex-column flex-grow-1 flex-md-grow-0">
        <label className="text-muted fw-bold mb-1" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <i className="bi bi-geo-alt me-1"></i> Ubicación
        </label>
        <div className="d-flex gap-2 flex-wrap flex-md-nowrap">
          <select
            className="form-select form-select-sm border shadow-sm"
            style={{ minWidth: '160px', width: 'auto', fontSize: '0.75rem', borderRadius: '8px' }}
            value={filters.departamento}
            onChange={(e) => onFilterChange('departamento', e.target.value)}
          >
            <option value="Todos">Deptos</option>
            {departamentos.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </select>
          <select
            className="form-select form-select-sm border shadow-sm"
            style={{ width: '120px', fontSize: '0.75rem', borderRadius: '8px' }}
            value={filters.provincia}
            onChange={(e) => onFilterChange('provincia', e.target.value)}
            disabled={filters.departamento === 'Todos'}
          >
            <option value="Todos">Provincia</option>
            {provincias.map(prov => <option key={prov} value={prov}>{prov}</option>)}
          </select>
          <select
            className="form-select form-select-sm border shadow-sm"
            style={{ width: '120px', fontSize: '0.75rem', borderRadius: '8px' }}
            value={filters.distrito}
            onChange={(e) => onFilterChange('distrito', e.target.value)}
            disabled={filters.provincia === 'Todos'}
          >
            <option value="Todos">Distrito</option>
            {distritos.map(dist => <option key={dist} value={dist}>{dist}</option>)}
          </select>
        </div>
      </div>

      <div className="vr d-none d-xl-block my-2 opacity-10"></div>

      {/* Capas del Mapa */}
      <div className="d-flex flex-column">
        <label className="text-muted fw-bold mb-1" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fuentes de Información</label>
        <div className="d-flex gap-2 gap-md-3 align-items-center flex-wrap">
          <div className="form-check form-switch d-flex align-items-center gap-2 mb-0">
            <input className="form-check-input mt-0" type="checkbox" id="sw1" checked={filters.sivapre} onChange={(e) => onLayerChange('sivapre', e.target.checked)} style={{ width: '2rem', height: '1rem' }} />
            <label className="form-check-label text-dark fw-semibold" htmlFor="sw1" style={{ fontSize: '0.65rem' }}>CIVIL</label>
          </div>
          <div className="form-check form-switch d-flex align-items-center gap-2 mb-0">
            <input className="form-check-input mt-0" type="checkbox" id="sw2" checked={filters.noti} onChange={(e) => onLayerChange('noti', e.target.checked)} style={{ width: '2rem', height: '1rem' }} />
            <label className="form-check-label text-dark fw-semibold" htmlFor="sw2" style={{ fontSize: '0.65rem' }}>NOTI</label>
          </div>
          <div className="form-check form-switch d-flex align-items-center gap-2 mb-0">
            <input className="form-check-input mt-0" type="checkbox" id="sw3" checked={filters.netlab} onChange={(e) => onLayerChange('netlab', e.target.checked)} style={{ width: '2rem', height: '1rem' }} />
            <label className="form-check-label text-dark fw-semibold" htmlFor="sw3" style={{ fontSize: '0.65rem' }}>NETLAB</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
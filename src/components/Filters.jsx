import React from 'react';

const Filters = ({ filters, onFilterChange, onLayerChange, ubigeo }) => {
  const departamentos = Object.keys(ubigeo);
  const provincias = filters.departamento !== 'Todos' ? Object.keys(ubigeo[filters.departamento]) : [];
  const distritos =
    filters.departamento !== 'Todos' && filters.provincia !== 'Todos'
      ? ubigeo[filters.departamento][filters.provincia]
      : [];

  return (
    <div className="card filters-card border-0">
      {/* Primera fila: Rango de Fechas + Ubicación */}
      <div className="d-flex flex-wrap align-items-center gap-3">
        
        {/* Date Range Selector */}
        <div className="filter-group">
          <label className="filter-label">📅 Rango de Fechas:</label>
          <div className="btn-group btn-group-sm" role="group">
            <button 
              type="button" 
              className={`btn ${filters.rango === '24h' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => onFilterChange('rango', '24h')}
            >
              Últimas 24h
            </button>
            <button 
              type="button" 
              className={`btn ${filters.rango === '7d' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => onFilterChange('rango', '7d')}
            >
              Últimos 7 días
            </button>
            <button 
              type="button" 
              className={`btn ${filters.rango === '30d' || filters.rango === 'Todos' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => onFilterChange('rango', '30d')}
            >
              Último mes
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={() => alert('Función de rango personalizado disponible próximamente')}>Personalizar</button>
          </div>
        </div>

        {/* Location Filters */}
        <div className="filter-group">
          <label className="filter-label">📍 Ubicación (UBIGEO):</label>
          <select
            className="form-select form-select-sm"
            style={{ width: '150px' }}
            value={filters.departamento}
            onChange={(e) => onFilterChange('departamento', e.target.value)}
          >
            <option value="Todos">Departamento</option>
            {departamentos.map(dep => <option key={dep} value={dep}>{dep}</option>)}
          </select>
          <select
            className="form-select form-select-sm"
            style={{ width: '150px' }}
            value={filters.provincia}
            onChange={(e) => onFilterChange('provincia', e.target.value)}
            disabled={filters.departamento === 'Todos'}
          >
            <option value="Todos">Provincia</option>
            {provincias.map(prov => <option key={prov} value={prov}>{prov}</option>)}
          </select>
          <select
            className="form-select form-select-sm"
            style={{ width: '150px' }}
            value={filters.distrito}
            onChange={(e) => onFilterChange('distrito', e.target.value)}
            disabled={filters.provincia === 'Todos'}
          >
            <option value="Todos">Distrito</option>
            {distritos.map(dist => <option key={dist} value={dist}>{dist}</option>)}
          </select>
        </div>

      </div>

      {/* Segunda fila: Capas del Mapa */}
      <div className="d-flex flex-wrap align-items-center gap-3">
        {/* Map Layer Switches */}
        <div className="filter-group map-layers">
          <label className="filter-label">Capas del Mapa:</label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="sivapreSwitch"
              checked={filters.sivapre}
              onChange={(e) => onLayerChange('sivapre', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="sivapreSwitch">SIVAPRE Criaderos</label>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="notiSwitch"
              checked={filters.noti}
              onChange={(e) => onLayerChange('noti', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="notiSwitch">NOTI Sospechosos/Probables</label>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="netlabSwitch"
              checked={filters.netlab}
              onChange={(e) => onLayerChange('netlab', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="netlabSwitch">NETLAB Confirmados</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
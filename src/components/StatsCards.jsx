import React from 'react';
import PropTypes from 'prop-types';

const StatCard = ({ iconClass, title, value, description, dataSource, growth }) => {
  const growthBgClass = growth >= 0 ? 'bg-success' : 'bg-danger';

  return (
    <div style={{flex: 1, minWidth: 0}}>
      <div className="card stat-card">
        <div className="card-body d-flex align-items-center" style={{padding: '1rem'}}>
          <div style={{display: 'flex', alignItems: 'center', marginRight: '1rem'}}>
            <div className="stat-icon-badge" style={{width: '64px', height: '64px', borderRadius: '8px'}}>
              <i className={`${iconClass}`}></i>
            </div>
          </div>

          <div style={{flex: 1, minWidth: 0}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <div>
                <h2 style={{margin: 0, fontSize: '2.8rem', fontWeight: 700, lineHeight: 1, color: '#000'}}>{value}</h2>
                <h6 className="text-muted text-uppercase" style={{margin: 0, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.6px'}}>{title}</h6>
              </div>
              {growth !== undefined && (
                <span className={`badge ${growthBgClass} text-white`} style={{fontSize: '0.75rem', padding: '0.35rem 0.5rem'}}>
                  {growth > 0 ? '+' : ''}{Math.abs(growth).toFixed(1)}%
                </span>
              )}
            </div>

            <p className="text-muted" style={{margin: '0.5rem 0 0', fontSize: '0.85rem'}}>{description}</p>
            <small className="text-muted" style={{fontSize: '0.75rem'}}>Fuente: {dataSource}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  iconClass: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string.isRequired,
  dataSource: PropTypes.string.isRequired,
  growth: PropTypes.number,
};

const StatsCards = ({ data = [] }) => {
  // Conteos adaptados a COVID-19
  const reportesCiudadanos = data.filter(d => (d.fuente_dato || '').toLowerCase().includes('reporte') || (d.fuente_dato || '').toLowerCase() === 'sivapre').length;
  const pruebasNetlab = data.filter(d => (d.fuente_dato || '').toLowerCase() === 'netlab').length;
  const casosSospechosos = data.filter(d => (d.tipo_reporte || '').toLowerCase() === 'sospechoso' || (d.tipo_reporte || '').toLowerCase() === 'probable' || (d.fuente_dato || '').toLowerCase() === 'noti').length;
  const casosConfirmados = data.filter(d => (d.tipo_reporte || '').toLowerCase() === 'confirmado' || (d.fuente_dato || '').toLowerCase() === 'netlab').length;

  const growthCiudadanos = 12.5;
  const growthLarvas = -5.2;
  const growthSospechosos = 8.1;
  const growthConfirmados = 15.0;

  return (
    <div className="stats-grid">
      <div>
        <StatCard
          iconClass="bi bi-people-fill"
          title="Notificaciones Ciudadanas"
          value={reportesCiudadanos}
          description="Notificaciones enviadas por la comunidad"
          dataSource="App / Formularios"
          growth={growthCiudadanos}
        />
      </div>
      <div>
        <StatCard
          iconClass="bi bi-file-medical"
          title="Pruebas NETLAB"
          value={pruebasNetlab}
          description="Casos con resultado de laboratorio"
          dataSource="NETLAB"
          growth={growthLarvas}
        />
      </div>
      <div>
        <StatCard
          iconClass="bi bi-exclamation-triangle-fill"
          title="Casos Sospechosos"
          value={casosSospechosos}
          description="Casos reportados como sospechosos/probables"
          dataSource="NOTI / Reportes"
          growth={growthSospechosos}
        />
      </div>
      <div>
        <StatCard
          iconClass="bi bi-check-circle-fill"
          title="Casos Confirmados"
          value={casosConfirmados}
          description="Casos confirmados por laboratorio"
          dataSource="NETLAB"
          growth={growthConfirmados}
        />
      </div>
    </div>
  );
};

StatsCards.propTypes = {
  data: PropTypes.array,
};

export default StatsCards;
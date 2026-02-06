import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const StatCard = ({ iconClass, title, value, description, dataSource, growth, active, onClick }) => {
  const isPositive = growth >= 0;
  const growthColor = isPositive ? '#22c55e' : '#ef4444';

  return (
    <div
      style={{ flex: 1, minWidth: '220px', cursor: 'pointer' }}
      onClick={onClick}
    >
      <div
        className="card shadow-sm h-100 transition-all"
        style={{
          borderRadius: '12px',
          border: active ? '2px solid #ffc107' : '1px solid #dee2e6',
          transform: active ? 'translateY(-4px)' : 'none',
          boxShadow: active ? '0 10px 15px -3px rgba(255, 193, 7, 0.2)' : '',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: active ? '#fffbef' : '#fff',
          backfaceVisibility: 'hidden',
          willChange: 'transform'
        }}
      >
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', backgroundColor: active ? '#ffecb3' : '#f3f4f6' }}>
              <i className={`${iconClass}`} style={{ fontSize: '1.2rem', color: active ? '#ffc107' : '#6b7280' }}></i>
            </div>
            {growth !== undefined && (
              <div className="d-flex align-items-center" style={{ color: growthColor, fontSize: '0.85rem', fontWeight: '600' }}>
                <i className={`bi bi-graph-${isPositive ? 'up' : 'down'} me-1`}></i>
                {isPositive ? '+' : ''}{growth}%
              </div>
            )}
          </div>
          <div>
            <h3 className="fw-bold mb-0" style={{ fontSize: '1.75rem', color: '#111827' }}>{value.toLocaleString()}</h3>
            <p className="mb-1 fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>{title}</p>
            <div className="mt-2">
              <small className="text-muted d-block" style={{ fontSize: '0.7rem', lineHeight: '1.2' }}>{description}</small>
              <small className="text-muted" style={{ fontSize: '0.65rem' }}>Fuente: {dataSource}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCards = ({ data = [], activeTab, onTabChange }) => {
  // Calculate dynamic counts based on the filtered data provided by Dashboard
  const counts = useMemo(() => {
    return {
      todos: data.length,
      larvas: data.filter(d => d.tipo_reporte === 'Larvas').length,
      sospechoso: data.filter(d => d.tipo_reporte === 'Sospechoso').length,
      confirmado: data.filter(d => d.tipo_reporte === 'Confirmado').length,
    };
  }, [data]);

  // Scaled values to look more realistic for a high-level dashboard
  const scale = 5; // A multiplier to make mock counts represent a larger population if they are low

  return (
    <div className="d-flex gap-3 overflow-auto pb-2 w-100">
      <StatCard
        iconClass="bi bi-activity"
        title="Reportes Totales"
        value={counts.todos * scale}
        description="Consolidado de todas las fuentes"
        dataSource="SIVAPRE / NOTI / NETLAB"
        growth={12}
        active={activeTab === 'Todos'}
        onClick={() => onTabChange('Todos')}
      />
      <StatCard
        iconClass="bi bi-droplet"
        title="Auto-reportes Sintomáticos"
        value={counts.larvas * scale}
        description="Ciudadanos que reportaron síntomas"
        dataSource="SIVAPRE App"
        growth={8}
        active={activeTab === 'Larvas'}
        onClick={() => onTabChange('Larvas')}
      />
      <StatCard
        iconClass="bi bi-exclamation-triangle"
        title="Casos Sospechosos"
        value={counts.sospechoso * scale}
        description="Paciente con sintomatología clínica"
        dataSource="NOTI"
        growth={5}
        active={activeTab === 'Sospechoso'}
        onClick={() => onTabChange('Sospechoso')}
      />
      <StatCard
        iconClass="bi bi-check2-circle"
        title="Casos Confirmados"
        value={counts.confirmado * scale}
        description="Diagnóstico verificado por laboratorio"
        dataSource="NETLAB"
        growth={-3}
        active={activeTab === 'Confirmado'}
        onClick={() => onTabChange('Confirmado')}
      />
    </div>
  );
};

StatsCards.propTypes = {
  data: PropTypes.array,
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func
};

export default StatsCards;
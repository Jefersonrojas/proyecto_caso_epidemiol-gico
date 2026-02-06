import React from 'react';
import WeeklyTrend from './WeeklyTrend';

const SidePanel = ({ data = [] }) => {
  return (
    <div className="card p-4 h-100 border-0 d-flex flex-column">
      <h5 className="mb-1 fw-bold" style={{fontSize: '1rem'}}>Nuevos Reportes SIVAPRE</h5>
      <p className="text-muted mb-3" style={{fontSize: '0.8rem'}}>Actualización en tiempo real</p>
      <div className="list-group list-group-flush overflow-auto" style={{ maxHeight: 'calc(50% - 60px)', marginBottom: '15px' }}>
        {data.length > 0 ? (
          data.map((report) => (
            <div key={report.id_reporte} className="list-group-item list-group-item-action flex-column align-items-start mb-3 rounded card border-0 shadow-sm">
              <div className="d-flex w-100 justify-content-between mb-2 align-items-center">
                <h6 className="mb-0 fw-bold text-dark">{report.distrito}</h6>
                <span className="badge bg-warning text-dark" style={{fontSize: '0.7rem'}}>Nuevo</span>
              </div>
              <p className="text-muted mb-2" style={{fontSize: '0.8rem'}}>📍 {report.provincia}</p>
              <div className="d-flex align-items-center my-2">
                {/* Placeholder Image/Icon */}
                <img
                  src="https://placehold.co/60x60/png?text=FOTO"
                  alt="Evidencia"
                  className="rounded me-3"
                  style={{ width: '60px', height: '60px', objectFit: 'cover', minWidth: '60px' }}
                />
                <div className="flex-grow-1">
                  <p className="mb-1 text-dark fw-500">{report.departamento}</p>
                  <small className={`badge ${report.estado_caso === 'Confirmado' ? 'bg-danger' : report.estado_caso === 'Sospechoso' ? 'bg-warning text-dark' : 'bg-info'} text-white mb-1`}>
                    Larvas detectadas
                  </small>
                </div>
              </div>
              <p className="text-muted mb-2" style={{fontSize: '0.75rem'}}>📅 2024-01-15 14:32</p>
              <button className="btn btn-sm btn-primary w-100 mt-2" style={{fontSize: '0.85rem'}}>
                Ver Detalles y Asignar Brigada →
              </button>
            </div>
          ))
        ) : (
          <p className="text-muted text-center mt-3">No hay nuevos reportes.</p>
        )}
      </div>
      
      {/* Gráfico de tendencia semanal */}
      <div style={{ flex: 1, minHeight: '0', display: 'flex', flexDirection: 'column' }}>
        <WeeklyTrend reportes={data} />
      </div>
    </div>
  );
};

export default SidePanel;
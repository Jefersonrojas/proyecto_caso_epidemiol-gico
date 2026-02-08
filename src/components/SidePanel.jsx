import React, { useMemo, useState, useRef } from 'react';
import WeeklyTrend from './WeeklyTrend';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const SidePanel = ({ data = [], activeTab = 'Todos' }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const modalContentRef = useRef(null);


  const reports = useMemo(() => {
    let filtered = data;
    if (activeTab !== 'Todos') {
      filtered = data.filter(r => r.tipo_reporte === activeTab);
    }

    return filtered.slice(-10).reverse();
  }, [data, activeTab]);


  const getTag = (type) => {
    if (type === 'Sintomático') return 'Auto-reporte';
    if (type === 'Sospechoso') return 'Caso Sospechoso';
    if (type === 'Confirmado') return 'Caso Confirmado';
    return 'Reporte';
  };


  const getSeverityColor = (type) => {
    if (type === 'Confirmado') return 'bg-danger';
    if (type === 'Sospechoso') return 'bg-warning text-dark';
    return 'bg-primary';
  };


  const handleDownloadPDF = async () => {
    if (!modalContentRef.current || !selectedReport) return;

    setIsExporting(true);
    try {
      const element = modalContentRef.current;


      const originalStyle = element.style.cssText;
      element.style.borderRadius = '0';

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8f9fa'
      });

      element.style.cssText = originalStyle;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);

      const fileName = `Ficha_Epidemiologica_${selectedReport.distrito}_${Date.now()}.pdf`;
      pdf.save(fileName);

    } catch (err) {
      console.error('Error al generar PDF:', err);
      alert('Hubo un error al generar el PDF. Por favor intente de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm d-flex flex-column" style={{ borderRadius: '12px', background: '#ffffff', backfaceVisibility: 'hidden' }}>
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0 fw-bold" style={{ fontSize: '1.05rem', color: '#111827' }}>Fichas Recientes</h5>
          <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>Vista: {activeTab}</p>
        </div>
        <div className="badge bg-primary rounded-pill px-2 py-1" style={{ fontSize: '0.65rem' }}>{reports.length} reportes</div>
      </div>

      <div className="flex-grow-1 overflow-auto p-3" style={{ maxHeight: '500px' }}>
        {reports.length > 0 ? (
          reports.map((report, idx) => (
            <div
              key={idx}
              className="card mb-3 border-0 shadow-sm animate__animated animate__fadeInUp"
              style={{
                borderRadius: '12px',
                background: '#f9fafb',
                animationDelay: `${idx * 0.05}s`,
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="card-body p-2">
                <div className="d-flex gap-3">
                  <div className="position-relative">
                    <div
                      className="rounded-3 shadow-sm d-flex align-items-center justify-content-center bg-white border"
                      style={{ width: '80px', height: '80px' }}
                    >
                      <i className={`bi ${report.tipo_reporte === 'Confirmado' ? 'bi-bug-fill text-danger' : 'bi-person-badge text-primary'}`} style={{ fontSize: '2rem' }}></i>
                    </div>
                    <span className={`position-absolute top-0 start-0 badge rounded-pill m-1 ${getSeverityColor(report.tipo_reporte)}`} style={{ fontSize: '0.55rem' }}>
                      {report.tipo_reporte}
                    </span>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center gap-1">
                        <i className="bi bi-geo-alt-fill text-primary" style={{ fontSize: '0.75rem' }}></i>
                        <h6 className="mb-0 fw-bold" style={{ fontSize: '0.85rem' }}>{report.distrito || 'Distrito'}</h6>
                      </div>
                      <span className="badge" style={{ fontSize: '0.55rem', backgroundColor: '#e0f2fe', color: '#0369a1' }}>NUEVO</span>
                    </div>
                    <p className="text-muted mb-1 fw-medium" style={{ fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }}>
                      {report.provincia}, {report.departamento}
                    </p>
                    <div className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: '0.65rem' }}>
                      <i className="bi bi-clock text-muted"></i>
                      <span className="text-muted">{report.fecha_reporte}</span>
                    </div>
                    <div className="d-flex flex-wrap gap-1">
                      <span className="badge border text-dark d-flex align-items-center gap-1" style={{ fontSize: '0.6rem', borderColor: '#e5e7eb', backgroundColor: '#fff' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: report.tipo_reporte === 'Confirmado' ? '#ef4444' : '#3b82f6' }}></div>
                        {getTag(report.tipo_reporte)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-primary w-100 mt-2 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                  style={{ fontSize: '0.75rem', borderRadius: '8px', padding: '0.4rem', fontWeight: '600' }}
                  onClick={() => setSelectedReport(report)}
                >
                  Ver ficha completa
                  <i className="bi bi-arrow-right-short" style={{ fontSize: '1rem' }}></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-info-circle text-muted" style={{ fontSize: '2rem' }}></i>
            <p className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>No se encontraron reportes con los filtros seleccionados.</p>
          </div>
        )}
      </div>

      <div className="p-3 border-top bg-white" style={{ minHeight: '220px', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
        <WeeklyTrend reportes={data} />
      </div>

      {/* MODAL PARA FICHA COMPLETA */}
      {selectedReport && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate__animated animate__fadeIn"
          style={{ zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="animate__animated animate__zoomIn bg-white rounded-4 shadow-lg overflow-hidden"
            style={{ width: '100%', maxWidth: '500px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Convertir en PDF */}
            <div ref={modalContentRef} className="bg-light">
              {/* Modal Header */}
              <div className={`p-4 text-white d-flex flex-column gap-2 ${selectedReport.tipo_reporte === 'Confirmado' ? 'bg-danger' : selectedReport.tipo_reporte === 'Sospechoso' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="badge bg-white text-dark rounded-pill px-3 py-1" style={{ fontSize: '0.7rem' }}>
                    ID: #{Math.floor(Math.random() * 90000) + 10000}
                  </span>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedReport(null)}
                    aria-label="Cerrar"
                  ></button>
                </div>
                <h4 className="mb-0 fw-bold">{getTag(selectedReport.tipo_reporte).toUpperCase()}</h4>
                <div className="d-flex align-items-center gap-2 opacity-75" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-calendar3"></i>
                  <span>Reportado el {selectedReport.fecha_reporte}</span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-4">
                <div className="card border-0 shadow-sm rounded-3 mb-4 overflow-hidden" style={{ background: '#fff' }}>
                  <div className="card-body p-0">
                    <div className="p-3 border-bottom d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-primary-subtle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-geo-alt-fill text-primary"></i>
                      </div>
                      <div>
                        <small className="text-muted d-block" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Ubicación exacta</small>
                        <span className="fw-bold text-dark">{selectedReport.distrito}, {selectedReport.provincia}</span>
                      </div>
                    </div>
                    <div className="p-3 d-flex align-items-center gap-3">
                      <div className="rounded-circle bg-info-subtle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-person-fill text-info"></i>
                      </div>
                      <div>
                        <small className="text-muted d-block" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Información del paciente</small>
                        <span className="fw-bold text-dark">Paciente Anónimo (Protección de Datos)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-6">
                    <div className="p-3 bg-white rounded-3 border shadow-sm h-100 text-center">
                      <small className="text-muted d-block mb-1" style={{ fontSize: '0.6rem' }}>FUENTE DEL DATO</small>
                      <span className="fw-bold text-primary" style={{ fontSize: '0.85rem' }}>
                        {selectedReport.tipo_reporte === 'Sintomático' ? 'SIVAPRE App' : selectedReport.tipo_reporte === 'Sospechoso' ? 'Sistema NOTI' : 'NETLAB'}
                      </span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-white rounded-3 border shadow-sm h-100 text-center">
                      <small className="text-muted d-block mb-1" style={{ fontSize: '0.6rem' }}>ESTADO DE FICHA</small>
                      <span className="badge bg-success" style={{ fontSize: '0.75rem' }}>Activo</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-3 bg-warning-subtle border border-warning">
                  <div className="d-flex gap-2">
                    <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                    <div>
                      <h6 className="mb-1 fw-bold" style={{ fontSize: '0.8rem' }}>Acción Recomendada</h6>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                        {selectedReport.tipo_reporte === 'Confirmado'
                          ? 'Cerco epidemiológico inmediato y seguimiento de contactos estrechos.'
                          : 'Telemonitoreo diario y brigada de respuesta rápida para triaje.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center mt-auto pt-3 border-top d-none d-print-block">
                  <p className="text-muted small">Generado por Dashboard Epidemiológico Interactivo - {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer (No sale en el PDF) */}
            <div className="p-4 border-top bg-white d-flex gap-2">
              <button
                className="btn btn-outline-secondary flex-grow-1 py-2 fw-bold"
                style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                onClick={() => setSelectedReport(null)}
              >
                Cerrar
              </button>
              <button
                className={`btn btn-primary flex-grow-1 py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2`}
                style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                onClick={handleDownloadPDF}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Capturando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-file-earmark-pdf"></i>
                    Descargar PDF Real
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidePanel;
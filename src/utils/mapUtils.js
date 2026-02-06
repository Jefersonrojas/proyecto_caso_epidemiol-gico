export function contarCasosPorDepartamento(reportes, tipoSeleccionado, activeLayers = { sivapre: true, noti: true, netlab: true }) {
  const conteo = {};

  reportes.forEach(r => {
    const dep = (r.departamento || '').toUpperCase();
    if (!dep) return;

    // Sincronizar con los filtros de la interfaz
    if (tipoSeleccionado && tipoSeleccionado !== 'Todos' && r.tipo_reporte !== tipoSeleccionado) return;

    // Filtrado por capas de fuente de dato
    if (r.fuente_dato === 'SIVAPRE' && !activeLayers.sivapre) return;
    if (r.fuente_dato === 'NOTI' && !activeLayers.noti) return;
    if (r.fuente_dato === 'NETLAB' && !activeLayers.netlab) return;

    conteo[dep] = (conteo[dep] || 0) + 1;
  });

  return conteo;
}

export function obtenerCasosPorProvincia(departamento, reportes, tipoSeleccionado, activeLayers) {
  if (departamento === 'Todos') return {};
  const depUpper = departamento.toUpperCase();
  const provCounts = {};

  reportes.forEach(r => {
    if ((r.departamento || '').toUpperCase() === depUpper) {
      const prov = (r.provincia || '').toUpperCase();
      if (!prov) return;

      if (tipoSeleccionado && tipoSeleccionado !== 'Todos' && r.tipo_reporte !== tipoSeleccionado) return;
      if (r.fuente_dato === 'SIVAPRE' && !activeLayers.sivapre) return;
      if (r.fuente_dato === 'NOTI' && !activeLayers.noti) return;
      if (r.fuente_dato === 'NETLAB' && !activeLayers.netlab) return;

      provCounts[prov] = (provCounts[prov] || 0) + 1;
    }
  });
  return provCounts;
}

export function obtenerColor(tipo, cantidad) {
  if (!cantidad || cantidad === 0) return '#F3F4F6';
  // Rangos de la imagen de referencia (aplicados a datos reales del JSON)
  if (cantidad <= 56) return '#ffff00';
  if (cantidad <= 83) return '#ffee00';
  if (cantidad <= 123) return '#ffcc00';
  if (cantidad <= 144) return '#ffaa00';
  if (cantidad <= 185) return '#ff7700';
  if (cantidad <= 190) return '#ff4400';
  if (cantidad <= 761) return '#ee0000';
  return '#aa0000';
}

export function obtenerLeyenda() {
  return [
    { rango: 'Hasta 56.0', color: '#ffff00', label: 'Bajo' },
    { rango: '56.0 - 83.0', color: '#ffee00', label: 'Moderado' },
    { rango: '83.0 - 123.0', color: '#ffcc00', label: 'Alto' },
    { rango: '123.0 - 144.0', color: '#ffaa00', label: 'Muy Alto' },
    { rango: '144.0 - 185.0', color: '#ff7700', label: 'Crítico' },
    { rango: '185.0 - 190.0', color: '#ff4400', label: 'Extremo' },
    { rango: '190.0 - 761.0', color: '#ee0000', label: 'Alerta' },
    { rango: 'Más de 761', color: '#aa0000', label: 'Emergencia' },
  ];
}

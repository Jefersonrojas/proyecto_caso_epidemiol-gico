export function contarCasosPorDepartamento(reportes, tipoSeleccionado) {
  const conteo = {};

  reportes.forEach(r => {
    if (!tipoSeleccionado || tipoSeleccionado === 'Todos' || r.tipo_reporte === tipoSeleccionado) {
      const dep = (r.departamento || '').toUpperCase();
      if (!dep) return;
      conteo[dep] = (conteo[dep] || 0) + 1;
    }
  });

  return conteo;
}

export function obtenerColor(tipo, cantidad) {
  if (!cantidad || cantidad === 0) return '#F3F4F6'; // gris claro cuando no hay datos

  // Rangos pensados para COVID-19 a nivel departamental
  if (cantidad <= 1000) return '#FFEB3B';       // muy bajo
  if (cantidad <= 5000) return '#FFB74D';       // bajo
  if (cantidad <= 10000) return '#FB8C00';      // moderado
  if (cantidad <= 20000) return '#F4511E';      // alto
  if (cantidad <= 50000) return '#D32F2F';      // muy alto
  if (cantidad <= 100000) return '#B71C1C';     // crítico
  return '#7F0000';                             // extremadamente crítico
}

export function obtenerLeyenda() {
  return [
    { rango: '0 - 1,000', color: '#FFEB3B', label: 'Muy bajo' },
    { rango: '1,001 - 5,000', color: '#FFB74D', label: 'Bajo' },
    { rango: '5,001 - 10,000', color: '#FB8C00', label: 'Moderado' },
    { rango: '10,001 - 20,000', color: '#F4511E', label: 'Alto' },
    { rango: '20,001 - 50,000', color: '#D32F2F', label: 'Muy alto' },
    { rango: '50,001 - 100,000', color: '#B71C1C', label: 'Crítico' },
    { rango: '> 100,000', color: '#7F0000', label: 'Extremadamente crítico' },
  ];
}

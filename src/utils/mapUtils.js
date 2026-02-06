export function contarCasosPorDepartamento(reportes, tipoSeleccionado, activeLayers = { sivapre: true, noti: true, netlab: true }) {
  const conteo = {};

  // Base mock counts per type
  const baseCounts = {
    'LORETO': { 'Larvas': 300, 'Sospechoso': 400, 'Confirmado': 250 },
    'LIMA': { 'Larvas': 200, 'Sospechoso': 500, 'Confirmado': 400 },
    'UCAYALI': { 'Larvas': 150, 'Sospechoso': 200, 'Confirmado': 100 },
    'LA LIBERTAD': { 'Larvas': 80, 'Sospechoso': 50, 'Confirmado': 58 },
    'PIURA': { 'Larvas': 40, 'Sospechoso': 60, 'Confirmado': 40 },
    'AREQUIPA': { 'Larvas': 30, 'Sospechoso': 50, 'Confirmado': 40 },
    'CUSCO': { 'Larvas': 20, 'Sospechoso': 40, 'Confirmado': 20 },
    'PUNO': { 'Larvas': 15, 'Sospechoso': 20, 'Confirmado': 10 },
    'MADRE DE DIOS': { 'Larvas': 10, 'Sospechoso': 15, 'Confirmado': 5 },
    'LAMBAYEQUE': { 'Larvas': 5, 'Sospechoso': 5, 'Confirmado': 5 }
  };

  Object.keys(baseCounts).forEach(dep => {
    let sum = 0;
    if (activeLayers.sivapre && (!tipoSeleccionado || tipoSeleccionado === 'Larvas')) {
      sum += baseCounts[dep]['Larvas'];
    }
    if (activeLayers.noti && (!tipoSeleccionado || tipoSeleccionado === 'Sospechoso')) {
      sum += baseCounts[dep]['Sospechoso'];
    }
    if (activeLayers.netlab && (!tipoSeleccionado || tipoSeleccionado === 'Confirmado')) {
      sum += baseCounts[dep]['Confirmado'];
    }

    if (!tipoSeleccionado || tipoSeleccionado === 'Todos') {
      sum = 0;
      if (activeLayers.sivapre) sum += baseCounts[dep]['Larvas'];
      if (activeLayers.noti) sum += baseCounts[dep]['Sospechoso'];
      if (activeLayers.netlab) sum += baseCounts[dep]['Confirmado'];
    }

    conteo[dep] = sum;
  });

  reportes.forEach(r => {
    const dep = (r.departamento || '').toUpperCase();
    if (!dep) return;
    conteo[dep] = (conteo[dep] || 0) + 1;
  });

  return conteo;
}

// Function to get province level data for the selected department
export function obtenerCasosPorProvincia(departamento, reportes, tipoSeleccionado, activeLayers) {
  if (departamento === 'Todos') return {};

  const depUpper = departamento.toUpperCase();
  const provCounts = {};

  // Mock base counts for all provinces if they are in the selected department
  const loretoProvincias = {
    'MAYNAS': 450, 'REQUENA': 120, 'LORETO': 180, 'ALTO AMAZONAS': 90,
    'MARISCAL RAMON CASTILLA': 140, 'UCAYALI': 60, 'DATEM DEL MARAÑON': 70, 'PUTUMAYO': 40
  };

  const limaProvincias = {
    'LIMA': 800, 'HUARAL': 150, 'HUAURA': 130, 'BARRANCA': 110,
    'CAÑETE': 140, 'HUAROCHIRI': 95, 'CANTA': 45, 'YAUYOS': 55, 'OYON': 30, 'CAJATAMBO': 25
  };

  let baseList = {};
  if (depUpper === 'LORETO') baseList = loretoProvincias;
  else if (depUpper === 'LIMA') baseList = limaProvincias;
  else {
    baseList = { 'DEFAULT': 50 };
  }

  Object.keys(baseList).forEach(name => {
    let factor = 1;
    if (tipoSeleccionado === 'Larvas') factor = 0.3;
    else if (tipoSeleccionado === 'Sospechoso') factor = 0.5;
    else if (tipoSeleccionado === 'Confirmado') factor = 0.2;

    provCounts[name] = baseList[name] * factor;
  });

  reportes.forEach(r => {
    if ((r.departamento || '').toUpperCase() === depUpper) {
      const prov = (r.provincia || '').toUpperCase();
      if (prov) {
        provCounts[prov] = (provCounts[prov] || 0) + (provCounts[prov] > 10 ? 1 : 20); // Scale up if it was empty
      }
    }
  });

  return provCounts;
}

export function obtenerColor(tipo, cantidad) {
  if (!cantidad || cantidad === 0) return '#F3F4F6';

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
    { rango: 'Hasta 56.00', color: '#ffff00', label: 'Bajo' },
    { rango: '56.00 - 83.00', color: '#ffee00', label: 'Moderado' },
    { rango: '83.00 - 123.0', color: '#ffcc00', label: 'Alto' },
    { rango: '123.0 - 144.0', color: '#ffaa00', label: 'Muy Alto' },
    { rango: '144.0 - 185.0', color: '#ff7700', label: 'Crítico' },
    { rango: '185.0 - 190.0', color: '#ff4400', label: 'Extremo' },
    { rango: '190.0 - 761.0', color: '#ee0000', label: 'Alerta' },
    { rango: '761.0 - 1100', color: '#aa0000', label: 'Emergencia' },
  ];
}

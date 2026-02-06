import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Filters from '../components/Filters';
import StatsCards from '../components/StatsCards';
import MapView from '../components/MapView';
import SidePanel from '../components/SidePanel';
import { getReportes, getUbigeo } from '../services/dataService';
import peruGeo from '../assets/peru-geo.json';

const Dashboard = () => {
  const [reportes, setReportes] = useState([]);
  const [ubigeo, setUbigeo] = useState({});
  const [filters, setFilters] = useState({
    departamento: 'Todos',
    provincia: 'Todos',
    distrito: 'Todos',
    rango: 'Todos', // Nuevo filtro de tiempo: '24h', '7d', '30d', 'Todos'
    // Layer visibility
    sivapre: true, // SIVAPRE Criaderos
    noti: true,    // NOTI Sospechosos
    netlab: true,  // NETLAB Confirmados
  });
  const [filteredData, setFilteredData] = useState([]);
  const [mapData, setMapData] = useState(peruGeo);

  useEffect(() => {
    const reportesData = getReportes();
    setReportes(reportesData);
    setUbigeo(getUbigeo());
    setFilteredData(reportesData);
  }, []);

  useEffect(() => {
    let data = reportes;

    // Location filtering
    if (filters.departamento !== 'Todos') {
      data = data.filter(d => d.departamento === filters.departamento);
      if (filters.provincia !== 'Todos') {
        data = data.filter(d => d.provincia === filters.provincia);
        if (filters.distrito !== 'Todos') {
          data = data.filter(d => d.distrito === filters.distrito);
        }
      }
    }

    // Time filtering (Lógica para botones de tiempo)
    if (filters.rango !== 'Todos') {
      const now = new Date();
      const reportDate = new Date();
      
      if (filters.rango === '24h') {
        reportDate.setHours(now.getHours() - 24);
      } else if (filters.rango === '7d') {
        reportDate.setDate(now.getDate() - 7);
      } else if (filters.rango === '30d') {
        reportDate.setDate(now.getDate() - 30);
      }

      data = data.filter(d => new Date(d.fecha_reporte) >= reportDate);
    }

    // Layer filtering
    const activeTypes = [];
    if (filters.netlab) activeTypes.push('Confirmado'); // NETLAB
    if (filters.noti) activeTypes.push('Sospechoso');   // NOTI
    if (filters.sivapre) activeTypes.push('Larvas');    // SIVAPRE
    
    // Assuming 'SIVAPRE Criaderos' doesn't have a direct 'tipo_reporte'
    // and we show all for it, or it's a different dataset.
    // For now, we filter by 'Confirmado' and 'Sospechoso'.
    if (activeTypes.length > 0) {
      data = data.filter(d => activeTypes.includes(d.tipo_reporte));
    }

    setFilteredData(data);
  }, [filters, reportes]);

  useEffect(() => {
    const newFeatures = peruGeo.features.map(feature => {
      const depName = feature.properties.NOMBDEP;
      const depData = filteredData.filter(d => d.departamento === depName);
      const caseCount = depData.length;
      
      // Simple risk classification
      let riskLevel = 0; // No/low risk
      if (caseCount > 0 && caseCount <= 1) riskLevel = 1; // Moderate risk
      if (caseCount > 1) riskLevel = 2; // High risk

      return {
        ...feature,
        properties: {
          ...feature.properties,
          caseCount,
          riskLevel,
        },
      };
    });

    setMapData({ ...peruGeo, features: newFeatures });
  }, [filteredData]);


  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };

    // Reset child filters when a parent is changed
    if (filterName === 'departamento') {
      newFilters.provincia = 'Todos';
      newFilters.distrito = 'Todos';
    }
    if (filterName === 'provincia') {
      newFilters.distrito = 'Todos';
    }

    setFilters(newFilters);
  };

  const handleLayerChange = (layerName, isChecked) => {
    setFilters(prev => ({ ...prev, [layerName]: isChecked }));
  };

  return (
    <div className="main-wrapper">
      <Header />
      <main className="main-content">
        <Filters
          filters={filters}
          onFilterChange={handleFilterChange}
          onLayerChange={handleLayerChange}
          ubigeo={ubigeo}
        />
        <div className="content-grid mt-4">
          <div className="stats-container">
            <StatsCards data={filteredData} />
          </div>
          <div className="map-container">
            <MapView data={mapData} reportes={filteredData} tipoReporte="Todos" selectedDepartamento={filters.departamento} />
          </div>
          <div className="side-panel-container">
            <SidePanel data={filteredData} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
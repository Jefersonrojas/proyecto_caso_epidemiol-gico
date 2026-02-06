import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Filters from '../components/Filters';
import StatsCards from '../components/StatsCards';
import MapView from '../components/MapView';
import SidePanel from '../components/SidePanel';
import { getReportes, getUbigeo } from '../services/dataService';
const Dashboard = () => {
  const [reportes, setReportes] = useState([]);
  const [ubigeo, setUbigeo] = useState({});
  const [filters, setFilters] = useState({
    departamento: 'Todos',
    provincia: 'Todos',
    distrito: 'Todos',
    rango: 'Todos',
    sivapre: true,
    noti: true,
    netlab: true,
  });
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState('Todos');

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
      data = data.filter(d => (d.departamento || '').toUpperCase() === (filters.departamento || '').toUpperCase());
      if (filters.provincia !== 'Todos') {
        data = data.filter(d => (d.provincia || '').toUpperCase() === (filters.provincia || '').toUpperCase());
        if (filters.distrito !== 'Todos') {
          data = data.filter(d => (d.distrito || '').toUpperCase() === (filters.distrito || '').toUpperCase());
        }
      }
    }

    // Time filtering
    if (filters.rango !== 'Todos') {
      const now = new Date();
      const reportDateLimit = new Date();

      if (filters.rango === '24h') {
        reportDateLimit.setHours(now.getHours() - 24);
      } else if (filters.rango === '7d') {
        reportDateLimit.setDate(now.getDate() - 7);
      } else if (filters.rango === '30d') {
        reportDateLimit.setDate(now.getDate() - 30);
      }

      data = data.filter(d => new Date(d.fecha_reporte) >= reportDateLimit);
    }

    // Layer filtering
    const activeTypes = [];
    if (filters.sivapre) activeTypes.push('Sintomático');
    if (filters.noti) activeTypes.push('Sospechoso');
    if (filters.netlab) activeTypes.push('Confirmado');

    if (activeTypes.length === 0) {
      data = [];
    } else {
      data = data.filter(d => activeTypes.includes(d.tipo_reporte));
    }

    setFilteredData(data);
  }, [filters, reportes]);


  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };

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
    <div className="main-wrapper bg-light">
      <Header />
      <Filters
        filters={filters}
        onFilterChange={handleFilterChange}
        onLayerChange={handleLayerChange}
        ubigeo={ubigeo}
      />
      <main className="main-content">
        <div className="container-fluid py-3 px-3 px-md-4">
          <div className="stats-container mb-4 overflow-hidden">
            <StatsCards
              data={filteredData}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>
          <div className="row g-3 g-lg-4">
            <div className="col-12 col-xl-8">
              <MapView
                reportes={filteredData}
                tipoReporte={activeTab}
                filters={filters}
              />
            </div>
            <div className="col-12 col-xl-4 d-flex">
              <div className="w-100 h-100">
                <SidePanel
                  data={filteredData}
                  activeTab={activeTab}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
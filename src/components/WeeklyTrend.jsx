import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeeklyTrend = ({ reportes = [] }) => {
  const chartData = useMemo(() => {
    // Agrupar casos por fecha y tipo (últimos 7 días)
    const hoy = new Date();
    const hace7dias = new Date(hoy);
    hace7dias.setDate(hace7dias.getDate() - 6);

    const diasMap = {};
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(hace7dias);
      fecha.setDate(fecha.getDate() + i);
      const fechaStr = fecha.toISOString().split('T')[0];
      diasMap[fechaStr] = { Confirmado: 0, Sospechoso: 0 };
    }

    // Contar casos por fecha y tipo
    reportes.forEach(r => {
      const fechaStr = r.fecha_reporte.split('T')[0];
      if (diasMap[fechaStr]) {
        if (r.tipo_reporte === 'Confirmado') {
          diasMap[fechaStr].Confirmado += 1;
        } else if (r.tipo_reporte === 'Sospechoso') {
          diasMap[fechaStr].Sospechoso += 1;
        }
      }
    });

    const labels = Object.keys(diasMap).map(fecha => {
      const d = new Date(fecha);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    });

    const confirmadoData = Object.values(diasMap).map(v => v.Confirmado);
    const sospechosoData = Object.values(diasMap).map(v => v.Sospechoso);

    return {
      labels,
      datasets: [
        {
          label: 'Casos Sospechosos (NGIT)',
          data: sospechosoData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2,
        },
        {
          label: 'Casos Confirmados',
          data: confirmadoData,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2,
        },
      ],
    };
  }, [reportes]);

  // calcular máximo para ajustar eje Y dinámicamente
  const maxVal = Math.max(
    10,
    ...(chartData.datasets && chartData.datasets.length ? chartData.datasets.flatMap(ds => ds.data) : [10])
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: { size: 12 },
          padding: 15,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 12 },
        bodyFont: { size: 12 },
        padding: 10,
        borderRadius: 4,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.ceil(maxVal * 1.25),
        ticks: {
          font: { size: 11 },
        },
        grid: {
          drawBorder: false,
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
      x: {
        ticks: {
          font: { size: 11 },
        },
        grid: {
          drawBorder: false,
          color: 'rgba(200, 200, 200, 0.2)',
        },
      },
    },
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h6 className="mb-2 fw-bold" style={{ fontSize: '0.9rem', color: '#212529' }}>
        Tendencia Semanal de Casos
      </h6>
      <div style={{ flex: 1, minHeight: '200px', position: 'relative' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default WeeklyTrend;

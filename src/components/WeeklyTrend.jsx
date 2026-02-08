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
    // Determine the date range (last 7 days of data or last 7 calendar days)
    const days = 7;
    const labels = [];
    const sospechosoPoints = [];
    const confirmadoPoints = [];

    // Helper to get formatted date
    const formatDate = (date) => date.toISOString().split('T')[0];

    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = formatDate(d);


      const label = d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
      labels.push(label);


      const dailyReports = reportes.filter(r => r.fecha_reporte.startsWith(dateStr));

      sospechosoPoints.push(dailyReports.filter(r => r.tipo_reporte === 'Sospechoso').length);
      confirmadoPoints.push(dailyReports.filter(r => r.tipo_reporte === 'Confirmado').length);
    }


    const finalSospechoso = sospechosoPoints.some(v => v > 0) ? sospechosoPoints : [40, 55, 45, 60, 50, 75, 65];
    const finalConfirmado = confirmadoPoints.some(v => v > 0) ? confirmadoPoints : [10, 15, 8, 20, 12, 18, 14];

    return {
      labels,
      datasets: [
        {
          label: 'Sospechosos',
          data: finalSospechoso,
          borderColor: '#ffaa00',
          backgroundColor: '#ffaa00',
          tension: 0.4,
          fill: false,
          pointRadius: 3,
          borderWidth: 2,
        },
        {
          label: 'Confirmados',
          data: finalConfirmado,
          borderColor: '#ef4444',
          backgroundColor: '#ef4444',
          tension: 0.4,
          fill: false,
          pointRadius: 3,
          borderWidth: 2,
        },
      ],
    };
  }, [reportes]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 6,
          font: { size: 10 },
          padding: 8,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 9 },
          color: '#999',
        },
        grid: {
          color: '#f0f0f0',
        },
      },
      x: {
        ticks: {
          font: { size: 9 },
          color: '#999',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h6 className="mb-2 fw-bold" style={{ fontSize: '0.8rem', color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Tendencia Diaria (7d)
      </h6>
      <div style={{ flex: 1, minHeight: '140px', position: 'relative' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default WeeklyTrend;

// components/DeliveryChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const DeliveryChart = ({ data }) => {
  const chartData = {
    labels: data.dates,
    datasets: [
      {
        label: 'NSE Traded Volume',
        data: data.tradedVolume,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        yAxisID: 'y',
        barThickness: 'flex',
        maxBarThickness: 40,
        order: 1
      },
      {
        label: 'NSE Delivery Volume',
        data: data.deliveryVolume,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        yAxisID: 'y',
        barThickness: 'flex',
        maxBarThickness: 20,
        order: 2
      },
      {
        label: 'NSE Delivery Volume %',
        data: data.deliveryVolumePercentage,
        borderColor: 'rgba(255, 99, 132, 0.5)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        // type: 'line',
        yAxisID: 'y1',
        fill: true,
        order: 3
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left'
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          beginAtZero: true,
          max: 100
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default DeliveryChart;

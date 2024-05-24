// components/DeliveryChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import moment from 'moment';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

const DeliveryChart = ({ data }) => {
  // const formattedDates = data.dates.map((date) => moment(date).format('DD-MMM'));

  const chartData = {
    labels: data.dates,
    datasets: [
      {
        label: 'Traded Volume',
        data: data.tradedVolume,
        backgroundColor: 'rgba(188, 215, 255, 1)',
        yAxisID: 'y',
        barThickness: 'flex',
        maxBarThickness: 10,
        order: 1
      },
      {
        label: 'Delivery Volume',
        data: data.deliveryVolume,
        backgroundColor: 'rgba(4, 93, 250, 0.6)',
        yAxisID: 'y',
        barThickness: 10,
        maxBarThickness: 20,
        order: 2
      },
      {
        label: 'Delivery Volume %',
        data: data.deliveryVolumePercentage,
        borderColor: 'rgba(250, 80, 169, 0.5)',
        backgroundColor: 'rgba(250, 80, 169, 0.7)',
        // type: 'line',
        yAxisID: 'y1',
        maxBarThickness: 10,

        fill: true,
        order: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'right'
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'left',
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

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DeliveryChart;

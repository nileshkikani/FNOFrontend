import React from 'react';
import Chart from 'react-apexcharts';

const MacdIndicator = ({ macdData }) => {
  const parseDate = (dateString) => new Date(dateString).getTime();

  const series = [
    {
      name: 'MACD slow',
      type: 'line',
      data: macdData?.map(data => ({
        x: parseDate(data.created_at),
        y: data.macd_slow
      }))
    },
    {
      name: 'MACD',
      type: 'line',
      data: macdData.map(data => ({
        x: parseDate(data.created_at),
        y: data.macd
      }))
    },
    {
      name: 'MACD histogram',
      type: 'bar',
      data: macdData.map(data => ({
        x: parseDate(data.created_at),
        y: data.macd_histogram,
        fillColor: data.macd_histogram >= 0 ? '#008000' : '#ff0000' 
      }))
    }
  ];

  const options = {
    colors:['#ffc000', '#674ea7','#fdfdfd'],
    chart: {
      height: 350,
    },
    stroke: {
      width: [2, 2, 0] 
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: function(val) {
          return new Date(val).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      }
    },
    yaxis: [
      {
        seriesName: 'MACD slow',
        show: false
      },
      {
        seriesName: 'MACD',
        show: false
      },
      {
        seriesName: 'MACD histogram',
        show: false
      }
    ],
    tooltip: {
      x: {
        format: 'HH:mm'
      }
    },
    legend: {
      position: 'top'
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: [
            {
              from: 0,
              to: Infinity,
              color: '#008000' 
            },
            {
              from: -Infinity,
              to: 0,
              color: '#ff0000' 
            }
          ]
        },
        borderRadius: 0,
        borderWidth: 0 
      }
    }
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h1 className="table-title">MACD indicator</h1>
      <Chart options={options} series={series} type="line" height="400" />
    </div>
  );
};

export default MacdIndicator;
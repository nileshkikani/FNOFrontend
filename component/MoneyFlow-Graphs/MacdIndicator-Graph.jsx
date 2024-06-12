import React from 'react';
import Chart from 'react-apexcharts';

const MacdIndicator = ({ macdData, categories }) => {
  // Function to determine colors based on MACD histogram values
  const setBarColors = (histogramData) => {
    return histogramData.map(value => value < 0 ? '#e06666' : '#8fce00');
  };

  const options = {
    colors:['#ffc000', '#674ea7','#8fce00'],
    dataLabels: {
      enabled: false
    },
    chart:{
      type:'bar'
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: [{
            from: 0,
            to: 100,
            color: '#8fce00'
          }]
        },
      }
    },
    stroke: {
      width: [2, 2, 4]
    },
    xaxis: {
      type: 'category',
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
        seriesName: 'MACD s',
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
        format: 'yyyy-MM-dd HH:mm'
      }
    },
    legend: {
      position: 'top'
    }
  };

  const series = [
    {
      name: 'MACD slow',
      type: 'line',
      data: macdData.map(data => data.MACDs_12_26_9)
    },
    {
      name: 'MACD',
      type: 'line',
      data: macdData.map(data => data.MACD_12_26_9)
    },
    {
      name: 'MACD histogram',
      type: 'bar',
      data: macdData.map(data => data.MACDh_12_26_9),
      // Set colors for each bar based on MACD histogram values
      color: setBarColors(macdData.map(data => data.MACDh_12_26_9))
    }
  ];

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h1 className="table-title">MACD indicator</h1>
      <Chart options={options} series={series} type="line" height="400" />
    </div>
  );
};

export default MacdIndicator;

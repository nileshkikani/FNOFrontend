'use client';
import React from 'react';
import ApexCharts from 'react-apexcharts'; 


const MultiStrikeChart = ({ data }) => {

  const seriesData = data.map(point => ({
    x: new Date(point.created_at).getTime(),
    y1: point.call_net_oi,
    y2: point.put_net_oi
  }));

  const options = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false
      }
    },
    series: [
      { name: 'Call Net OI', data: seriesData.map(point => ({ x: point.x, y: point.y1 })) },
      { name: 'Put Net OI', data: seriesData.map(point => ({ x: point.x, y: point.y2 })) }
    ],
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: function(val) {
          return new Date(val).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        }
      }
    },
    yaxis: [
      {
        title: {
          text: 'Call Net OI'
        }
      },
      {
        opposite: true,
        title: {
          text: 'Put Call OI'
        }
      }
    ],
      stroke: {
        width: 2 
      }
  };

  return (
    <div id="chart">
      <ApexCharts options={options} series={options.series} type={options.chart.type} height={options.chart.height} />
    </div>
  );
};

export default MultiStrikeChart;

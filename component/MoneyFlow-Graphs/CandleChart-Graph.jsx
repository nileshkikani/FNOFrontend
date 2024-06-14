import React from 'react';
import dynamic from 'next/dynamic';
import Chart from 'react-apexcharts';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const CandleChart = ({ candleData }) => {
  const categories = candleData.map(item => item.Date.split('T')[0] + " " + item.Date.split('T')[1].split('.')[0].slice(0, 5));

  const options = {
    chart: {
      // id:'candle',
      group: "first",
      type: 'candlestick',
      height: 350,
      events: {
        mounted: function(chartContext, config) {
          chartContext.config.tooltip.followCursor = true;
        }
      }
    },
    xaxis: {
      type: 'category',
      categories: categories,
      labels: {
        formatter: function(val) {
          return new Date(val).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      }
    },
    tooltip: {
      enabled: true,
      x: {
        show: false
      },
      y: {
        formatter: function(val) {
          return val.toFixed(2);
        }
      },
      style: {
        fontSize: '14px'
      }
    },
    yaxis: {}
  };

  const series = [{
    data: candleData.map(item => ({
      x: item.Date.split('T')[0] + " " + item.Date.split('T')[1].split('.')[0].slice(0, 5),
      y: [item.Open, item.High, item.Low, item.Close],
      markers: {
        size: 8,
        offsetY: 0,
        fillColor: (item.MACD_Buy_Signal_price !== "null") ? '#00ff00' : (item.MACD_Sell_Signal_price !== "null") ? '#ff0000' : '#ffffff',
      }
    }))
  }];

  return (
    <>
      <h1 className="table-title">Candle stick chart</h1>
      <ApexCharts options={options} series={series} type="candlestick" height={450} />
    </>
  );
};

export default CandleChart;

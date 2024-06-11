'use client';
import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import axiosInstance from '@/utils/axios';
import { useAppSelector } from '@/store';
import dynamic from 'next/dynamic'; 

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const CandleChart = ({data}) => {
  const options = {
    chart: {
      type: 'candlestick',
      height: 350
    },
    title: {
      text: 'Candlestick Chart',
      align: 'left'
    },
    xaxis: {
      type: 'text',
      tickAmount: 'dataPoints',
      formatter: function (value) {
        return value.split(' ')[1]; 
      }
    },
    tooltip: {
      enabled: true
    },
    yaxis: {}
  };
  
  
  const series = [{
    data: data.map(item => ({
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
      <ApexCharts options={options} series={series} type="candlestick" height={450} />
    </>
  );
};

export default CandleChart;

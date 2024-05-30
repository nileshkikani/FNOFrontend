'use client';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';


const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
const PremiumDecayChart = ({strike1,
  strike2,
  strike3,
  strike4,
  strike5}) => {
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const extractTimes = (items) => (items && items.length ? items.map((item) => item.created_at).filter(Boolean) : []);

    const allCreatedAts = [
      ...extractTimes(strike1),
      ...extractTimes(strike2),
      ...extractTimes(strike3),
      ...extractTimes(strike4),
      ...extractTimes(strike5)
    ];

    const uniqueCreatedAts = [...new Set(allCreatedAts)];

    const formattedTimes = uniqueCreatedAts.map((datetime) => {
      if (datetime) {
        const timePart = datetime.split('T')[1];
        if (timePart) {
          const [hours, minutes] = timePart.split(':');
          if (hours !== undefined && minutes !== undefined) {
            return `${hours}:${minutes}`;
          }
        }
      }
      return 'Invalid Time';
    });

    const getData = (items, key) => (items ? items.map((item) => item[key] || 0) : []);

    const shouldAddSeries = (strikePrice) => strikePrice && strikePrice.length >= 1;

    const createSeries = (strikePrice, prefix) => {
      const call_decay = getData(strikePrice, 'call_decay');
      const put_decay = getData(strikePrice, 'put_decay');
      return [
        { name: `${prefix} CALL`, data: call_decay },
        { name: `${prefix} PUT`, data: put_decay }
      ];  
    };

    let finalSeries = [];
    if (shouldAddSeries(strike1)) {
      const strikeValue = [...new Set(strike1.map(item => item.strike_price))];
      finalSeries.push(...createSeries(strike1,strikeValue ));
    }
    if (shouldAddSeries(strike2)) {
      const strikeValue = [...new Set(strike2.map(item => item.strike_price))];
      finalSeries.push(...createSeries(strike2, strikeValue ));
    }
    if (shouldAddSeries(strike3)) {
      const strikeValue = [...new Set(strike3.map(item => item.strike_price))];
      finalSeries.push(...createSeries(strike3, strikeValue));
    }
    if (shouldAddSeries(strike4)) {
      const strikeValue = [...new Set(strike4.map(item => item.strike_price))];
      finalSeries.push(...createSeries(strike4, strikeValue));
    }
    if (shouldAddSeries(strike5)) {
      const strikeValue = [...new Set(strike5.map(item => item.strike_price))];
      finalSeries.push(...createSeries(strike5, strikeValue));
    }

    setOptions({
      chart: {
        // height: 350,
        type: 'line',
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: {
        width: 2,
        curve: 'straight',
        dashArray: [0, 8, 5]
      },
      title: { text: 'Premiumdecay Statistics', align: 'left' },
      markers: {
        size: 0,
        hover: { sizeOffset: 6 }
      },
      xaxis: { categories: formattedTimes },
      grid: { borderColor: '#f1f1f1' }
    });

    setSeries(finalSeries);
  }, [strike1, strike2, strike3, strike4, strike5]);

  return (
    <div id="chart">{options.title && series && <ApexCharts options={options} series={series} height={350} />}</div>
  );
};

export default PremiumDecayChart;

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import useMultiStrikeData from '@/hooks/useMultiStrikeData';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const MultiStrikeChart = () => {
  const { strikePrice1, strikePrice2, strikePrice3, strikePrice4, strikePrice5,whenComponentUnmount } = useMultiStrikeData();

  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const extractTimes = (items) => (items && items.length ? items.map((item) => item.created_at).filter(Boolean) : []);

    const allCreatedAts = [
      ...extractTimes(strikePrice1),
      ...extractTimes(strikePrice2),
      ...extractTimes(strikePrice3),
      ...extractTimes(strikePrice4),
      ...extractTimes(strikePrice5)
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
      console.error('Invalid datetime format:', datetime);
      return 'Invalid Time';
    });

    const getData = (items, key) => (items ? items.map((item) => item[key] || 0) : []);

    const shouldAddSeries = (strikePrice) => strikePrice && strikePrice.length >= 1;

    const createSeries = (strikePrice, prefix) => {
      const call_net_oi = getData(strikePrice, 'call_net_oi');
      const put_net_oi = getData(strikePrice, 'put_net_oi');
      return [
        { name: `${prefix} CALL`, data: call_net_oi },
        { name: `${prefix} PUT`, data: put_net_oi }
      ];  
    };

    let finalSeries = [];
    if (shouldAddSeries(strikePrice1)) {
      const strikeValue = [...new Set(strikePrice1.map(item => item.strike_price))];
      finalSeries.push(...createSeries(strikePrice1,strikeValue ));
    }
    if (shouldAddSeries(strikePrice2)) {
      const strikeValue = [...new Set(strikePrice2.map(item => item.strike_price))];
      finalSeries.push(...createSeries(strikePrice2, strikeValue ));
    }
    if (shouldAddSeries(strikePrice3)) {
      const strikeValue = [...new Set(strikePrice3.map(item => item.strike_price))];
      finalSeries.push(...createSeries(strikePrice3, strikeValue));
    }
    if (shouldAddSeries(strikePrice4)) {
      const strikeValue = [...new Set(strikePrice4.map(item => item.strike_price))];
      finalSeries.push(...createSeries(strikePrice4, strikeValue));
    }
    if (shouldAddSeries(strikePrice5)) {
      const strikeValue = [...new Set(strikePrice5.map(item => item.strike_price))];
      finalSeries.push(...createSeries(strikePrice5, strikeValue));
    }

    setOptions({
      chart: {
        // height: 350,
        type: 'line',
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5]
      },
      title: { text: 'multistrike Statistics', align: 'left' },
      markers: {
        size: 0,
        hover: { sizeOffset: 6 }
      },
      xaxis: { categories: formattedTimes },
      grid: { borderColor: '#f1f1f1' }
    });

    setSeries(finalSeries);
  }, [strikePrice1, strikePrice2, strikePrice3, strikePrice4, strikePrice5]);

  useEffect(()=>{
    return ()=>{
      whenComponentUnmount();
    }
  },[])

  return (
    <div id="chart">{options.title && series && <ApexCharts options={options} series={series} height={350} />}</div>
  );
};

export default MultiStrikeChart;

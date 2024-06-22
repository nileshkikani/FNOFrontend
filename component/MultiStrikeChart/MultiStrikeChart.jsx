import React, { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';

const MultiStrikeChart = ({ msChartData }) => {
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const extractTimes = (items) => (items && items.length ? items.map((item) => item.created_at).filter(Boolean) : []);

    const allCreatedAts = [...extractTimes(msChartData)];

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

    const groupByStrikePrice = (data) => {
      return data.reduce((acc, item) => {
        const { strike_price, call_net_oi, put_net_oi } = item;
        if (!acc[strike_price]) {
          acc[strike_price] = { call_net_oi: [], put_net_oi: [] };
        }
        acc[strike_price].call_net_oi.push(call_net_oi);
        acc[strike_price].put_net_oi.push(put_net_oi);
        return acc;
      }, {});
    };

    const groupedData = groupByStrikePrice(msChartData);

    const finalSeries = Object.keys(groupedData).reduce((acc, strikePrice) => {
      acc.push({ name: `CALL ${strikePrice}`, data: groupedData[strikePrice].call_net_oi });
      acc.push({ name: `PUT ${strikePrice}`, data: groupedData[strikePrice].put_net_oi });
      return acc;
    }, []);

    setOptions({
      chart: {
        type: 'line',
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: {
        width: 2,
        curve: 'straight',
        dashArray: [0, 8, 5]
      },
      title: { text: 'Multistrike Statistics', align: 'left' },
      markers: {
        size: 0,
        hover: { sizeOffset: 6 }
      },
      xaxis: { categories: formattedTimes },
      grid: { borderColor: '#f1f1f1' }
    });

    setSeries(finalSeries);
  }, [msChartData]);

  return (
    <div id="chart">
      {options.title && series.length > 0 && <ApexCharts options={options} series={series} height={350} />}
    </div>
  );
};

export default MultiStrikeChart;

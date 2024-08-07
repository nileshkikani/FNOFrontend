import React, { useState, useEffect } from 'react';
import { Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
// import useFiiDiiData from '@/hooks/useFiiDiiData';

const DailyIndexFutures = ({filteredByClient}) => {
  // const { filteredClientData } = useFiiDiiData();
  const [yAxisDomain, setYAxisDomain] = useState([0, 100]);

  // console.log("Az",filteredByClient)
  useEffect(() => {
    const values = filteredByClient?.map((item) => item?.daily_dif_future_index);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    setYAxisDomain([minValue, maxValue]);
  }, [filteredByClient]);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h1 className="table-title">DAILY INDEX FUTURES</h1>
      <ResponsiveContainer width="100%" height="110%">
        <ComposedChart
          width={500}
          height={400}
          data={filteredByClient}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid />
          <XAxis
            dataKey="date"
            tickFormatter={(timeStr) =>
              new Date(timeStr)
                .toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric'
                })
                .replace(/\d{4}/, '')
            }
          />
          <YAxis domain={yAxisDomain} />
          <Tooltip />
          <Legend />
          <Bar name="Index Futures" dataKey="daily_dif_future_index" fill="#6d67e4" activeDot={{ r: 8 }} />
          {/* <Brush dataKey="date" height={30} stroke="#0A3D62" /> */}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyIndexFutures;

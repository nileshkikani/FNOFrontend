'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

import useNiftyFutureData from '@/hooks/useNiftyFutureData';

const NiftyFuturesClosePrice = () => {
  const { filterByCreatedDate } = useNiftyFutureData();

  return (
    <>
      <div>
        <h1 className="table-title">Open interest change</h1>
        <BarChart
          width={1500}
          height={500}
          data={filterByCreatedDate}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="created_at"
            tickFormatter={(timeStr) =>
              new Date(timeStr).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Bar name="Open interest change" dataKey="close_price" fill="#a3c949" />
        </BarChart>
      </div>
    </>
  );
};

export default NiftyFuturesClosePrice;

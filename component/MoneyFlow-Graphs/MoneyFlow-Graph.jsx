'use client';
import React from 'react';
import { LineChart, Line, XAxis, Brush, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MoneyFlowGraph = ({ data }) => {
  const netMoneyFlowValues = data && data?.map((d) => parseFloat(d.net_money_flow));
  const minNetMoneyFlow = Math.min(...netMoneyFlowValues);
  const maxNetMoneyFlow = Math.max(...netMoneyFlowValues);

  const closeValues = data && data?.map((d) => parseFloat(d.close));
  const minClose = Math.min(...closeValues);
  const maxClose = Math.max(...closeValues);
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="right" domain={[minNetMoneyFlow, maxNetMoneyFlow]} />
          <YAxis yAxisId="left" orientation="right" domain={[minClose, maxClose]} />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="right"
            name="net money flow"
            type="monotone"
            dataKey="net_money_flow"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="left"
            name="closing price"
            type="monotone"
            dataKey="close"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
          <Brush
            dataKey="created_at"
            height={40}
            stroke="#0A3D62"
            tickFormatter={(value) => new Date(value).toISOString().split('T')[0]}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoneyFlowGraph;

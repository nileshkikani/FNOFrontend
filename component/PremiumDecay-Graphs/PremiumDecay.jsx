'use client';
import React from 'react';
import { Line, LineChart, XAxis, ResponsiveContainer, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PremiumDecayChart = (props) => {
    const { val } = props;
    // console.log("pp",val)
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h1 className="table-title">Premium Decay</h1>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={val}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid stroke="#E5E5E5" />
          <XAxis
            dataKey="created_at"
            tickFormatter={(timeStr) =>
              new Date(timeStr).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" hide />
          <Tooltip
            labelFormatter={(timeStr) =>
              new Date(timeStr).toLocaleTimeString([], {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          />
          <Legend />
          <Line
            name="call decay"
            yAxisId="left"
            type="linear"
            dataKey="call_decay"
            stroke="#63D168"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line
            name="put decay"
            yAxisId="right"
            type="linear"
            dataKey="put_decay"
            stroke="#E96767"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PremiumDecayChart;

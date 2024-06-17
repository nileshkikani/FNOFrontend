'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Brush,
  ResponsiveContainer,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';


const NiftyFuturesGraph = ({ niftyFuturesFilterData }) => {
  return (
    <>
      <div style={{ width: '100%', height: '400px' }}>
        <h1 className="table-title">Open interest change</h1>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={1500}
            height={500}
            data={niftyFuturesFilterData}
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
              reversed={true}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(timeStr) =>
                new Date(timeStr).toLocaleTimeString([], {
                  // year: "numeric",
                  // month: "numeric",
                  // day: "numeric",
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
            />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />
            <Bar name="Open interest change" dataKey="change_in_open_interest" fill="#a3c949" />
            <Brush
              dataKey="created_at"
              height={40}
              stroke="#0A3D62"
              tickFormatter={(value) => new Date(value).toISOString().split('T')[0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default NiftyFuturesGraph;

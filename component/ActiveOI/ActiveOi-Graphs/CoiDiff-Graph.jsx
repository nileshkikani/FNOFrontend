'use client';
import React from 'react';
import {
  XAxis,
  ComposedChart,
  Line,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush
} from 'recharts';

import useActiveOiData from '@/hooks/useActiveOiData';

const CoiDiffGraph = () => {
  const { checkFive, adjustedNiftyStart, adjustedNiftyEnd, filteredByDateForRange } = useActiveOiData();

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h1 className="table-title">COI Difference</h1>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={500}
          height={400}
          data={filteredByDateForRange}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
          //   syncId="change_oi_brush"
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
          <YAxis yAxisId="right" orientation="right" domain={[adjustedNiftyStart, adjustedNiftyEnd]} hide />
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
          {!checkFive ? (
            <>
              <Line
                yAxisId="left"
                type="monotone"
                name="call oi"
                dataKey="coi_difference"
                stroke="#63D168"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </>
          ) : (
            <>
              <Line
                yAxisId="left"
                name="call oi "
                type="monotone"
                dataKey="large_coi_difference"
                stroke="#63D168"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </>
          )}
          <Line
            yAxisId="right"
            name="NIFTY"
            type="linear"
            dataKey="live_nifty"
            stroke="#f55abe"
            strokeWidth={2}
            dot={false}
          />
          <Brush
            dataKey="created_at"
            height={40}
            stroke="#0A3D62"
            tickFormatter={(value) => new Date(value).toISOString().split('T')[0]}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoiDiffGraph;

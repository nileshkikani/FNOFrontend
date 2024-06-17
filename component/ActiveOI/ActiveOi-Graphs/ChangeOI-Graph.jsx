'use client';
import React from 'react';
import {
  Line,
  Bar,
  Brush,
  XAxis,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart
} from 'recharts';

const ChangeOIGraph = ({ data, adjustedNiftyStart, adjustedNiftyEnd }) => {
  return (
    <>
      <h1 className="table-title">Change in OI</h1>
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer width="100%" height="110%">
          <ComposedChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20
            }}
            syncId="change_oi_brush"
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
            <Bar yAxisId="left" name="coi difference" dataKey="call_oi_difference" fill="#E96767" />
            <Bar yAxisId="left" name="poi difference " dataKey="put_oi_difference" fill="#63D168" />
            <Line
              name="NIFTY"
              yAxisId="right"
              type="linear"
              dataKey="live_nifty"
              stroke="#f55abe"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default ChangeOIGraph;

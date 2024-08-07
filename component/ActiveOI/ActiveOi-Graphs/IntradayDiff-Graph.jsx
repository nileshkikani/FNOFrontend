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
} from 'recharts';

const formatNumberInIndianStyle = (number) => {
  const [integerPart, decimalPart] = number.toString().split('.');
  let lastThree = integerPart.slice(-3);
  let otherParts = integerPart.slice(0, -3);

  if (otherParts !== '') {
    lastThree = ',' + lastThree;
  }

  otherParts = otherParts.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  const formattedInteger = otherParts + lastThree;

  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};

const tooltipFormatter = (value, name) => {
  return [formatNumberInIndianStyle(value), name];
};

const IntradayDiffGraph = ({ data, adjustedNiftyStart, adjustedNiftyEnd }) => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h1 className="table-title">Intraday Difference</h1>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
           syncId="above_table"
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
            formatter={tooltipFormatter}
          />
          <Legend />
          <Line
            yAxisId="left"
            name="intraday difference"
            type="monotone"
            dataKey="intraday_difference"
            stroke="#63D168"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            name="NIFTY"
            type="linear"
            dataKey="live_nifty"
            stroke="#f55abe"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IntradayDiffGraph;

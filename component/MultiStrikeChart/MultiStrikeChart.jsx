import React from 'react';
import { Line, LineChart, XAxis, ResponsiveContainer, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import useMultiStrikeData from '@/hooks/useMultiStrikeData';

const MultiStrikeChart = () => {
  const { strikePrice1, strikePrice2, strikePrice3, strikePrice4, strikePrice5,strikePrice1IsChecked,strikePrice2IsChecked,strikePrice3IsChecked,strikePrice4IsChecked,strikePrice5IsChecked, } =
    useMultiStrikeData();
  //   const [strikePrice, setStrikePrice ] = useState();

  console.log("fff,",strikePrice5IsChecked);
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h1 className="table-title">Multi Strike</h1>
      <ResponsiveContainer >
      <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <YAxis yAxisId="right" orientation="right" />
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
          {strikePrice1 && strikePrice1IsChecked &&(
            <>
              <Line type="monotone" data={strikePrice1} dataKey="call_net_oi" stroke="#1e293b" yAxisId="right" />
              <Line type="monotone" data={strikePrice1} dataKey="put_net_oi" stroke="#94a3b8" yAxisId="left" />
            </>
          )}
          {strikePrice2 && strikePrice2IsChecked && (
            <>
              <Line type="monotone" data={strikePrice2} dataKey="call_net_oi" stroke="#dc2626" yAxisId="right" />
              <Line type="monotone" data={strikePrice2} dataKey="put_net_oi" stroke="#f87171" yAxisId="left" />
            </>
          )}
          {strikePrice3 && strikePrice3IsChecked && (
            <>
              <Line type="monotone" data={strikePrice3} dataKey="call_net_oi" stroke="#7c2d12" yAxisId="right" />
              <Line type="monotone" data={strikePrice3} dataKey="put_net_oi" stroke="#fb923c" yAxisId="left" />
            </>
          )}
          {strikePrice4 && strikePrice4IsChecked && (
            <>
              <Line type="monotone" data={strikePrice4} dataKey="call_net_oi" stroke="#3f6212" yAxisId="right" />
              <Line type="monotone" data={strikePrice4} dataKey="put_net_oi" stroke="#a3e635" yAxisId="left" />
            </>
          )}
          {strikePrice5 && strikePrice5IsChecked && (
            <>
              <Line type="monotone" data={strikePrice5} dataKey="call_net_oi" stroke="#155e75" yAxisId="right" />
              <Line type="monotone" data={strikePrice5} dataKey="put_net_oi" stroke="#22d3ee" yAxisId="left" />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MultiStrikeChart;

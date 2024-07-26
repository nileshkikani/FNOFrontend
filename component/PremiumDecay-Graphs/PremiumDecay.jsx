import React from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const PremiumDecayChart = ({ data }) => {

  const prepareChartData = () => {
    let chartData = [];

    if (!Array.isArray(data) || data.length === 0) {
      return chartData;
    }

    data.forEach(item => {
      const strikePrice = item.strike_price;
      const itemData = item.data;

      if (!Array.isArray(itemData) || itemData.length === 0) {
        return;
      }

      itemData.forEach(dataItem => {
        const createdAt = dataItem.created_at;
        const callDecay = dataItem.call_decay;
        const putDecay = dataItem.put_decay;
        const TotalPutDecay = dataItem.total_put_decay;
        const TotalCallDecay = dataItem.total_call_decay;

        let existingEntry = chartData.find(entry => entry.created_at === createdAt);

        if (!existingEntry) {
          existingEntry = {
            created_at: new Date(createdAt),
            strikePrice,
          };
          chartData.push(existingEntry);
        }

        if (callDecay !== undefined) {
          existingEntry.call_decay = callDecay;
        }
        if (putDecay !== undefined) {
          existingEntry.put_decay = putDecay;
        }
        if (TotalPutDecay !== undefined) {
          existingEntry.total_put_decay = TotalPutDecay;
        }
        if (TotalCallDecay !== undefined) {
          existingEntry.total_call_decay = TotalCallDecay;
        }
      });
    });

    chartData.sort((a, b) => a.created_at - b.created_at);

    return chartData;
  };

  const chartData = prepareChartData();

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={chartData}>
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
          content={(tooltipProps) => {
            const { label, payload } = tooltipProps;
            if (!payload || payload.length === 0) return null;
            const { created_at } = payload[0].payload;
            const formattedDate = new Date(created_at).toLocaleString();
            return (
              <div className="custom-tooltip" style={{ backgroundColor: '#ffffff', padding: '10px', border: '1px solid #cccccc' }}>
                <p>{formattedDate}</p>
                {payload.map((entry, index) => (
                  <p key={`item-${index}`}>
                    {entry.name}: {entry.value}
                  </p>
                ))}
                <p>Strike Price: {payload[0].payload.strikePrice}</p>
              </div>
            );
          }}
        />
        <Legend />
        <Line yAxisId="right" type="linear" dataKey="total_call_decay" name="Total Call Decay" stroke="#63D168" dot={false}/>
        <Line yAxisId="right" type="linear" dataKey="total_put_decay" name="Total Put Decay" stroke="#E96767" dot={false} />
        <Bar yAxisId="left" dataKey="call_decay" name="Call Decay" fill="#63D168" />
        <Bar yAxisId="left" dataKey="put_decay" name="Put Decay" fill="#E96767" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default PremiumDecayChart;

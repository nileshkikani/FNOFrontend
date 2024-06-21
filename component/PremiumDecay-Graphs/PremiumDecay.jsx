import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const PremiumDecayChart = ({ data }) => {
  
  // Function to prepare data for Recharts
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
      });
    });

    chartData.sort((a, b) => a.created_at - b.created_at);

    return chartData;
  };

  const chartData = prepareChartData();

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData}>
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
        <Line type="monotone" dataKey="call_decay" name="Call Decay" stroke="#63D168" />
        <Line type="monotone" dataKey="put_decay" name="Put Decay" stroke="#E96767" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PremiumDecayChart;

import React from 'react';
import {
  Bar,
  ResponsiveContainer,
  YAxis,
  XAxis,
  CartesianGrid,
  BarChart,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell
} from 'recharts';

const ActiveMoneyFlow = ({ data, title, layout }) => {
  // Preprocess the data to add the necessary display properties
  const processedData =
    data && layout === 'vertical'
      ? data.map((item) => ({
          ...item,
          display_net_money_flow: Math.abs(item.net_money_flow),
          fill: item.net_money_flow < 0 ? '#E96767' : '#63D168',
          original_net_money_flow: item.net_money_flow

          // display_previous_net_money_flow: Math.abs(item.previous_net_money_flow),
          // fill_previous: item.previous_net_money_flow < 0 ? '#E96767' : '#63D168',
          // previous_net_money_flow: item.previous_net_money_flow,
        }))
      : data.map((item) => ({
          ...item,
          display_net_money_flow: Math.abs(item.net_money_flow),
          display_previous_net_money_flow:
            item.previous_net_money_flow !== undefined ? Math.abs(item.previous_net_money_flow) : 0,
          filldill: item.net_money_flow >= 0 ? '#63D168' : '#E96767',
          previousFill: item.previous_net_money_flow >= 0 ? '#63D168' : '#E96767',
          original_net_money_flow: item.net_money_flow,
          original_previous_net_money_flow:
            item.previous_net_money_flow !== undefined ? item.previous_net_money_flow : 0
        }));

  console.log('Processed Data:', processedData); // Debugging: Check processed data

  return (
    <div style={{ width: '100%', height: '580px' }}>
      <h1 className="table-title">{`${title} MONEY-FLOW`}</h1>
      <ResponsiveContainer width="100%" height="100%">
        {layout === 'vertical' ? (
          <BarChart layout="vertical" data={processedData} margin={{ top: 20, right: 30, bottom: 20, left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 'dataMax']} />
            <YAxis dataKey="symbol" type="category" interval={0} />
            <Tooltip
              formatter={(value, name, props) => {
                if (name === 'Net Money Flow') {
                  return [props.payload.original_net_money_flow, name];
                } else if (name === ' Previous Day Last 45 Minutes') {
                  return [props.payload.previous_net_money_flow, name]; // Display previous_net_money_flow in tooltip
                }
                return [value, name];
              }}
            />
            <Legend />
            <ReferenceLine x={0} stroke="#000" />
            <Bar name="Net Money Flow" dataKey="display_net_money_flow" fill={({ payload }) => payload.fill} />
          </BarChart>
        ) : (
          <BarChart layout="horizontal" data={processedData} margin={{ top: 20, right: 30, bottom: 20, left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="category" dataKey="symbol" />
            <YAxis type="number" />
            <Tooltip
              formatter={(value, name, props) => {
                if (name === 'Net Money Flow') {
                  return [props.payload.original_net_money_flow, name];
                } else if (name === 'Previous Day Last 45 Minutes') {
                  return [props.payload.original_previous_net_money_flow, name];
                }
                return [value, name];
              }}
            />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />
            <Bar
              name="Previous Day Last 45 Minutes"
              dataKey="display_previous_net_money_flow"
              fill={({ payload }) => payload.previousFill}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.previousFill} />
              ))}
            </Bar>
            <Bar name="Net Money Flow" dataKey="display_net_money_flow" fill={({ payload }) => payload.filldill}>
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.filldill} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default ActiveMoneyFlow;


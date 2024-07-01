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
  ReferenceLine
} from 'recharts';


const ActiveMoneyFlow = ({ data, title, layout }) => {
  const processedData =
    data &&
    data.map((item) => ({
      ...item,
      display_net_money_flow: Math.abs(item.net_money_flow),
      fill: item.net_money_flow < 0 ? '#E96767' : '#63D168',
      original_net_money_flow: item.net_money_flow,

      // display_previous_net_money_flow: Math.abs(item.previous_net_money_flow),
      // fill_previous: item.previous_net_money_flow < 0 ? '#E96767' : '#63D168', 
      // previous_net_money_flow: item.previous_net_money_flow,
    }));

    const processedData2 =
    data && layout=='horizontal' &&
    data.map((item) => ({
      ...item,
      // display_net_money_flow: Math.abs(item.net_money_flow),
      // fill: item.net_money_flow < 0 ? '#E96767' : '#63D168',
      // original_net_money_flow: item.net_money_flow,

      // display_previous_net_money_flow: Math.abs(item.previous_net_money_flow),
      fill_previous: item.previous_net_money_flow < 0 ? '#E96767' : '#63D168', 
      previous_net_money_flow: item.previous_net_money_flow,
    }));

    console.log("vfv",processedData2)

  return (
    <div style={{ width: '100%', height: '580px' }}>
      <h1 className="table-title">{`${title} MONEY-FLOW`}</h1>
      <ResponsiveContainer width="100%" height="100%">
        {layout === 'vertical' && (
          <BarChart layout="vertical" data={processedData} margin={{ top: 20, right: 30, bottom: 20, left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 'dataMax']} />
            <YAxis dataKey="symbol" type="category" interval={0} />
            <Tooltip
              formatter={(value, name, props) => {
                if (name === 'Net Money Flow') {
                  return [props.payload.original_net_money_flow, name];
                }
                return [value, name];
              }}
            />
            <Legend />
            <ReferenceLine x={0} stroke="#000" />
            <Bar name="Net Money Flow" dataKey="display_net_money_flow" fill={({ payload }) => payload.fill} />
          </BarChart>
        )}
        {layout === 'horizontal' && (
          <BarChart layout="horizontal" data={processedData2} margin={{ top: 20, right: 30, bottom: 20, left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="category" dataKey="symbol" />
            <YAxis type="number" />
            <Tooltip
              formatter={(value, name, props) => {
                if (name === 'Net Money Flow') {
                  return [props.payload.original_net_money_flow, name];
                } else if (name === 'Last 45 Minutes') {
                  return [props.payload.previous_net_money_flow, name];
                }
                return [value, name];
              }}
            />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />
            <Bar name="Net Money Flow" dataKey="display_net_money_flow" fill={({ payload }) => payload.fill} />
            <Bar name=" Previous Day Last 45 Minutes" dataKey="display_previous_net_money_flow" fill={({ payload }) => payload.fill_previous} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>      
  );
};

export default ActiveMoneyFlow;
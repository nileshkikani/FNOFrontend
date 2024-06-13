'use client'
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

// import useCashflowData from '@/hooks/useCashflowData';

const ActiveMoneyFlow = ({ data, title }) => {
  const processedData =
    data &&
    data?.map((item) => ({
      ...item,
      display_net_money_flow: Math.abs(item.net_money_flow),
      fill: item.net_money_flow < 0 ? '#E96767' : '#63D168',
      original_net_money_flow: item.net_money_flow
    }));

  // Calculate the maximum absolute value for the domain
  const netMoneyFlowValues = processedData && processedData.map((d) => Math.abs(d.net_money_flow));
  const maxAbsNetMoneyFlow = Math.max(...netMoneyFlowValues);

  return (
    <div style={{ width: '100%', height: '580px' }}>
      <h1 className="table-title">{`${title} MONEY-FLOW`}</h1>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          width={700}
          height={400}
          data={processedData}
          margin={{
            top: 20,
            right: 30,
            bottom: 20,
            left: 100 // Increase left margin to accommodate longer Y-axis labels
          }}
          barSize={20} // Adjust the bar size
          barCategoryGap={30} // Adjust the gap between bars
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, maxAbsNetMoneyFlow]} />
          <YAxis dataKey="symbol" type="category" interval={0} /> {/* Ensure all labels are shown */}
          <Tooltip
            formatter={(value, name, props) => [props.payload.original_net_money_flow, name]} // Show original negative value in tooltip
          />
          <Legend />
          <ReferenceLine x={0} stroke="#000" />
          <Bar name="net money flow" dataKey="display_net_money_flow" fill={({ fill }) => fill} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default ActiveMoneyFlow;

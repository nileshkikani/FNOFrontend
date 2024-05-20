import React from "react";
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
} from "recharts";

import useCashflowData from "@/hooks/useCashflowData";

const ActiveMoneyFlow = ({data}) => {
  const processedData = data && data.map(item => ({
    ...item,
    fill: item.net_money_flow < 0 ? "#E96767" : "#63D168"
  }));
  
  // Calculate the absolute maximum value for symmetrical domain
  const netMoneyFlowValues =processedData && processedData.map(d => parseFloat(d.net_money_flow));
  const absMaxNetMoneyFlow = Math.max(Math.abs(Math.min(...netMoneyFlowValues)), Math.abs(Math.max(...netMoneyFlowValues)));
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h1 className="table-title">ACTIVE MONEY-FLOW</h1>
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
      left: 50,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis type="number" domain={[-absMaxNetMoneyFlow, absMaxNetMoneyFlow]} />
    <YAxis dataKey="symbol" type="category" />
    <Tooltip />
    <Legend />
    <ReferenceLine x={0} stroke="#000" />
    <Bar
      name="net money flow"
      dataKey="net_money_flow"
      fill={({ fill }) => fill}
    />
  </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActiveMoneyFlow;

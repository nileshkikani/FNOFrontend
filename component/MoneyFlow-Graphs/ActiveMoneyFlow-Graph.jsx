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
} from "recharts";

import useCashflowData from "@/hooks/useCashflowData";

const ActiveMoneyFlow = () => {
  const { data } = useCashflowData();

  const netMoneyFlowValues = data.map((item) => item.net_money_flow);
  // const minValue = Math.min(...netMoneyFlowValues);
  // const maxValue = Math.max(...netMoneyFlowValues);

  // const middle = (minValue + maxValue) / 2;
  // const tickValues = [minValue, middle, maxValue];

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h1 className="table-title">ACTIVE MONEY-FLOW</h1>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="symbol" type="category" />
          <Tooltip />
          <Legend />
          <Bar
            name="net money flow"
            dataKey="net_money_flow"
            fill={(data) =>
              Number(data?.net_money_flow) < 0 ? "#FF440D" : "#0DFF57"
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActiveMoneyFlow;

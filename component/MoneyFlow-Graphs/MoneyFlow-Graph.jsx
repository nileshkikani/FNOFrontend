"use client";
import React from "react";
import useCashflowData from "@/hooks/useCashflowData";
import {
  LineChart,
  Line,
  XAxis,
  Brush,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MoneyFlowGraph = () => {
  const { selectedStockData } = useCashflowData();
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={selectedStockData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="left" />
          <YAxis
            yAxisId="right"
            domain={["dataMin - 25", "dataMax + 25"]}
            orientation="right"
            hide
          />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            name="net money flow"
            type="monotone"
            dataKey="net_money_flow"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            yAxisId="right"
            name="closing price"
            type="monotone"
            dataKey="close"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
          />
          <Brush dataKey="created_at" height={30} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoneyFlowGraph;

"use client";
import React, { useState } from "react";
import {
  Brush,
  XAxis,
  ComposedChart,
  Line,
  Bar,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import useFiiDiiData from "@/hooks/useFiiDiiData";

const OptionDataGraph = () => {
  const { filteredClientData } = useFiiDiiData();

  const sortedData = filteredClientData.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedData.map((item) => ({
    ...item,
    option_index_call_difference:
      item.option_index_call_long && item.option_index_call_short
        ? item.option_index_call_long - item.option_index_call_short
        : null,
    option_index_put_difference:
    item.option_index_put_long && item.option_index_put_short
    ?item.option_index_put_long - item.option_index_put_short
    :null
  }));

  return (
    <>
      <div style={{ width: "100%", height: "400px" }}>
        <h1 className="table-title">INDEX OPTION OI</h1>
        <ResponsiveContainer width="100%" height="110%">
          <ComposedChart
            width={500}
            height={400}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid />
            <XAxis
  dataKey="date"
  tickFormatter={(timeStr) => {
    const date = new Date(timeStr);
    const monthIndex = date.getMonth();
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthAbbreviation = months[monthIndex];
    const dayOfMonth = date.getDate();
    return `${dayOfMonth} ${monthAbbreviation}`;
  }}
/>

            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              name="call oi"
              dataKey="option_index_call_difference"
              fill="#63D168"
              activeDot={{ r: 8 }}
            />
            <Bar
              name="put oi"
              dataKey="option_index_put_difference"
              fill="#E96767"
              activeDot={{ r: 8 }}
            />
            <Brush dataKey="date" height={30} stroke="#0A3D62" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default OptionDataGraph;

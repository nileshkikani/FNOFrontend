"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Brush,
  Tooltip,
  Legend,
  Line,
  ReferenceLine,
} from "recharts";

import useNiftyFutureData from "@/hooks/useNiftyFutureData";

const NiftyFuturesGraph = () => {
  const { reversedFilteredData } = useNiftyFutureData();

  return (
    <>
      <div>
        <h1 className="table-title">Open interest change</h1>
        <BarChart
          width={1500}
          height={500}
          data={reversedFilteredData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="created_at"
            tickFormatter={(timeStr) =>
              new Date(timeStr).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Bar
            name="Open interest change"
            dataKey="change_in_open_interest"
            fill="#a3c949"
          />
          {/* <Line dataKey="last_price" stroke="#ff7300" /> */}
          <Brush dataKey="created_at" height={30} stroke="#8884d8" />
        </BarChart>
      </div>
    </>
  );
};

export default NiftyFuturesGraph;

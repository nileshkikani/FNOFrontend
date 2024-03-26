"use client";
import React from "react";
import {
  BarChart,
  Bar,
  Brush,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

import useActiveOiData from "@/hooks/useActiveOiData";


const ActiveOIGraph = () => {
  const { data } = useActiveOiData();
  const dataReversed = data.slice(0).reverse();

  return (
    <>
      <div>
        <h1 className="table-title">Call vs Put Open Interest</h1>
        <BarChart
          width={1160}
          height={500}
          data={dataReversed}
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
          <Brush dataKey="created_at" height={30} stroke="#8884d8" />
          <Bar dataKey="ce_oi" fill="#a3c949" />
          <Bar dataKey="pe_oi" fill="#bd5853" />
        </BarChart>
      </div>
    </>
  );
};

export default ActiveOIGraph;

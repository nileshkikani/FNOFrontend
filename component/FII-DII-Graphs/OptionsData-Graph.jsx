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
  const { filteredClientData,finalResult } = useFiiDiiData();

const sortedData = filteredClientData.sort((a, b) => new Date(a.date) - new Date(b.date));
console.log("FORM GRAPH:",finalResult);

  return (
    <>
   <div style={{ width: "100%", height: "400px" }}>
      <h1 className="table-title">OPTION INDEX</h1>
      <ResponsiveContainer width="100%" height="110%">
        <ComposedChart
          width={500}
          height={400}
          data={sortedData}
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
            tickFormatter={(timeStr) =>
                new Date(timeStr).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                }).replace(/\d{4}/, '') 
            }
          />
          <YAxis/>
          <Tooltip/>
          <Legend />
              <Bar              
                name="call oi"
                dataKey="option_index_call_long"
                fill="#63D168"
                activeDot={{ r: 8 }}
              />
              <Bar         
                name="put oi"
                dataKey="option_index_put_long"
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

"use client";
import React, { useState } from "react";
import {
  Line,
  Brush,
  LineChart,
  XAxis,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import useActiveOiData from "@/hooks/useActiveOiData";

const ScatterPlotGraph = () => {
  const { data,checkFive,
    dropDownChange  } = useActiveOiData();

  const maxLiveNifty = Math.max(...data.map((item) => item.live_nifty));

  const currentLevel = maxLiveNifty;
  const range = 20;
  const adjustedStart = currentLevel - range;
  const adjustedEnd = currentLevel + range;


  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h1 className="table-title">PCR</h1>
 
      <ResponsiveContainer width="100%" height="110%">
        <LineChart
          width={500}
          height={300}
          data={data}
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
            reversed={true}
          />
          <YAxis yAxisId="left" />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[adjustedStart, adjustedEnd]}
            hide
          />
          <Tooltip
            labelFormatter={(timeStr) =>
              new Date(timeStr).toLocaleTimeString([], {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            }
          />
          <Legend />
          {!checkFive ? (
            <>
              <Line
                yAxisId="left"
                type="linear"
                dataKey="pcr"
                stroke="#545454"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </>
          ) : (
            <>
              <Line
              name="pcr"
                yAxisId="left"
                type="linear"
                dataKey="large_pcr"
                stroke="#545454"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </>
          )}
          <Line
            name="NIFTY"
            yAxisId="right"
            type="linear"
            dataKey="live_nifty"
            stroke="#f55abe"
            strokeDasharray="6 2"
            strokeWidth={2}
            dot={false}
          />
          <Brush dataKey="created_at" height={30} stroke="#0A3D62"  reversed={true} tickFormatter={(value) => new Date(value).toISOString().split('T')[0]} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlotGraph;

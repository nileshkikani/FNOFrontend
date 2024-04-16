"use client";
import React from "react";
import {
  Brush,
  XAxis,
  ComposedChart,
  Line,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import useActiveOiData from "@/hooks/useActiveOiData";

const CallVsPutGraph = () => {
  const { data, checkFive } = useActiveOiData();

  const maxLiveNifty = Math.max(...data.map((item) => item.live_nifty));

  const currentLevel = maxLiveNifty;
  const range = 20;
  const adjustedStart = currentLevel - range;
  const adjustedEnd = currentLevel + range;

  console.log(typeof data, "FROM ACTIVEOI");

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h1 className="table-title">Call vs Put OI</h1>
      <ResponsiveContainer width="100%" height="110%">
        <ComposedChart
          width={500}
          height={400}
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
                type="monotone"
                name="call oi"
                dataKey="ce_oi"
                stroke="#8FCE00"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                name="put oi"
                dataKey="pe_oi"
                stroke="#CC3333"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </>
          ) : (
            <>
              <Line
                yAxisId="left"
                name="call oi "
                type="monotone"
                dataKey="large_ce_oi"
                stroke="#8FCE00"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                name="put oi "
                type="monotone"
                dataKey="large_pe_oi"
                activeDot={{ r: 8 }}
                strokeWidth={2}
                stroke="#CC3333"
              />
            </>
          )}
          <Line
            yAxisId="right"
            name="NIFTY"
            type="linear"
            dataKey="live_nifty"
            stroke="#f55abe"
            strokeDasharray="6 2"
            strokeWidth={2}
            dot={false}
          />
          <Brush
            dataKey="created_at"
            height={30}
            stroke="#0A3D62"
            reversed={true}
            tickFormatter={(value) => new Date(value).toISOString().split('T')[0]}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CallVsPutGraph;

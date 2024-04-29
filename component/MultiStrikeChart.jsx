"use client";
import React from "react";
import {
  Line,
  LineChart,
  XAxis,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import useMultiStrikeData from "../hooks/useMultiStrikeData";

const NiftyFuturesClosePrice = () => {
  const { data } = useMultiStrikeData();

  return (
    <>
       <div style={{ width: "100%", height: "400px" }}>
        <h1 className="table-title">Multi Strike</h1>
        <ResponsiveContainer width="100%" height="100%">
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
            <CartesianGrid stroke="#E5E5E5" />
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
            {/* <YAxis
            yAxisId="right"
            orientation="right"
            domain={[adjustedNiftyStart, adjustedNiftyEnd]}
            hide
          /> */}
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
            <Line
              name="call oi"
              type="linear"
              dataKey="call_net_oi"
              stroke="#8FCE00"
              strokeWidth={2}
            />
            <Line
              name="put oi"
              type="linear"
              dataKey="put_net_oi"
              stroke="#CC3333"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default NiftyFuturesClosePrice;

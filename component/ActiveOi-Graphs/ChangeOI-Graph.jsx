"use client";
import React, { useState } from "react";
import {
  Line,
  Bar,
  Brush,
  XAxis,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
} from "recharts";

import useActiveOiData from "@/hooks/useActiveOiData";

const ChangeOIGraph = () => {
  const { data ,checkFive } = useActiveOiData();
  // const dataReversed = data.slice(0).reverse();
  // const [checkFive, setCheckFive] = useState(false);

  const maxLiveNifty = Math.max(...data.map((item) => item.live_nifty));
  const currentLevel = maxLiveNifty;
  const range = 20;
  const adjustedStart = currentLevel - range;
  const adjustedEnd = currentLevel + range;

  // const dropDownChange = (event) => {
  //   const selectedValue = event.target.value;
  //   if (selectedValue === "5") {
  //     setCheckFive(false);
  //   } else if (selectedValue === "15") {
  //     setCheckFive(true);
  //   }
  // };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h1 className="table-title">Change in OI</h1>
      {/* <label>
        Strikes above/below ATM
        <select onChange={dropDownChange}>
          <option value="5">5</option>
          <option value="15">15</option>
        </select>
      </label> */}
      <ResponsiveContainer width="100%" height="110%">
        <ComposedChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
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
          <Brush dataKey="created_at" height={30} stroke="#0A3D62" reversed={true} tickFormatter={(value) => new Date(value).toISOString().split('T')[0]} />
          {checkFive ? (
            <>
              <Bar
                yAxisId="left"
                name="coi difference"
                dataKey="call_oi_difference"
                fill="#E96767"
              />
              <Bar
                yAxisId="left"
                name="poi difference "
                dataKey="put_oi_difference"
                fill="#63D168"
              />
            </>
          ) : (
            <>
              <Bar
                yAxisId="left"
                name="coi difference"
                dataKey="large_call_oi_difference"
                fill="#E96767"
              />
              <Bar
                yAxisId="left"
                name="poi difference "
                dataKey="large_put_oi_difference"
                fill="#63D168"
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
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChangeOIGraph;

"use client";
import React,{useState} from "react";
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
  const { data } = useActiveOiData();
  const dataReversed = data.slice(0).reverse();
  const [checkFive,setCheckFive] = useState(false);

  const maxLiveNifty = Math.max(...dataReversed.map((item) => item.live_nifty));

  const currentLevel = maxLiveNifty;
  const range = 20;
  const adjustedStart = currentLevel - range;
  const adjustedEnd = currentLevel + range;

  const dropDownChange = (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "5") {
      setCheckFive(false);
    } else if (selectedValue === "15") {
      setCheckFive(true);
    }
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h1 className="table-title">Call vs Put OI</h1>
      <label>
        Strikes above/below ATM
        <select onChange={dropDownChange}>
          <option value="5">5</option>
          <option value="15">15</option>
        </select>
      </label>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={500}
          height={300}
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
          <YAxis yAxisId="left" />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[adjustedStart, adjustedEnd]}
            hide
          />
          <Tooltip  labelFormatter={(timeStr) =>
    new Date(timeStr).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  } />
          <Legend />
          {checkFive ? (
            <>
              <Line
                yAxisId="left"
                type="monotone"
                name="call oi"
                dataKey="call_oi_difference"
                stroke="#8FCE00"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                name="put oi"
                dataKey="put_oi_difference"
                stroke="#CC3333"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </>
          ) : (
            <>
              <Line
                yAxisId="left"
                name="call oi difference"
                type="monotone"
                dataKey="large_call_oi_difference"
                stroke="#8FCE00"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                name="put oi difference"
                type="monotone"
                dataKey="large_put_oi_difference"
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
          <Brush dataKey="created_at" height={30} stroke="#8884d8" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CallVsPutGraph;

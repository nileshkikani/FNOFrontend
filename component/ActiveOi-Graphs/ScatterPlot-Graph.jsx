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
  const { data } = useActiveOiData();
  const [checkFive, setCheckFive] = useState(false);

  const dataReversed = data.slice(0).reverse();
  //--reverse time from start to end format
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
      <h1 className="table-title">PCR</h1>
      <label>
        Strikes above/below ATM
        <select onChange={dropDownChange}>
          <option value="5">5</option>
          <option value="15">15</option>
        </select>
      </label>
      <ResponsiveContainer width="100%" height="110%">
        <LineChart
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
          <Tooltip
            labelFormatter={(timeStr) =>
              new Date(timeStr).toLocaleTimeString([], {
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
          <Brush dataKey="created_at" height={30} stroke="#0A3D62" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlotGraph;

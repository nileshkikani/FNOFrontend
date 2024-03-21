import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import useActiveOiData from "@/hooks/useActiveOiData";

const ScatterPlotGraph = () => {
  const { data } = useActiveOiData();

  const dataReversed = data.slice(0).reverse();
  //--reverse time from start to end format

  return (
    <>
      <div>
        <h1 className="table-title">PCR vs STRIKE</h1>
        <ScatterChart
          width={900}
          height={500}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid />
          <XAxis
            dataKey="created_at"
            tickFormatter={(timeStr) =>
              new Date(timeStr).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            }
          />
          <YAxis type="number" dataKey="pcr" />
          {/* <YAxis type="number" dataKey="strike_price" /> */}
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend />
          <Scatter name="pcr" data={dataReversed} fill="#8884d8" line />
          {/* <Scatter
            name="strike_price"
            data={data}
            fill="#82ca9d"
            line
            shape="diamond"
          /> */}
        </ScatterChart>
      </div>
    </>
  );
};

export default ScatterPlotGraph;

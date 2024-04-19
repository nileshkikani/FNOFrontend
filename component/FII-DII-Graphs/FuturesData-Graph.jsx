import React from "react";
// import useFutureData from "@/hooks/useFutureData";
import {
  // BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import useFiiDiiData from "@/hooks/useFiiDiiData";

const FuturesDataGraph = () => {
  const { filteredClientData } = useFiiDiiData();

  const sortedData = filteredClientData.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedData.map(item => ({
    ...item,
    future_index_difference: item.future_index_long && item.future_index_short
      ? item.future_index_long - item.future_index_short
      : null
  }));

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h1 className="table-title">INDEX FUTURE OI</h1>
      <ResponsiveContainer width="100%" height="110%">
        <ComposedChart
          width={500}
          height={400}
          data={chartData}
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
              new Date(timeStr)
                .toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                })
                .replace(/\d{4}/, "")
            }
          />
          <YAxis />
          {/* <YAxis
          yAxisId="right"
          orientation="right"
          domain={[adjustedStart, adjustedEnd]}
          hide
        /> */}
          <Tooltip
          // labelFormatter={(timeStr) =>
          //   new Date(timeStr).toLocaleTimeString([], {
          //     hour: "2-digit",
          //     minute: "2-digit",
          //   })
          // }
          />
          <Legend />
          {/* <Bar
            name="future long"
            dataKey="future_index_long"
            fill="#b3c6ff"
            activeDot={{ r: 8 }}
          /> */}
          <Bar
            name="future difference"
            dataKey="future_index_difference"
            fill="#33A3E3"
            activeDot={{ r: 8 }}
          />
          {/* <Bar
          yAxisId="left"
          name="call oi"
          dataKey="option_index_call_long"
          fill="#8FCE00"
          activeDot={{ r: 8 }}
        />
        <Bar
          yAxisId="left"
          name="put oi"
          dataKey="option_index_put_long"
          fill="#CC3333"
          activeDot={{ r: 8 }}
        /> */}
          {/* <Line
          name="NIFTY"
          type="linear"
          dataKey="live_nifty"
          stroke="#f55abe"
          strokeDasharray="6 2"
          strokeWidth={2}
          dot={false}
        /> */}
          <Brush dataKey="date" height={30} stroke="#0A3D62" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FuturesDataGraph;

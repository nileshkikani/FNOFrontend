import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  Brush,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "bing", value: -10.166 },
  { name: "facebook words", value: 0.0441 },
  { name: "adwords", value: 0.029702 },
];

const ActiveMoneyFlow = () => (
  <>
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={500}
        height={300}
        data={data}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickFormatter={(timeStr) =>
            new Date(timeStr).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          }
        />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip />
        <Legend />
        <Bar
          yAxisId="left"
          name="call oi difference"
          type="monotone"
          dataKey="large_call_oi_difference"
          stroke="#8FCE00"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Bar
          yAxisId="left"
          name="put oi difference"
          type="monotone"
          dataKey="large_put_oi_difference"
          activeDot={{ r: 8 }}
          strokeWidth={2}
          stroke="#CC3333"
        />
        <Bar
          yAxisId="right"
          name="NIFTY"
          type="Barar"
          dataKey="live_nifty"
          stroke="#f55abe"
          strokeDasharray="6 2"
          strokeWidth={2}
          dot={false}
        />
        <Brush dataKey="created_at" height={30} stroke="#8884d8" />
      </ComposedChart>
    </ResponsiveContainer>
  </>
);

export default ActiveMoneyFlow;

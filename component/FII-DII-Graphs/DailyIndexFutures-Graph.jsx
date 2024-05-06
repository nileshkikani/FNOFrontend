import React, { useState, useEffect } from "react";
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

const DailyIndexFutures = () => {
  const { filteredClientData } = useFiiDiiData();
  const [yAxisDomain, setYAxisDomain] = useState([0, 100]); // Initial domain for Y-axis

  useEffect(() => {
    // Calculate minimum and maximum values of the data
    const values = filteredClientData.map((item) => item.daily_dif_future_index);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    // Set the Y-axis domain based on the minimum and maximum values
    setYAxisDomain([minValue, maxValue]);
  }, [filteredClientData]);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h1 className="table-title">DAILY INDEX FUTURES</h1>
      <ResponsiveContainer width="100%" height="110%">
        <ComposedChart
          width={500}
          height={400}
          data={filteredClientData}
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
          <YAxis domain={yAxisDomain} /> {/* Set Y-axis domain */}
          <Tooltip />
          <Legend />
          <Bar
            name="Index Futures"
            dataKey="daily_dif_future_index"
            fill="#6d67e4"
            activeDot={{ r: 8 }}
          />
          <Brush dataKey="date" height={30} stroke="#0A3D62" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyIndexFutures;

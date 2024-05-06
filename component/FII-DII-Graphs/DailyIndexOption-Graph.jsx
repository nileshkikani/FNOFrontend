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

const DailyIndexOption = () => {
  const { filteredClientData } = useFiiDiiData();
  const [yAxisDomain, setYAxisDomain] = useState([0, 100]); // Initial domain for Y-axis

  useEffect(() => {
    // Calculate minimum and maximum values of the data
    const callOiValues = filteredClientData.map((item) => item.daily_dif_index_call);
    const putOiValues = filteredClientData.map((item) => item.daily_dif_index_put);
    const allValues = callOiValues.concat(putOiValues);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    // Set the Y-axis domain based on the minimum and maximum values
    setYAxisDomain([minValue, maxValue]);
  }, [filteredClientData]);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h1 className="table-title">DAILY INDEX OPTION</h1>
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
            name="call oi"
            dataKey="daily_dif_index_call"
            fill="#63D168"
            activeDot={{ r: 8 }}
          />
          <Bar   
            name="put oi"
            dataKey="daily_dif_index_put"
            fill="#E96767"
            activeDot={{ r: 8 }}
          />
          <Brush dataKey="date" height={30} stroke="#0A3D62" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyIndexOption;

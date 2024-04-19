import React from "react";
import useFiiDiiData from "@/hooks/useFiiDiiData";

const OptionCallData = () => {
  const { filteredClientData } = useFiiDiiData();

  const chartData = filteredClientData.map(item => ({
    ...item,
    option_index_difference: item.option_index_long && item.option_index_short
    ? item.option_index_long - item.option_index_short
    : null
  }));

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h1 className="table-title">OPTION INDEX</h1>
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
            // tickFormatter={(timeStr) =>
            //   new Date(timeStr).toLocaleTimeString([], {
            //     hour: "2-digit",
            //     minute: "2-digit",
            //   })
            // }
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
          <Bar
            name="call"
            dataKey="option_index_difference"
            fill="#8FCE00"
            activeDot={{ r: 8 }}
          />
          {/* <Bar   
              name="put oi"
              dataKey="option_index_put_long"
              fill="#CC3333"
              activeDot={{ r: 8 }}
            /> */}
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

export default OptionCallData;

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

import useMultiStrikeData from "@/hooks/useMultiStrikeData";

const NiftyFuturesClosePrice = () => {
  const { data, selectedStrikes } = useMultiStrikeData();

  // const CE = [];
  // const PE = [];
  // const timeStamp = [];
  //   const lastData = Object.keys(data);
  //   lastData.forEach((itm)=>{
  //     if(itm.slice(-2) === 'CE'){
  //         CE.push(itm);
  //       }else if(itm.slice(-2)==='PE'){
  //         PE.push(itm);
  //       }else{
  //         timeStamp.push(itm);
  //       }
  //   })

  // console.log("selected strike isssss,", selectedStrikes);
  // console.log("gggggggggggggg,", data);

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h1 className="table-title">Multi Strike</h1>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
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
          {selectedStrikes.map((itm) => (
            <>
              <Line
                type="monotone"
                dataKey="call_net_oi"
                stroke="#8FCE00"
                yAxisId="right"
              />
              <Line
                type="monotone"
                dataKey="put_net_oi"
                stroke="#CC3333"
                yAxisId="left"
              />
            </>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NiftyFuturesClosePrice;

'use client';
import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';

//--------------------------FUNCTION TO MODIFY TIME(ADDING ORIGINAL_TIME KEY)----------------
const modifyTime = (dataArray) => {
  return (
    dataArray &&
    dataArray.map((item) => {
      const date = new Date(item.created_at);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;
      return {
        ...item,
        original_time: time
      };
    })
  );
};

//------------------------FUNCTION TO GROUP AND SUM DATA----------------
const groupAndSum = (dataArray) => {
  return dataArray.reduce((acc, item) => {
    if (!acc[item.original_time]) {
      acc[item.original_time] = {
        original_time: item.original_time,
        call_decay: 0,
        put_decay: 0,
        total_call_decay: 0,
        total_put_decay: 0
      };
    }
    acc[item.original_time].call_decay += item.call_decay || 0;
    acc[item.original_time].put_decay += item.put_decay || 0;
    acc[item.original_time].total_call_decay += item.total_call_decay || 0;
    acc[item.original_time].total_put_decay += item.total_put_decay || 0;
    return acc;
  }, {});
};
const formatNumber = (value) => (typeof value === 'number' ? value.toFixed(2) : value);
// -----------------------CUSTOM TOOLTIP-----------------------
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
          {payload.map((entry, index) => {
            // Determine the color based on the data key
            const color = entry.dataKey === 'total_put_decay' ? '#E96767' : 
                          entry.dataKey === 'total_call_decay' ? '#63D168' : '#000';

            return (
              <div key={`item-${index}`} style={{ color: color, marginBottom: '5px' }}>
                <strong>{entry.name}:</strong> {formatNumber(entry.value)}
              </div>
            );
          })}
        </div>
    );
  }
  return null;
};

const PremiumDecayArea = ({ data, isChecked }) => {
  const [fullFinalData, setFullFinalData] = useState([]);

  useEffect(() => {
    const filteredByStrike = data && data.filter((sp) => isChecked.includes(sp.strike_price)).flatMap((i) => i.data);

    const modifiedData = modifyTime(filteredByStrike);

    if (data && data.length > 2) {
      const groupedAndSummed = groupAndSum(modifiedData);
      setFullFinalData(Object.values(groupedAndSummed));
    } else {
      setFullFinalData(modifiedData);
    }
  }, [data, isChecked]);



  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart
        data={fullFinalData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}
      >
        <defs>
          <linearGradient id="gradPutDecay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E96767" stopOpacity={1} />
            <stop offset="100%" stopColor="#E96767" stopOpacity={1} />
          </linearGradient>
          <linearGradient id="gradCallDecay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#63D168" stopOpacity={1} />
            <stop offset="100%" stopColor="#63D168" stopOpacity={1} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="original_time" />
        <YAxis yAxisId="left" />
        <RechartsTooltip content={<CustomTooltip />} />

        <Area
          yAxisId="left"
          type="monotone"
          name="Total Put Decay"
          dataKey="total_put_decay"
          fill="url(#gradPutDecay)"
        />
        <Area
          yAxisId="left"
          type="monotone"
          name="Total Call Decay"
          dataKey="total_call_decay"
          fill="url(#gradCallDecay)"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default PremiumDecayArea;

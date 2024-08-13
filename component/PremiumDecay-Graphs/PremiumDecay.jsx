'use client';
import React, { useState, useEffect } from 'react';
//import { AreaChart,Bar,linearGradient,ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar
} from 'recharts';

//--------------------------FUNCTION TO MODIFY TIME(ADDING ORIGINAL_TIME KEY)----------------
const modifyTime = (dataArray) => {
  return dataArray && dataArray.map(item => {
    const date = new Date(item.created_at);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const time = `${hours}:${minutes}`;
    return {
      ...item,
      original_time: time,
    };
  });
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

const PremiumDecayChart = ({ data, isChecked }) => {
  const [fullFinalData, setFullFinalData] = useState([]);

  useEffect(() => {
    const filteredByStrike = data && data
      .filter(sp => isChecked.includes(sp.strike_price))
      .flatMap(i => i.data);

    const modifiedData = modifyTime(filteredByStrike);

    if (data && data.length > 2) {
      const groupedAndSummed = groupAndSum(modifiedData);
      setFullFinalData(Object.values(groupedAndSummed));
    } else {
      setFullFinalData(modifiedData);
    }
  }, [data, isChecked]);

  const formatNumber = (value) => (typeof value === 'number' ? value.toFixed(2) : value);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={fullFinalData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="original_time" />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip formatter={formatNumber} />
        <Legend />
        <Line
          yAxisId="right"
          type="linear"
          dataKey="total_call_decay"
          name="Total Call Decay"
          stroke="#63D168"
          dot={false}
        />
        <Line
          yAxisId="right"
          type="linear"
          dataKey="total_put_decay"
          name="Total Put Decay"
          stroke="#E96767"
          dot={false}
        />
        <Bar yAxisId="left" dataKey="call_decay" name="Call Decay" fill="#63D168" />
        <Bar yAxisId="left" dataKey="put_decay" name="Put Decay" fill="#E96767" />
      </ComposedChart>
    </ResponsiveContainer>
    
  );
};

export default PremiumDecayChart;

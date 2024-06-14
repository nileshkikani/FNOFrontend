'use client';
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PremiumDecayChart = ({ strike1, strike2, strike3, strike4, strike5 }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const aggregatedData = {};

    const strikes = [strike1, strike2, strike3, strike4, strike5];
    strikes.forEach(strike => {
      if (strike && strike.length > 0) {
        strike.forEach(item => {
          const key = item.created_at; 
          if (aggregatedData[key]) {
   
            aggregatedData[key].call_decay = (aggregatedData[key].call_decay || 0) + (item.call_decay || 0);
            aggregatedData[key].put_decay = (aggregatedData[key].put_decay || 0) + (item.put_decay || 0);
          } else {
            aggregatedData[key] = { ...item };
          }
        });
      }
    });
  

    const aggregatedDataArray = Object.keys(aggregatedData).map(key => aggregatedData[key]);
  

    aggregatedDataArray.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  
    setData(aggregatedDataArray);
  }, [strike1, strike2, strike3, strike4, strike5]);
  

  // console.log('yup',data)

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="created_at"
          tickFormatter={(timeStr) =>
            new Date(timeStr).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })
          }
        />
        <YAxis />
        <Tooltip
          labelFormatter={(timeStr) =>
            new Date(timeStr).toLocaleTimeString([], {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }
        />
        <Legend />
        <Line type="monotone" dataKey="call_decay" name="CALL" stroke="#63D168" />
        <Line type="monotone" dataKey="put_decay" name="PUT" stroke="#E96767" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PremiumDecayChart;

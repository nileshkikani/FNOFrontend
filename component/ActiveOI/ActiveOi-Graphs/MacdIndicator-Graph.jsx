'use client';
import React, { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axios';
import { useAppSelector } from '@/store';
// import axios from 'axios';
import {
  ComposedChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const MacdIndicator = () => {
  const [data, setData] = useState([]);
  const [minMACDh, setMinMACDh] = useState(0);
  const [maxMACDh, setMaxMACDh] = useState(0);
  const authState = useAppSelector((state) => state.auth.authState);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('moneyflow/buy-sell-signals/',{
          headers: { Authorization: `Bearer ${authState.access}` }
        });
    
        const processedData =
        response.data?.map((item) => ({
          ...item,
          bar_value: Math.abs(item.MACDh_12_26_9),
          fill: item.MACDh_12_26_9 < 0 ? '#E96767' : '#63D168',
          bar_value: item.MACDh_12_26_9
        }));

        const min = Math.min(processedData.map((item) => item.MACDh_12_26_9));
        const max = Math.max(processedData.map((item) => item.MACDh_12_26_9));
        setMinMACDh(min);
        setMaxMACDh(max);
        setData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <h1 className="table-title">MACD indicator</h1>
      <ResponsiveContainer width="100%" height="100%">
        {data && (
          <ComposedChart width={800} height={400} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid stroke="#E5E5E5" />
            <XAxis
              dataKey="Date"
              tickFormatter={(timeStr) =>
                new Date(timeStr).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
            />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
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
            <Line yAxisId="left" type="smooth" name="MACD s" dataKey="MACDs_12_26_9" stroke="purple" dot={false} />
            <Line yAxisId="left" type="smooth" name="MACD" dataKey="MACD_12_26_9" stroke="orange" dot={false} />
            <Bar
              yAxisId="right"
              type="linear"
              name="MACD high"
              dataKey="bar_value"
              fill={({ fill }) => fill}
            />
          </ComposedChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default MacdIndicator;

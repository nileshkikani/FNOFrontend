'use client';
import { API_ROUTER } from '@/services/apiRouter';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import { useAppSelector } from '@/store';
import { XAxis, ComposedChart, Line, ResponsiveContainer, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Page = () => {
  const [data, setData] = useState([]);
  const authState = useAppSelector((state) => state.auth.authState);

  const getDailyFiiDiiData = () => {
    try {
      const response = axiosInstance.get(API_ROUTER.DAILY_FII_DII_DATA, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      console.log('rrrs', response);
      setData(response.data);
    } catch (error) {
      console.log('error getting fii-dii daily data:', err);
    }
  };

  useEffect(() => {
    getDailyFiiDiiData();
  }, []);
  console.log('uuu', data);
  return (
    <>
    {/* ---------chart----------- */}
      <div style={{ width: '100%', height: '400px' }}>
        <h1 className="table-title">Call vs Put OI</h1>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
            // syncId="change_oi_brush"
          >
            <CartesianGrid stroke="#E5E5E5" />
            <XAxis
              dataKey="created_at"
              tickFormatter={(timeStr) =>
                new Date(timeStr).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
            />
            <YAxis yAxisId="left" />
            <YAxis
              yAxisId="right"
              orientation="right"
              // domain={[adjustedNiftyStart, adjustedNiftyEnd]}
              hide
            />
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
            <Bar
              yAxisId="left"
              name="FII"
              // type="monotone"
              // dataKey="large_ce_oi"
              fill="#6c6290"
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
            <Bar
              yAxisId="right"
              name="DII"
              // type="linear"
              // dataKey="live_nifty"
              fill="#33a3e3"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* -------------data table-------- */}
    </>
  );
};

export default Page;

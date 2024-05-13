'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from "@/utils/axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ComposedChart, LabelList, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSearchParams } from 'next/navigation';
import { API_ROUTER } from '@/services/apiRouter';
import { useAppSelector } from "@/store";

const Page = () => {
  const searchParams = useSearchParams();
  const stockName = searchParams.get('symbol');
  const [responseData, setResponseData] = useState([]);
  const authState = useAppSelector((state) => state.auth.authState);

  const getSelectedStockData = async () => {
    console.log('inside the graph calling-=-=-=-');
    try {
      const response = await axiosInstance.get(
        `${API_ROUTER.LIST_SECWISE_DATE}?symbol=${stockName}`,
        {
          headers: { Authorization: `Bearer ${authState.access}` }
        }
      );
      console.log('resp+data from apii+++', response.data);
      setResponseData(response.data);
    } catch (err) {
      console.log('error getting selected stock data', err);
    }
  };
  

  useEffect(() => {
      getSelectedStockData(); 
  }, []);

  return (
    <div>
      <ResponsiveContainer minHeight={1800} width="100%">
        <ComposedChart
          layout="vertical"
          width={500}
          height={300}
          data={responseData}
          margin={{
            top: 20,
            right: 30,
            left: 50,
            bottom: 5
          }}
        >
          <XAxis type="number" />
          <YAxis dataKey="date" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="deliverable_qty" fill="#83aaf1" stackId="a" name="deliverable qty" />
          <Bar dataKey="total_traded_quantity" fill="#d8e4fa" stackId="a" name="traded quantity">
            <LabelList dataKey="dly_qt_to_traded_qty" />
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Page;

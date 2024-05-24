'use client';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  LabelList,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useParams} from 'next/navigation';
import { API_ROUTER } from '@/services/apiRouter';
import { useAppSelector } from '@/store';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';

const Page = () => {
  const {selectedsecurity} = useParams();
  const [responseData, setResponseData] = useState([]);
  const authState = useAppSelector((state) => state.auth.authState);
  const router = useRouter();

  const getSelectedStockData = async () => {
    try {
      const response = await axiosInstance.get(`${API_ROUTER.LIST_SECWISE_DATE}?symbol=${selectedsecurity}`, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      console.log('resp+data from apii+++', response.data);
      setResponseData(response.data);
    } catch (err) {
      console.log('error getting selected stock data', err);
    }
  };

  const handleBack = () => {
    router.push('/securitywise');
  };
  useEffect(() => {
    selectedsecurity && getSelectedStockData();
  }, [selectedsecurity]);
  const chartHeight = Math.max(300, responseData.length * 30);
  return (
    <>
      <div
        onClick={handleBack}
        style={{
          cursor: 'pointer',
          display: 'inline-block',
          padding: '10px',
          borderRadius: '50%',
          backgroundColor: '#f0f0f0',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s ease',
          marginLeft: '10px',
          marginTop: '10px'
        }}
      >
        <IoMdArrowRoundBack size={20} />
      </div>
      <div>
        <ResponsiveContainer minHeight={chartHeight} width="100%">
          <ComposedChart
            layout="vertical"
            width={500}
            height={300}
            data={responseData}
            margin={{
              top: 5,
              right: 30,
              left: 50,
              bottom: 5
            }}
          >
            <XAxis type="number" orientation="top" />
            <YAxis dataKey="date" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="deliverable_qty" fill="#83aaf1" stackId="a" name="deliverable qty" />
            <Bar dataKey="total_traded_quantity" fill="#d8e4fa" stackId="a" name="traded quantity">
              <LabelList dataKey="dly_qt_to_traded_qty" label={{ position: 'right' }} />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default Page;

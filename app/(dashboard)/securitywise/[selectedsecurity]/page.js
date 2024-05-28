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
import { useParams } from 'next/navigation';
import { API_ROUTER } from '@/services/apiRouter';
import { useAppSelector } from '@/store';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import DeliveryChart from '@/component/SecurityWise/DeliveryChart';
import DataTable from 'react-data-table-component';

import '../../securitywise/global.css';
import moment from 'moment';
import dynamic from 'next/dynamic';

const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

const Page = () => {
  const { selectedsecurity } = useParams();
  const [responseData, setResponseData] = useState([]);
  const authState = useAppSelector((state) => state.auth.authState);
  const router = useRouter();
  const [deliveryChartData, setDeliveryChartData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  // const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

  const getSelectedStockData = async () => {
    try {
      const response = await axiosInstance.get(`${API_ROUTER.LIST_SECWISE_DATE}?symbol=${selectedsecurity}`, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      console.log('response', response.data);
      setResponseData(response.data);
      const cData = processData(response.data);
      const monthlyData = response.data.map((item, index) => {
        const tradedVolume = item.total_traded_quantity;
        const deliveryVolume = item.deliverable_qty;
        const priceChange = ((item?.close_price - item?.prev_close) / item?.prev_close) * 100;
        const avgTradedVolume = item?.average_traded_quantity;
        const avgDeliveryVolume = item?.average_delivery_quantity;
        const deliveryPercent = (deliveryVolume / tradedVolume) * 100;
        const avgDeliveryPercent = (avgDeliveryVolume / avgTradedVolume) * 100;
        console.log(
          'avgDeliveryPercent',
          avgDeliveryPercent,
          'deliveryPercent',
          deliveryPercent,
          'priceChange',
          priceChange
        );
        let insight = {};
        if (deliveryPercent > avgDeliveryPercent && priceChange > 0) {
          insight.value = 'Jump in delivery with rise in price';
          insight.color = '#006aff';
        } else if (deliveryPercent > avgDeliveryPercent && priceChange <= 0) {
          insight.value = 'Jump in delivery';
          insight.color = '#00a25b';
        } else if (deliveryPercent < avgDeliveryPercent && priceChange < 0) {
          insight.value = 'Falling delivery with fall in price';
          insight.color = '#fc5a5a';
        } else if (deliveryPercent < avgDeliveryPercent && priceChange > 0) {
          insight.value = 'Falling delivery with rise in price';
          insight.color = '#006aff';
        } else if (deliveryPercent < avgDeliveryPercent) {
          insight.value = 'Falling delivery';
          insight.color = '#fc5a5a';
        } else if (deliveryPercent > avgDeliveryPercent && priceChange < 0) {
          insight.value = 'Rising delivery with fall in price';
          insight.color = '#fc5a5a';
        } else if (deliveryPercent > avgDeliveryPercent && priceChange > 0) {
          insight.value = 'Rising delivery with rise in price';
          insight.color = '#00a25b';
        } else if (deliveryPercent > avgDeliveryPercent) {
          insight.value = 'Rising delivery';
          insight.color = '#00a25b';
        } else if (priceChange > 0) {
          insight.value = 'Drop in delivery with rise in price';
          insight.color = '#006aff';
        } else {
          insight.value = 'Drop in delivery';
          insight.color = '#fc5a5a';
        }

        return { ...item, ...{ priceChange: priceChange.toFixed(2), insight } };
      });
      console.log('monthlyData----', monthlyData);
      // const insights = await calculateInsights(monthlyData);
      // console.log('insights', insights);
      const last30Days = monthlyData.slice(0, 30);

      setMonthlyData(last30Days);
      setDeliveryChartData(cData);
    } catch (err) {
      console.log('error getting selected stock data', err);
    }
  };

  const column = [
    {
      name: <span className="table-heading">{'DATE'}</span>,
      selector: (row) => +row.date,

      // cell: (row) => <span className="link">{''}</span>,
      format: (row) => {
        // console.log('row', row);
        return <span className="secwise-cols">{moment(row?.date).format("DD MMM 'YY")}</span>;
      }
      // sortable: true
    },
    {
      name: <span className="table-heading">{"COMBINED TRADED VOLUME('000)"}</span>,
      selector: (row) => +row.total_traded_quantity,
      format: (row) => (
        <span className="secwise-cols">{(+(row.total_traded_quantity / 1000).toFixed(2)).toLocaleString('en-IN')}</span>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading">{"COMBINED DELIVERY VOLUME('000)"}</span>,
      selector: (row) => +row.deliverable_qty,
      format: (row) => (
        <span className="secwise-cols">{(+(row.deliverable_qty / 1000).toFixed(2)).toLocaleString('en-IN')}</span>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading">{'DELIVERY %'}</span>,
      selector: (row) => +row.dly_qt_to_traded_qty,
      format: (row) => <span className="secwise-cols">{row?.dly_qt_to_traded_qty}</span>,
      sortable: true
    },
    {
      name: <span className="table-heading">{'PRICE CHANGE %'}</span>,
      selector: (row) => +((row?.close_price - row?.prev_close) / row?.prev_close) * 100,
      format: (row) => {
        const difference = ((row?.close_price - row?.prev_close) / row?.prev_close) * 100;
        return difference > 0 ? (
          <span className="column-green-text">{difference.toFixed(2)}%</span>
        ) : (
          <span className="column-red-text">{`${difference.toFixed(2)}%`}</span>
        );
      },
      sortable: true
    },
    {
      name: <span className="table-heading">{'INSIGHT (VS WEEKLY AVG)'}</span>,
      selector: (row) => +((row?.average_delivery_quantity / row?.average_traded_quantity) * 100),
      format: (row) => {
        // const difference = row?.last_price - row?.prev_close;
        const insight = row?.insight;
        return (
          <div className="insight-div">
            <span style={{ color: insight?.color }} className="insight-text">
              {insight && insight?.value?.length > 16 ? (
                <span>
                  {insight?.value?.substring(0, 16)}
                  <br />
                  <span className="text-sm text-gray-500">{insight?.value?.substring(16)}</span>
                </span>
              ) : (
                <span>{insight?.value}</span>
              )}
            </span>
          </div>
        );
      },
      sortable: true
    },
    {
      name: <span className="table-heading">{"COMBINED ROLLING WEEK AVG. VOLUME('000)"}</span>,
      selector: (row) => +row.average_traded_quantity,
      format: (row) => (
        <span className="secwise-cols">
          {(+(row.average_traded_quantity / 1000).toFixed(2)).toLocaleString('en-IN')}
        </span>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading">{'ROLLING WEEK DELIVERY %'}</span>,
      selector: (row) => +((row?.average_delivery_quantity / row?.average_traded_quantity) * 100),
      format: (row) => (
        <span className="secwise-cols">
          {(+((row?.average_delivery_quantity / row?.average_traded_quantity) * 100).toFixed(2)).toLocaleString(
            'en-IN'
          )}
        </span>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading">{'CLOSE PRICE'}</span>,
      selector: (row) => +row?.close_price,
      format: (row) => (
        <span>
          <span className="secwise-cols">{(+row.close_price).toLocaleString('en-IN')}</span>
        </span>
      ),

      sortable: true
    }
  ];

  const processData = (data) => {
    const last30Days = data.slice(0, 30);
    const sortedData = last30Days.sort((a, b) => new Date(a.date) - new Date(b.date));
    const dates = sortedData.map((item) => moment(item.date).format('DD-MMM'));
    const tradedVolume = sortedData.map((item) => item.total_traded_quantity);
    const deliveryVolume = sortedData.map((item) => item.deliverable_qty);
    const deliveryVolumePercentage = sortedData.map((item) =>
      parseFloat((item.deliverable_qty / item.total_traded_quantity) * 100)
    );

    return { dates, tradedVolume, deliveryVolume, deliveryVolumePercentage };
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
      <div className="div-container">
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
        <h1 className="head-title">
          <span className="title-text">{`${selectedsecurity} -`}</span>
          <span className="title-delivery-text">Delivery Percentage and Volume Analysis</span>
        </h1>
      </div>
      <div className="chart-div">
        <DeliveryChart data={deliveryChartData} />
      </div>
      <div className="main-div">
        <div className="table-main-div">
          <DataTable
            columns={column}
            data={monthlyData}
            noDataComponent={
              <div style={{ textAlign: 'center' }}>
                <PropagateLoader />
              </div>
            }
            fixedHeader={{ top: true }}
          />
        </div>
      </div>
    </>
  );
};

export default Page;

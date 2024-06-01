'use client';
import React, { useEffect, useRef, useState } from 'react';
import useSecurityWiseData from '@/hooks/useSecurityWiseData';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import DataTable from 'react-data-table-component';
import '../securitywise/global.css';
import DeliveryChart from '@/component/SecurityWise/DeliveryChart';
import { useRouter } from 'next/navigation';

//  ===========LOADING ANIMATION ===========
const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

export default function Page() {
  const { setDropdownDate, data, uniqueDates, getData, showNiftyStocksOnly, isLoading, currentSelectedDate, hasMore } =
    useSecurityWiseData();
  const route = useRouter();
  const [isFilterData, setIsFilterData] = useState(false);
  const [securityData, setSecurityData] = useState([]);
  const [sData, setSData] = useState([]);
  // Current page index

  const loader = useRef(null);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log('data.map', data);
    setData(data);
    setSData(data);
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setPage((prevPage) => prevPage + 1);
          console.log('sData', sData);
          getData(currentSelectedDate, page + 1, sData);
        }
      },
      { threshold: 0.5 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader.current, hasMore, isLoading]);

  const setData = async (data) => {
    const dataArray = await Promise.all(
      data.map(async (item, index) => {
        const tradedVolume = item.total_traded_quantity;
        const deliveryVolume = item.deliverable_qty;
        const priceChange = ((item.close_price - item.prev_close) / item.prev_close) * 100;
        const avgTradedVolume = item.average_traded_quantity;
        const avgDeliveryVolume = item.average_delivery_quantity;
        const deliveryPercent = (deliveryVolume / tradedVolume) * 100;
        const avgDeliveryPercent = (avgDeliveryVolume / avgTradedVolume) * 100;

        const insight = await getInsight(deliveryPercent, avgDeliveryPercent, priceChange);
        return { ...item, priceChange: priceChange.toFixed(2), insight };
      })
    );
    const dataset = (await Promise.resolve(dataArray)).sort((a, b) => b.times_delivery - a.times_delivery);
    console.log('dataset', dataset);

    setSecurityData(dataset);
    setIsFilterData(true);
  };

  async function getInsight(deliveryPercent, avgDeliveryPercent, priceChange) {
    let insight = {};
    let someThreshold = 10;
    if (deliveryPercent > avgDeliveryPercent) {
      if (priceChange > 0) {
        if (deliveryPercent - avgDeliveryPercent > someThreshold) {
          insight.value = 'Jump in delivery with rise in price';
          insight.color = '#006aff';
          insight.bgcolor = '#bcdfeb19';
        } else {
          insight.value = 'Rising delivery with rise in price';
          insight.color = '#00a25b';
          insight.bgcolor = '#00a25b33';
        }
      } else if (priceChange < 0) {
        insight.value = 'Rising delivery with fall in price';
        insight.color = '#006aff';
        insight.bgcolor = '#bcdfeb19';
      } else {
        if (deliveryPercent - avgDeliveryPercent > someThreshold) {
          insight.value = 'Jump in delivery';
          insight.color = '#00a25b';
          insight.bgcolor = '#00a25b33';
        } else {
          insight.value = 'Rising delivery';
          insight.color = '#00a25b';
          insight.bgcolor = '#00a25b33';
        }
      }
    } else if (deliveryPercent < avgDeliveryPercent) {
      if (priceChange > 0) {
        if (avgDeliveryPercent - deliveryPercent > someThreshold) {
          insight.value = 'Drop in delivery with rise in price';
          insight.color = '#006aff';
          insight.bgcolor = '#bcdfeb19';
        } else {
          insight.value = 'Falling delivery with rise in price';
          insight.color = '#006aff';
          insight.bgcolor = '#bcdfeb19';
        }
      } else if (priceChange < 0) {
        if (avgDeliveryPercent - deliveryPercent > someThreshold) {
          insight.value = 'Drop in delivery with fall in price';
          insight.color = '#fc5a5a';

          insight.bgcolor = '#fc5a5a19';
        } else {
          insight.value = 'Falling delivery with fall in price';
          insight.color = '#fc5a5a';
          insight.bgcolor = '#fc5a5a19';
        }
      } else {
        if (avgDeliveryPercent - deliveryPercent > someThreshold) {
          insight.value = 'Drop in delivery';
          insight.color = '#fc5a5a';
          insight.bgcolor = '#fc5a5a19';
        } else {
          insight.value = 'Falling delivery';
          insight.color = '#fc5a5a';
          insight.bgcolor = '#fc5a5a19';
        }
      }
    }

    return insight;
  }

  const processData = (data) => {
    const dates = data.map((item) => item.date);
    const tradedVolume = data.map((item) => item.total_traded_quantity);
    const deliveryVolume = data.map((item) => item.deliverable_qty);
    const deliveryVolumePercentage = data.map((item) => parseFloat(item.dly_qt_to_traded_qty));

    return { dates, tradedVolume, deliveryVolume, deliveryVolumePercentage };
  };

  const routerRedirect = (aPath) => {
    route.push(`/securitywise/${aPath}/`);
  };

  const loadingAnimation = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh'
      }}
    >
      <PropagateLoader color="#33a3e3" loading={true} size={15} />
    </div>
  );

  const column = [
    {
      name: <span className="table-heading-text">Symbol</span>,
      selector: (row) => row.symbol,
      cell: (row) => (
        <span onClick={() => routerRedirect(row?.symbol)} className="link">
          {row?.symbol}
        </span>
      ),
      format: (row) => <span className="secwise-cols">{+row.symbol}</span>
      // sortable: true
    },
    {
      name: <span className="table-heading-text">{'Delivered Qty'}</span>,
      selector: (row) => +row.times_delivery,
      format: (row) => (
        <span className="secwise-cols">
          {(+row.deliverable_qty).toLocaleString('en-IN')} <br /> <span className="green">{row.times_delivery}x</span>
        </span>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'Avg Delivered Qty'}</span>,
      selector: (row) => +row.average_delivery_quantity,
      format: (row) => <span className="secwise-cols">{(+row.average_delivery_quantity).toLocaleString('en-IN')}</span>,
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'Traded Qty'}</span>,
      selector: (row) => +row.times_traded,
      format: (row) => (
        <span>
          <span className="secwise-cols">{(+row.total_traded_quantity).toLocaleString('en-IN')}</span> <br />
          <span className="green">{row.times_traded}x</span>
        </span>
      ),

      sortable: true
    },
    {
      name: <span className="table-heading-text">{'Avg Traded Qty'}</span>,
      selector: (row) => +row.average_traded_quantity,
      format: (row) => (
        <div className="traded-div">
          <span className="secwise-cols">{(+row.average_traded_quantity).toLocaleString('en-IN')}</span>
        </div>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'Last Price'}</span>,
      selector: (row) => +row.last_price,
      format: (row) => {
        const value = ((row?.last_price - row?.prev_close) / row?.prev_close) * 100;
        return (
          <div className="column-div">
            <span className="secwise-cols">{(+row.last_price).toLocaleString('en-IN')}</span>
            <div className="row-div">
              <div className={value > 0 ? 'triangle-green-div' : 'triangle-red-div'} />
              <span className={value < 0 ? 'column-red-text' : 'column-green-text'}>{`${Math.abs(value).toFixed(
                2
              )}%`}</span>
            </div>
          </div>
        );
      },
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'Insight (Vs Weekly Avg)'}</span>,
      selector: (row) =>
        +((row?.deliverable_qty / row?.total_traded_quantity) * 100) >
        (row?.average_delivery_quantity / row?.average_traded_quantity) * 100,
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
      name: <span className="table-heading-text">{'% Dly Qt to Traded Qty'}</span>,
      selector: (row) => +row.dly_qt_to_traded_qty,
      format: (row) => {
        // const
        return (
          <div className="delivery-div">
            <span className="secwise-cols">{(+row.dly_qt_to_traded_qty).toLocaleString('en-IN')}</span>
          </div>
        );
      },
      sortable: true
    }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        overflow: 'hidden'
      }}
      className="div-main"
    >
      <div style={{ display: isLoading ? 'block' : 'none' }}>{loadingAnimation}</div>
      <div style={{ display: !isLoading && !isFilterData && !securityData ? 'block' : 'none' }}>{loadingAnimation}</div>
      <div style={{ display: !isLoading && isFilterData && securityData ? 'block' : 'none' }}>
        <div className="main-label-div">
          <div className="half-width">
            <label>
              {/* Date */}
              <select className="date-picker-modal" onChange={setDropdownDate} value={currentSelectedDate}>
                {uniqueDates?.map((itm, index) => (
                  <option key={index} value={itm}>
                    {itm}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="half-last-width">
            <label>
              <input
                type="checkbox"
                className='className="checkbox-label"'
                onChange={(event) => showNiftyStocksOnly(event.target.checked)}
              />
              <span className="checkbox-text">NIFTY STOCKS</span>
            </label>
          </div>
        </div>

        <div className="scrolling-table">
          <DataTable
            columns={column}
            data={securityData}
            noDataComponent={
              <div ref={loader} style={{ height: '100px', margin: '10px 0' }}>
                {isLoading && <PropagateLoader color="#33a3e3" loading={true} size={15} />}
              </div>
            }
            fixedHeader={{ top: true }}
          />
        </div>
      </div>
    </div>
  );
}

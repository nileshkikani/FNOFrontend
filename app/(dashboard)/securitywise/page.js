'use client';
import React, { useEffect, useRef, useState } from 'react';
import useSecurityWiseData from '@/hooks/useSecurityWiseData';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import DataTable from 'react-data-table-component';
import '../securitywise/global.css';
import DeliveryChart from '@/component/SecurityWise/DeliveryChart';
import { usePathname, useRouter } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';

//  ===========LOADING ANIMATION ===========
const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

export default function Page() {
  const {
    setDropdownDate,
    data,
    // page,
    uniqueDates,
    getData,
    showNiftyStocksOnly,
    isLoading,
    currentSelectedDate,
    hasMore,
    // isShowNifty,
    refreshData,
    setCurrentSelectedDate
  } = useSecurityWiseData();
  const route = useRouter();
  const [isFilterData, setIsFilterData] = useState(false);
  const [changeDate, setChangeDate] = useState(false);
  const [securityData, setSecurityData] = useState([]);
  const [sData, setSData] = useState([]);
  let [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [isShowNifty, setIsShowNifty] = useState(false);
  const [isMoreData, setIsMoreData] = useState(true);
  const [isMore, setIsMore] = useState(true);

  // const [currentSelectedDate, setCurrentSelectedDate] = useState('');

  const pathname = usePathname();
  let routeName = pathname.match('securitywise') ? 'securitywise' : null;
  // Current page index

  const loader = useRef(null);

  useEffect(() => {
    console.log('hello security');
    getData();
  }, []);

  useEffect(() => {
    console.log('data.map', data);
    routeName = pathname.match('securitywise') ? 'securitywise' : null;
    setData(data);
    if (data?.length > 0) {
      setIsMoreData(true);
      setIsMore(!isMore);
    }
    setSData(data);
  }, [data]);

  useEffect(() => {
    console.log('currentSelectedDate', isMoreData);

    console.log('routeName', routeName);
    getSecurityData();
  }, [selectedDate, pathname]);

  useEffect(() => {
    console.log('currentSelectedDate', selectedDate);
    if (uniqueDates.length > 0) {
      if (!changeDate) {
        setSelectedDate(uniqueDates[0]);
      }
    }
  }, [uniqueDates, selectedDate]);

  useEffect(() => {
    console.log('Data updated', data);
    console.log('Data Length:', data?.length);
    console.log('Has More Data:', isMoreData);
  }, [data, isMoreData]);

  const getSecurityData = (pageNo, isNifty) => {
    console.log('selectedDate', isMoreData);
    const pageNum = pageNo ? pageNo : page;
    const isNiftyData = isNifty ? isNifty : isShowNifty ? 1 : 0;
    if (routeName && selectedDate) {
      console.log('routername', routeName);
      if (page !== 1 && !isMoreData) {
        console.log('isMoreData', isMoreData);
        return;
      } else {
        console.log('page else', pageNum);
        getData(selectedDate, pageNum, isNiftyData).then(() => {
          setPage(pageNum + 1);
        });
      }
    } else {
      setPage(1);
      refreshData();
    }
  };

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && !isLoading && hasMore) {
  //         console.log('Bottom reached, loading more data.');
  //         getData(currentSelectedDate, page + 1, isShowNifty);
  //       }
  //     },
  //     { threshold: 0.1 } // Trigger when 10% of 'loader' is visible
  //   );
  // }, [hasMore, page, getData]);

  const setData = async (data) => {
    const dataArray = await Promise.all(
      data.map(async (item, index) => {
        const key = 'id' + Math.random().toString(16).slice(2);
        const insight = await getInsight(
          (item.deliverable_qty / item.total_traded_quantity) * 100,
          (item.average_delivery_quantity / item.average_traded_quantity) * 100,
          ((item.close_price - item.prev_close) / item.prev_close) * 100
        );

        return { ...item, insight, uniqueKey: key };
      })
    );
    const dataset = (await Promise.resolve(dataArray)).sort((a, b) => b.times_delivery - a.times_delivery);
    console.log('dataset', dataset);

    setSecurityData(dataset);
    setIsFilterData(true);
    setChangeDate(false);
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
      selector: (row, index) => row.symbol,
      cell: (row, index) => (
        <span onClick={() => routerRedirect(row?.symbol)} index={index} className="link">
          {row?.symbol}
        </span>
      ),
      format: (row, index) => (
        <span index={index} className="secwise-cols">
          {+row.symbol}
        </span>
      ),
      sortable: true,
      grow: 2
    },
    {
      name: <span className="table-heading-text">{'Delivered Qty'}</span>,
      selector: (row, index) => +row.times_delivery,
      format: (row, index) => (
        <span index={index} className="secwise-cols">
          {(+row.deliverable_qty).toLocaleString('en-IN')} <br /> <span className="green">{row.times_delivery}x</span>
        </span>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'Avg Delivered Qty'}</span>,
      selector: (row, index) => +row.average_delivery_quantity,
      format: (row, index) => (
        <span index={index} className="secwise-cols">
          {(+row.average_delivery_quantity).toLocaleString('en-IN')}
        </span>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'Traded Qty'}</span>,
      selector: (row, index) => +row.times_traded,
      format: (row, index) => (
        <span index={index}>
          <span className="secwise-cols">{(+row.total_traded_quantity).toLocaleString('en-IN')}</span> <br />
          <span className="green">{row.times_traded}x</span>
        </span>
      ),

      sortable: true
    },
    {
      name: <span className="table-heading-text">{'Avg Traded Qty'}</span>,
      selector: (row, index) => +row.average_traded_quantity,
      format: (row, index) => (
        <div index={index} className="traded-div">
          <span className="secwise-cols">{(+row.average_traded_quantity).toLocaleString('en-IN')}</span>
        </div>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">{'Last Price'}</span>,
      selector: (row, index) => +row.last_price,
      format: (row, index) => {
        const value = ((row?.last_price - row?.prev_close) / row?.prev_close) * 100;
        return (
          <div index={index} className="column-div">
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
      selector: (row, index) =>
        +((row?.deliverable_qty / row?.total_traded_quantity) * 100) >
        (row?.average_delivery_quantity / row?.average_traded_quantity) * 100,
      format: (row, index) => {
        const insight = row?.insight;
        return (
          <div index={index} className="insight-div">
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
      selector: (row, index) => +row.dly_qt_to_traded_qty,
      format: (row, index) => (
        <div index={index} className="delivery-div">
          <span className="secwise-cols">{(+row.dly_qt_to_traded_qty).toLocaleString('en-IN')}</span>
        </div>
      ),
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
        {securityData && securityData?.length > 0 && (
          <div className="main-label-div">
            <div className="half-width">
              <label>
                {/* Date */}
                <select
                  className="date-picker-modal"
                  onChange={async (event) => {
                    const selectedDate = event.target.value;
                    console.log('selectedDate', selectedDate);
                    setPage(1);
                    setChangeDate(true);
                    await refreshData();
                    setSelectedDate(selectedDate);
                    // setCurrentSelectedDate(selectedDate);
                    getSecurityData();
                  }}
                  value={selectedDate}
                >
                  {uniqueDates?.map((itm, index) => (
                    <option key={index} value={itm}>
                      {itm}
                    </option>
                  ))}
                </select>
              </label>
              {/* <input
              value={''}
              placeholder="Enter Stock Symbol"
              //  onChange={(event) => filterByStockAndDate(event)}
            /> */}
            </div>
            <div className="half-last-width">
              <label>
                <input
                  type="checkbox"
                  className='className="checkbox-label"'
                  onChange={async (event) => {
                    console.log('!isShowNifty', !isShowNifty);
                    setIsShowNifty(!isShowNifty);
                    setPage(1); // set page to 1
                    await refreshData();
                    setTimeout(() => {
                      console.log('page no', page);
                      getSecurityData(1, !isShowNifty ? 1 : 0);
                    }, 1000);
                  }}
                />
                <span className="checkbox-text">NIFTY STOCKS</span>
              </label>
            </div>
          </div>
        )}

        <div
          className="scrolling-tableData"
          style={{
            position: 'relative',
            height: '100%',
            overflow: 'auto',
            overflowY: 'auto'
          }}
        >
          <InfiniteScroll
            dataLength={data?.length - 1}
            next={() => {
              console.log('Next page', page);
              if (isMoreData) {
                // setPage((prev) => prev + 1);
                getSecurityData();
              }
            }}
            hasMore={isMoreData}
            height={1000}
            scrollableTarget="scrollableDiv"
            endMessage={false}
          >
            <DataTable
              columns={column}
              data={securityData}
              noDataComponent={
                <div ref={loader} style={{ height: '100px', margin: '10px 0' }}>
                  {isLoading && <PropagateLoader color="#33a3e3" loading={true} size={15} />}
                </div>
              }
              // fixedHeader={{ top: 0, bottom: 0 }}
              // fixedHeaderScrollHeight="100vh"
              className="sticky-header"
              keyField="uniqueKey"
            />
          </InfiniteScroll>
        </div>
        <style jsx>{`
          .scrolling-tableData {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
        `}</style>

        {/* <div className="scrolling-table"> */}
        {/* <InfiniteScroll
          dataLength={data?.length}
          next={() => {
            console.log('Next page', page);
            if (isMoreData) {
              console.log('if (isMoreData)', isMoreData);
              setPage((prev) => prev + 1);
              getSecurityData();
            }
          }}
          hasMore={isMoreData}
          // height={`calc(100vh - ${loader.current?.offsetHeight}px)`}
          height={1000}
          scrollableTarget="scrollableDiv"
          pullDownToRefreshThreshold={100}
        >
          <DataTable
            columns={column}
            data={securityData}
            noDataComponent={
              <div ref={loader} style={{ height: '100px', margin: '10px 0' }}>
                {isLoading && <PropagateLoader color="#33a3e3" loading={true} size={15} />}
              </div>
            }
            persistTableHead
            keyField="uniqueKey"
            fixedHeader={false}
          />
        </InfiniteScroll> */}
        {/* </div> */}
      </div>
    </div>
  );
}

'use client';
import useSecurityWiseData from '@/hooks/useSecurityWiseData';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import '../securitywise/global.css';
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

//  ===========LOADING ANIMATION ===========
const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

export default function Page() {
  const {
    setDropdownDate,
    data,
    uniqueDates,
    getData,
    showNiftyStocksOnly,
    isLoading,
    currentSelectedDate,
    hasMore,
    refreshData,
    setCurrentSelectedDate
  } = useSecurityWiseData();
  const route = useRouter();
  const [isFilterData, setIsFilterData] = useState(false);
  const [changeDate, setChangeDate] = useState(false);
  const [securityData, setSecurityData] = useState([]);
  const [sData, setSData] = useState([]);
  const [originalSecurityData, setOriginalSecurityData] = useState([]);

  let [page, setPage] = useState(1);
  let [perPage, setPerPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [isShowNifty, setIsShowNifty] = useState(false);
  const [isMoreData, setIsMoreData] = useState(true);
  const [isMore, setIsMore] = useState(true);
  const tableRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');


  const pathname = usePathname();
  let routeName = pathname.match('securitywise') ? 'securitywise' : null;

  const loader = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      getData();
    }
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filteredData = originalSecurityData.filter(item =>
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSecurityData(filteredData);
    } else {
      setSecurityData(originalSecurityData);
    }
  }, [searchTerm, originalSecurityData]);
  

  useEffect(() => {
    console.log('data.map', data);
    routeName = pathname.match('securitywise') ? 'securitywise' : null;
    setData(data);
    if (data?.length > 0) {
      setIsMoreData(true);
      setIsMore(!isMore);
    } else {
      setIsMoreData(false);
    }
    setSData(data);
  }, [data]);

  useEffect(() => {

    getSecurityData();
  }, [selectedDate, pathname]);

  useEffect(() => {
    if (uniqueDates.length > 0) {
      if (!changeDate) {
        setSelectedDate(uniqueDates[0]);
      }
    }
  }, [uniqueDates, selectedDate]);


  const getSecurityData = (pageNo, isNifty) => {
    const pageNum = pageNo ? pageNo : page;
    const isNiftyData = isNifty ? isNifty : isShowNifty ? 1 : 0;
    if (routeName && selectedDate) {
      if (page !== 1 && !isMoreData) {
        return;
      } else {
        getData(selectedDate, pageNum, isNiftyData).then(() => {
          setPage(pageNum + 1);
        });
      }
    } else {
      setPage(1);
      refreshData();
    }
  };
  

  useEffect(() => {
    const dataTable = document.querySelector('.sticky-header');

    const handleScroll = () => {
      if (dataTable) {
        const scrollTop = dataTable.scrollTop;
        const scrollHeight = dataTable.scrollHeight;
        const clientHeight = dataTable.clientHeight;

        const scrollBottom = Math.floor(scrollHeight - (scrollTop + clientHeight));
        if (scrollBottom === 0 && isMoreData) {
          getSecurityDataCall();
        }
      }
    };

    if (dataTable) {
      dataTable.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (dataTable) {
        dataTable.removeEventListener('scroll', handleScroll);
      }
    };
  }, [getSecurityData]);

  const getSecurityDataCall = async () => {
    if (!isMoreData) return;
    getSecurityData();
  };


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
    
    setOriginalSecurityData(dataset);
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
      name: <span className="table-heading-text">Delivered Qty</span>,
      selector: (row, index) => +row.times_delivery,
      format: (row, index) => (
        <span index={index} className="secwise-cols">
          {(+row.deliverable_qty).toLocaleString('en-IN')} <br /> <span className="green">{row.times_delivery}x</span>
        </span>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">Avg Delivered Qty</span>,
      selector: (row, index) => +row.average_delivery_quantity,
      format: (row, index) => (
        <span index={index} className="secwise-cols">
          {(+row.average_delivery_quantity).toLocaleString('en-IN')}
        </span>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">Traded Qty</span>,
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
      name: <span className="table-heading-text">Avg Traded Qty</span>,
      selector: (row, index) => +row.average_traded_quantity,
      format: (row, index) => (
        <div index={index} className="traded-div">
          <span className="secwise-cols">{(+row.average_traded_quantity).toLocaleString('en-IN')}</span>
        </div>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">Last Price</span>,
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
      name: <span className="table-heading-text">Insight (Vs Weekly Avg)</span>,
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
      name: <span className="table-heading-text">% Dly Qt to Traded Qty</span>,
      selector: (row, index) => +row.dly_qt_to_traded_qty,
      format: (row, index) => (
        <div index={index} className="delivery-div">
          <span className="secwise-cols">{(+row.dly_qt_to_traded_qty).toLocaleString('en-IN')}</span>
        </div>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">xg prediction</span>,
      selector: (row, index) => +row.xg_prediction,
      format: (row, index) => (
        <div index={index} >
          <span className="secwise-cols">
            {+row.xg_prediction > 0 ? (
              <span className='prediction-col'>
                <FaArrowTrendUp size={18} style={{ color: 'green' }} />up
              </span>
            ) : (
              <span className='prediction-col'>
                <FaArrowTrendDown size={18} style={{ color: 'red' }} />down
              </span>
            )}
          </span>
        </div>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">Ada prediction</span>,
      selector: (row, index) => +row.ada_prediction,
      format: (row, index) => (
        <div index={index} >
          <span className="secwise-cols">
            {+row.ada_prediction > 0 ? (
              <span className='prediction-col'>
                <FaArrowTrendUp size={18} style={{ color: 'green' }} />up
              </span>
            ) : (
              <span className='prediction-col'>
                <FaArrowTrendDown size={18} style={{ color: 'red' }} />down
              </span>
            )}
          </span>
        </div>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">Forest prediction</span>,
      selector: (row, index) => +row.forest_prediction,
      format: (row, index) => (
        <div index={index} >
          <span className="secwise-cols">
            {+row.forest_prediction > 0 ? (
              <span className='prediction-col'>
                <FaArrowTrendUp size={18} style={{ color: 'green' }} />up
              </span>
            ) : (
              <span className='prediction-col'>
                <FaArrowTrendDown size={18} style={{ color: 'red' }} />down
              </span>
            )}
          </span>
        </div>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">XG Reg prediction</span>,
      selector: (row, index) => +row.xg_reg_prediction,
      format: (row, index) => (
        <div index={index} className="delivery-div">
          <span className="secwise-cols">{(+row.xg_reg_prediction).toLocaleString('en-IN')}</span>
        </div>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">Ada Reg prediction</span>,
      selector: (row, index) => +row.ada_reg_prediction,
      format: (row, index) => (
        <div index={index} className="delivery-div">
          <span className="secwise-cols">{(+row.ada_reg_prediction).toLocaleString('en-IN')}</span>
        </div>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">Ann Reg prediction</span>,
      selector: (row, index) => +row.ann_reg_prediction,
      format: (row, index) => (
        <div index={index} className="delivery-div">
          <span className="secwise-cols">{(+row.ann_reg_prediction).toLocaleString('en-IN')}</span>
        </div>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">Voting reg prediction</span>,
      selector: (row, index) => +row.ann_reg_prediction,
      format: (row, index) => (
        <div index={index} className="delivery-div">
          <span className="secwise-cols">{(+row.voting_reg_prediction).toLocaleString('en-IN')}</span>
        </div>
      ),
      sortable: true
    },
    {
      name: <span className="table-heading-text">Final prediction</span>,
      selector: (row, index) => +row.final_prediction,
      format: (row, index) => (
        <div index={index} >
          <span className="secwise-cols">
            {+row.final_prediction > 0 ? (
              <span className='prediction-col'>
                <FaArrowTrendUp size={18} style={{ color: 'green' }} />up
              </span>
            ) : (
              <span className='prediction-col'>
                <FaArrowTrendDown size={18} style={{ color: 'red' }} />down
              </span>
            )}
          </span>
        </div>
      ),
      sortable: true
    },

  ];

  const filteredData = securityData.filter(item =>
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="div-main"
      >
      {/* <div style={{ display: isLoading ? 'block' : 'none' }}>{loadingAnimation}</div> */}
{/* <div style={{ display: !isLoading && !isFilterData && !securityData ? 'block' : 'none' }}>{loadingAnimation}</div> */}
      <div >

          <div className="main-label-div">
            <div className="half-width">
              {selectedDate && (

                <label>
                {/* Date */}
                <select
                  className="date-picker-modal"
                  onChange={async (event) => {
                    const selectedDate = event.target.value;
                    setPage(1);
                    setChangeDate(true);
                    await refreshData();
                    setSelectedDate(selectedDate);
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
                    )}
            </div>
            <div className="half-last-width">
              <label>
                <input
                  checked={isShowNifty}
                  type="checkbox"
                  className='className="checkbox-label"'
                  onChange={async (event) => {
                    setIsShowNifty(event.target.checked);
                    setPage(1); 
                    await refreshData();
                    setTimeout(() => {
                      getSecurityData(1, !isShowNifty ? 1 : 0);
                    }, 1000);
                  }}
                />
                <span className="checkbox-text">NIFTY STOCKS</span>
              </label>
            </div>
            <div>
            <input
            type="text"
            placeholder="Search by Symbol"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '5px', maxWidth: '80%', border: '1px solid black', borderRadius: '5px' }}
          />
            </div>
          </div>

        {!isLoading && isFilterData && securityData && (
          <div
          className="scrolling-tableData"
          style={{
            position: 'relative',
            height: '100%',
            overflow: 'auto'
          }}
          ref={tableRef}
          >

          <DataTable
            columns={column}
            data={securityData}
            noDataComponent={
              <div ref={loader} style={{ height: '100px', margin: '10px 0' }}>
                {isLoading && <PropagateLoader color="#33a3e3" loading={true} size={15} />}
              </div>
            }
            fixedHeader
            fixedHeaderScrollHeight="calc(100vh - 80px)"
            className="sticky-header"
            keyField="uniqueKey"
            />
        </div>
          ) }

        <style jsx>{`
          .scrolling-tableData {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
          }
        `}</style>


      </div>
    </div>
  );
}

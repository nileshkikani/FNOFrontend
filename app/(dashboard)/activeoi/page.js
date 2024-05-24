'use client';
// ===========UTILITIES===============
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import axiosInstance from '@/utils/axios';
import { API_ROUTER } from '@/services/apiRouter';
import './global.css';

//  ===========HOOKS ===========
import useActiveOiData from '@/hooks/useActiveOiData';
import { useAppSelector } from '@/store';
import useNiftyFutureData from '@/hooks/useNiftyFutureData';
import NiftyFuturesTable from '@/component/NiftyFutures/NiftyFuturesTable';
import CoiDiffGraph from '@/component/ActiveOI/ActiveOi-Graphs/CoiDiff-Graph';
import IntradayDiffGraph from '@/component/ActiveOI/ActiveOi-Graphs/IntradayDiff-Graph';
import useAuth from '@/hooks/useAuth';

// ===========GRAPH COMPONENTS ===========
const ChangeOIGraph = dynamic(() => import('@/component/ActiveOI/ActiveOi-Graphs/ChangeOI-Graph'));
const ScatterPlotGraph = dynamic(() => import('@/component/ActiveOI/ActiveOi-Graphs/ScatterPlot-Graph'));
const CallVsPutGraph = dynamic(() => import('@/component/ActiveOI/ActiveOi-Graphs/CallVsPut-Graph'));
const ActiveOiTable = dynamic(() => import('@/component/ActiveOI/ActiveOiTable'));
const NiftyFuturesGraph = dynamic(() => import('@/component/NiftyFutures/NiftyFutures-Graphs/NiftyFuturesGraph'));

//  ===========LOADING ANIMATION ===========
const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

export default function Page() {
  const { getData, dateDropDownChange, uniqueDates, isLoading, dropDownChange } = useActiveOiData();

  // const { getNiftyFuturesData, selectedOption } = useNiftyFutureData();
  const [selectedNiftyFutureDates, setSelectedNiftyFutureDates] = useState('');
  const { handleResponceError } = useAuth();
  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds == 5 minutes
  const [marketClosed, setMarketClosed] = useState(false);
  const [niftyFuturesDate, setNiftyFuturesDates] = useState('');
  const authState = useAppSelector((state) => state.auth.authState);
  const checkUserIsLoggedIn = useAppSelector((state) => state.auth.isUser);
  const [niftyFuturesData, setNiftyFuturesData] = useState('');
  const [niftyFuturesExpDates, setNiftyFuturesExpDates] = useState('');
  const [selectedNiftyFuturesExpDates, setSelectedNiftyFuturesExpDates] = useState('');
  const [niftyFuturesFilterData, setNiftyFuturesFilterData] = useState('');

  const memoizedTimeLeft = useMemo(() => timeLeft, [timeLeft]);

  useEffect(() => {
    if (checkUserIsLoggedIn) {
      getData();
      // getNiftyFuturesData();
      const intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      // return () => clearInterval(intervalId);
    }
  }, [getData, setTimeLeft]);

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (
      (currentHour > 9 && currentHour < 15) ||
      (currentHour === 9 && currentMinute >= 0) ||
      (currentHour === 15 && currentMinute <= 30)
    ) {
      setMarketClosed(false);
      if (timeLeft === 0) {
        window.location.reload();
      }
    } else {
      setMarketClosed(true);
    }
  }, [memoizedTimeLeft, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  useEffect(() => {
    selectedNiftyFuturesExpDates && getFilteredNiftyValue(selectedNiftyFuturesExpDates, niftyFuturesData);
  }, [selectedNiftyFuturesExpDates]);
  const getFilteredNiftyValue = (aDate, aValue) => {
    setNiftyFuturesFilterData(aValue?.filter((aItem) => aItem.expiration == aDate));
  };

  // ----------NIFTRY FUTURES API CALL----------------
  const getNiftyFuturesData = async () => {
    if (!authState && checkUserIsLoggedIn) {
      return router.push('/login');
    }
    try {
      let apiUrl = `${API_ROUTER.NIFTY_FUTURE_DATA}`;
      const response = await axiosInstance.get(
        selectedNiftyFutureDates ? (apiUrl += `?date=${selectedNiftyFutureDates}`) : apiUrl,
        {
          headers: { Authorization: `Bearer ${authState.access}` }
        }
      );
      console.log('ytytyt', response);
      if (response.status === 200) {
        if (!niftyFuturesDate && !selectedNiftyFutureDates) {
          setNiftyFuturesDates(response?.data?.dates);
          setSelectedNiftyFutureDates(response?.data?.dates[0]);
          return;
        }
        const extractTimes = (items) =>
          items && items.length ? items.map((item) => item.expiration).filter(Boolean) : [];
        const allCreatedAts = [...extractTimes(response?.data)];
        const filteredExpDate = [...new Set(allCreatedAts)];
        setNiftyFuturesExpDates(filteredExpDate);
        getFilteredNiftyValue(filteredExpDate[0], response?.data);
        setNiftyFuturesData(response?.data);
        setSelectedNiftyFuturesExpDates(filteredExpDate[0]);
      } else {
        router.push('/login');
      }
    } catch (error) {
      handleResponceError();
      // console.log('qwqw');
    }
  };

  useEffect(() => {
    getNiftyFuturesData();
  }, [selectedNiftyFutureDates]);

  const refreshData = () => {
    getData();
    getNiftyFuturesData();
  };

  return (
    <div>
      <div>
        {marketClosed ? (
          <h1 className="timer">MARKET CLOSED</h1>
        ) : (
          <h1>
            Next Refresh In:
            <span className="timer">{`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}</span>
          </h1>
        )}
      </div>
      <div className="flex-container">
        <label>
          Strikes Above/Below ATM :
          <select className="stock-dropdown" onChange={dropDownChange}>
            <option value="5">5</option>
            <option value="15" selected>
              15
            </option>
          </select>
        </label>
        <label>
          Date :
          <select className="stock-dropdown" onChange={dateDropDownChange}>
            {uniqueDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </label>
        <div>
          <button className="refresh-button2" onClick={() => refreshData()}>
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh'
          }}
        >
          <PropagateLoader color="#33a3e3" loading={isLoading} size={15} />
        </div>
      ) : (
        <>
          {/* ----------COI DIFFERENCE------------------- */}
          <div className="grand-div">
            <CoiDiffGraph />
          </div>
          <div className="grand-div">
            <IntradayDiffGraph />
          </div>
          {/* -------------------ACTIVE OI SECTION------------------ */}
          <>
            <div className="active-oi-table">
              <ActiveOiTable />
              <div className="grand-div">
                <ChangeOIGraph />
              </div>
              <div className="grand-div">
                <CallVsPutGraph />
              </div>
              <div className="grand-div">
                <ScatterPlotGraph />
              </div>
            </div>
          </>
          {/* -----------------------NIFTY FUTURES SECTION-------------------- */}
          <>
            {!selectedNiftyFuturesExpDates ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '50px'
                }}
              >
                <PropagateLoader color="#33a3e3" loading={!selectedNiftyFuturesExpDates} size={15} />
              </div>
            ) : (
              <>
                <div className="main-div">
                  <NiftyFuturesTable
                    selectedNiftyFuturesExpDates={selectedNiftyFuturesExpDates}
                    setSelectedNiftyFuturesExpDates={setSelectedNiftyFuturesExpDates}
                    niftyFuturesExpDates={niftyFuturesExpDates}
                    niftyFuturesFilterData={niftyFuturesFilterData}
                    niftyFuturesDate={niftyFuturesDate}
                    setSelectedNiftyFutureDates={setSelectedNiftyFutureDates}
                    selectedNiftyFutureDates={selectedNiftyFutureDates}
                  />
                </div>
                <div className="grand-div">
                  <NiftyFuturesGraph niftyFuturesFilterData={niftyFuturesFilterData} />
                </div>
              </>
            )}
          </>
        </>
      )}
    </div>
  );
}

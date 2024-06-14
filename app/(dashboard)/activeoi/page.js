'use client';
// ===========UTILITIES===============
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import axiosInstance from '@/utils/axios';
import { API_ROUTER } from '@/services/apiRouter';
import './global.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

//  ===========HOOKS ===========
// import useActiveOiData from '@/hooks/useActiveOiData';
import { useAppSelector } from '@/store';
// import useNiftyFutureData from '@/hooks/useNiftyFutureData';
import NiftyFuturesTable from '@/component/NiftyFutures/NiftyFuturesTable';
import CoiDiffGraph from '@/component/ActiveOI/ActiveOi-Graphs/CoiDiff-Graph';
import IntradayDiffGraph from '@/component/ActiveOI/ActiveOi-Graphs/IntradayDiff-Graph';
import useAuth from '@/hooks/useAuth';
// import MacdIndicator from '@/component/ActiveOI/ActiveOi-Graphs/MacdIndicator-Graph';
// import CandleChart from '@/component/ActiveOI/ActiveOi-Graphs/CandleChart-Graph';

// ===========GRAPH COMPONENTS ===========
const ChangeOIGraph = dynamic(() => import('@/component/ActiveOI/ActiveOi-Graphs/ChangeOI-Graph'));
const ScatterPlotGraph = dynamic(() => import('@/component/ActiveOI/ActiveOi-Graphs/ScatterPlot-Graph'));
const CallVsPutGraph = dynamic(() => import('@/component/ActiveOI/ActiveOi-Graphs/CallVsPut-Graph'));
const ActiveOiTable = dynamic(() => import('@/component/ActiveOI/ActiveOiTable'));
const NiftyFuturesGraph = dynamic(() => import('@/component/NiftyFutures/NiftyFutures-Graphs/NiftyFuturesGraph'));

//  ===========LOADING ANIMATION ===========
const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

export default function Page() {
  // const { getData, dateDropDownChange, uniqueDates, isLoading, dropDownChange } = useActiveOiData();
  let adjustedNiftyStart;
  let adjustedNiftyEnd;
  // const { getNiftyFuturesData, selectedOption } = useNiftyFutureData();
  const [selectedNiftyFutureDates, setSelectedNiftyFutureDates] = useState('');
  const [strikeAtm, setStrikeAtm] = useState("15");
  const { handleResponceError } = useAuth();
  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds == 5 minutes
  const [marketClosed, setMarketClosed] = useState(false);
  const [niftyFuturesDate, setNiftyFuturesDates] = useState('');
  const [activeoiDate, setActiveoiDate] = useState('');
  const [selectedActiveoiDate, setSelectedActiveoiDate] = useState('');
  const authState = useAppSelector((state) => state.auth.authState);
  const checkUserIsLoggedIn = useAppSelector((state) => state.auth.isUser);
  const [niftyFuturesData, setNiftyFuturesData] = useState('');
  const [activeoiData, setActiveoiData] = useState('');
  const [niftyFuturesExpDates, setNiftyFuturesExpDates] = useState('');
  const [selectedNiftyFuturesExpDates, setSelectedNiftyFuturesExpDates] = useState('');
  const [niftyFuturesFilterData, setNiftyFuturesFilterData] = useState('');

  const memoizedTimeLeft = useMemo(() => timeLeft, [timeLeft]);

  useEffect(() => {
    if (checkUserIsLoggedIn) {
      getActiveoiData();
      // getNiftyFuturesData();
      const intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      // return () => clearInterval(intervalId);
    }
  }, [setTimeLeft]);

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
  useEffect(() => {
    if (selectedActiveoiDate) {
      getActiveoiData();  
    }
  }, [selectedActiveoiDate]);
  useEffect(() => {
      authState && getActiveoiData();  
  }, []);
  // ----------NIFTRY FUTURES API CALL----------------
  const getNiftyFuturesData = async () => {
    try {
      let apiUrl = `${API_ROUTER.NIFTY_FUTURE_DATA}`;
      const response = await axiosInstance.get(
        selectedNiftyFutureDates ? (apiUrl += `?date=${selectedNiftyFutureDates}`) : apiUrl,
        {
          headers: { Authorization: `Bearer ${authState.access}` }
        }
      );
      // console.log('ytytyt', response);
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
// ---------------ACTIVE OI API CALL-------
  const getActiveoiData = async () => {
    let apiUrl = `${API_ROUTER.ACTIVE_OI}`;
    try {
      const response = await axiosInstance.get(selectedActiveoiDate ? (apiUrl += `?date=${selectedActiveoiDate}`) : apiUrl, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      if (response.status === 200) {
        if (!activeoiDate && !selectedActiveoiDate) {
        setActiveoiDate(response?.data?.dates)
        setSelectedActiveoiDate(response.data.dates[0])
        return
        }
        setActiveoiData(response.data)
        const maxLiveNifty = Math.max(response.data.map((item) => item?.live_nifty));
        const minLiveNifty = Math.min(response.data.map((item) => item?.live_nifty));
        const range = 10;
        adjustedNiftyStart = minLiveNifty - range;
        adjustedNiftyEnd = maxLiveNifty + range;
      } else {
        router.push('/login');
      }
    } catch (err) {
      handleResponceError();
    }
  };
  useEffect(() => {
    getNiftyFuturesData();
  }, [selectedNiftyFutureDates]);

  const refreshData = () => {
    getActiveoiData();
    getNiftyFuturesData();
  };


  const isDateDisabled = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    return !activeoiDate.includes(formattedDate);
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
          <select className="stock-dropdown" value={strikeAtm ? strikeAtm : ''} onChange={(e)=>setStrikeAtm(e.target.value)}>
            <option value="5">5</option>
            <option value="15">
              15
            </option>
          </select>
        </label>
        <label>
          Date :
          <select className="stock-dropdown" value={selectedActiveoiDate ? selectedActiveoiDate : ''} onChange={(e)=>setSelectedActiveoiDate(e.target.value)}>
            {activeoiDate && activeoiDate.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
          {/* <div className="stock-dropdown"> */}
          {/* <DatePicker selected={selectedActiveoiDate} onChange={(date) => setSelectedActiveoiDate(date)} isDateDisabled={isDateDisabled} /> */}
          {/* </div> */}
        </label>
        <div>
          <button className="refresh-button2" onClick={() => refreshData()}>
            Refresh
          </button>
        </div>
      </div>

      {!selectedActiveoiDate ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh'
          }}
        >
          <PropagateLoader color="#33a3e3" loading={!selectedActiveoiDate} size={15} />
        </div>
      ) : (
        <>
          {/* ----------COI DIFFERENCE------------------- */}
          <div className="grand-div">
            <CoiDiffGraph strikeAtm={strikeAtm} data={[...activeoiData].reverse()} adjustedNiftyStart={adjustedNiftyStart} adjustedNiftyEnd={adjustedNiftyEnd}/>
          </div>
          <div className="grand-div">
            <IntradayDiffGraph strikeAtm={strikeAtm} data={[...activeoiData].reverse()} adjustedNiftyStart={adjustedNiftyStart} adjustedNiftyEnd={adjustedNiftyEnd} />
          </div>
          {/* <div className="grand-div">
            <CandleChart />
          </div>
          <div className="grand-div">
            <MacdIndicator />
          </div> */}
          {/* -------------------ACTIVE OI SECTION------------------ */}
          <>
            <div className="active-oi-table">
              <ActiveOiTable strikeAtm={strikeAtm} data={activeoiData} adjustedNiftyStart={adjustedNiftyStart} adjustedNiftyEnd={adjustedNiftyEnd} />
              <div className="grand-div">
                <ChangeOIGraph strikeAtm={strikeAtm} data={[...activeoiData].reverse()} adjustedNiftyStart={adjustedNiftyStart} adjustedNiftyEnd={adjustedNiftyEnd}/>
              </div>
              <div className="grand-div">
                <CallVsPutGraph strikeAtm={strikeAtm} data={[...activeoiData].reverse()} adjustedNiftyStart={adjustedNiftyStart} adjustedNiftyEnd={adjustedNiftyEnd}/>
              </div>
              <div className="grand-div">
                <ScatterPlotGraph strikeAtm={strikeAtm} data={[...activeoiData].reverse()} adjustedNiftyStart={adjustedNiftyStart} adjustedNiftyEnd={adjustedNiftyEnd}/>
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
                <div>
                  <NiftyFuturesTable
                    selectedNiftyFuturesExpDates={selectedNiftyFuturesExpDates}
                    setSelectedNiftyFuturesExpDates={setSelectedNiftyFuturesExpDates}
                    niftyFuturesExpDates={niftyFuturesExpDates}
                    niftyFuturesFilterData={[...niftyFuturesFilterData].reverse()}
                    niftyFuturesDate={niftyFuturesDate}
                    setSelectedNiftyFutureDates={setSelectedNiftyFutureDates}
                    selectedNiftyFutureDates={selectedNiftyFutureDates}
                  />
                </div>
                <div className="grand-div">
                  <NiftyFuturesGraph niftyFuturesFilterData={[...niftyFuturesFilterData].reverse()} />
                </div>
              </>
            )}
          </>
        </>
      )}
    </div>
  );
}

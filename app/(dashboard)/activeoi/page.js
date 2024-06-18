'use client';
// ===========UTILITIES===============
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import axiosInstance from '@/utils/axios';
// import axios from 'axios';
import { API_ROUTER } from '@/services/apiRouter';
import './global.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { setExpiryDates } from '@/store/userSlice';

//  ===========HOOKS ===========
import { useAppSelector } from '@/store';
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
  let adjustedNiftyStart;
  let adjustedNiftyEnd;
  const [selectedNiftyFutureDates, setSelectedNiftyFutureDates] = useState('');
  const [strikeAtm, setStrikeAtm] = useState('5');
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

  const storeDispatch = useDispatch();
  const [allActiveOiExp, setAllActiveOiExp] = useState([]);
  const [checkedExp, setCheckedExp] = useState([]);
  // console.log("hudh",checkedExp)
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

  // --------------------NIFTY FUTURES API CALL-----------------------------
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
  // -------------------------ACTIVE OI API CALL-------------------------------
  const getActiveoiData = async () => {
    try {
      if (selectedActiveoiDate && checkedExp) {
        let apiUrl = `${API_ROUTER.ACTIVE_OI}`;
        let expiriesParam = '';
        if (checkedExp.length > 1) {
          expiriesParam = checkedExp.join(',');
        } else if (checkedExp.length === 1) {
          expiriesParam = checkedExp[0];
        }
        const response = await axiosInstance.get(
          `${apiUrl}?date=${selectedActiveoiDate}&expiries=${expiriesParam}&size=${strikeAtm}`
          ,{
            headers: { Authorization: `Bearer ${authState.access}` }
          }
        );

        if (response.status === 200) {
          setActiveoiData(response.data);
          const maxLiveNifty = Math.max(...response.data.map((item) => item?.live_nifty || 0));
          const minLiveNifty = Math.min(...response.data.map((item) => item?.live_nifty || 0));
          const range = 10;
          adjustedNiftyStart = minLiveNifty - range;
          adjustedNiftyEnd = maxLiveNifty + range;
        } else {
          router.push('/login');
        }
      }
    } catch (err) {
      handleResponceError();
    }
  };

  // -----------------------EXPIRY+DATES API CALL-------------------------------------
  const getExpiries = async () => {
    try {
      const response = await axiosInstance.get(`${API_ROUTER.EXPIRIES}`
        ,{
          headers: { Authorization: `Bearer ${authState.access}` }
        }
      );
      setAllActiveOiExp(response.data.expiries);
      setActiveoiDate(response.data.dates);

      //storing expiries in store
      storeDispatch(setExpiryDates(response.data.expiries));
      setCheckedExp([response.data.expiries[0]]);
      // console.log('gh', response.data.expiries[0]);
      setSelectedActiveoiDate(response.data.dates[0]);
    } catch (e) {
      console.log('error getting dates', e);
    }
  };
  useEffect(() => {
    getNiftyFuturesData();
  }, [selectedNiftyFutureDates]);

  useEffect(() => {
    if (selectedActiveoiDate && checkedExp) {
      getActiveoiData();
    }
  }, [selectedActiveoiDate, checkedExp, strikeAtm]);

  useEffect(() => {
    if (authState) {
      getActiveoiData();
      getExpiries();
    }
  }, []);

  const refreshData = () => {
    getActiveoiData();
    getNiftyFuturesData();
  };

  const isCheckedExp = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      if (!checkedExp.includes(value)) {
        setCheckedExp((prevCheckedExp) => [...prevCheckedExp, value]);
      }
    } else {
      if (checkedExp.includes(value)) {
        setCheckedExp((prevCheckedExp) => prevCheckedExp.filter((item) => item !== value));
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
  };
  // console.log('hhh', allActiveOiExp);
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
      <section className="main-section">
        <div>
          <label>select expiry</label>
          {allActiveOiExp?.map((itm, index) => (
            <div key={index} className="exp-date-div">
              <input
                type="checkbox"
                id={`expiry${index}`}
                value={itm}
                checked={checkedExp.includes(itm)}
                onChange={(e) => isCheckedExp(e)}
                className="exp-checkbox"
              />
              <label htmlFor={`expiry${index}`} className="exp-date-label">
                {formatDate(itm)}
              </label>
              <br />
            </div>
          ))}
        </div>
        <div className="date-container">
          <label>
            Strikes Above/Below ATM :
            <select
              className="stock-dropdown"
              value={strikeAtm ? strikeAtm : ''}
              onChange={(e) => setStrikeAtm(e.target.value)}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="200">all</option>
            </select>
          </label>
        </div>
        <div className="calender-dropdown">
          <DatePicker
            showIcon
            className="date-itself"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 48 48">
                <mask id="ipSApplication0">
                  <g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4">
                    <path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
                    <path
                      fill="#fff"
                      d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                    ></path>
                  </g>
                </mask>
                <path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSApplication0)"></path>
              </svg>
            }
            selected={selectedActiveoiDate}
            dateFormat="yyyy-MM-dd"
            onChange={(date) => {
              const formattedDate = date.toISOString().split('T')[0];
              setSelectedActiveoiDate(formattedDate);
            }}
            includeDates={activeoiDate}
            placeholderText="Select a date"
            customInput={<input readOnly />}
            shouldCloseOnSelect
            onKeyDown={(e) => {
              e.preventDefault();
            }}
          />
        </div>
        <div>
          <button className="refresh-button2" onClick={() => refreshData()}>
            Refresh
          </button>
        </div>
      </section>

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
            <CoiDiffGraph
              strikeAtm={strikeAtm}
              data={activeoiData}
              adjustedNiftyStart={adjustedNiftyStart}
              adjustedNiftyEnd={adjustedNiftyEnd}
            />
          </div>
          <div className="grand-div">
            <IntradayDiffGraph
              strikeAtm={strikeAtm}
              data={activeoiData}
              adjustedNiftyStart={adjustedNiftyStart}
              adjustedNiftyEnd={adjustedNiftyEnd}
            />
          </div>
          {/* -------------------ACTIVE OI SECTION------------------ */}
          <>
            <div className="active-oi-table">
              <ActiveOiTable
                data={[...activeoiData].reverse()}
                adjustedNiftyStart={adjustedNiftyStart}
                adjustedNiftyEnd={adjustedNiftyEnd}
              />
              <div className="grand-div">
                <ChangeOIGraph
                  data={activeoiData}
                  adjustedNiftyStart={adjustedNiftyStart}
                  adjustedNiftyEnd={adjustedNiftyEnd}
                />
              </div>
              <div className="grand-div">
                <CallVsPutGraph
                  data={activeoiData}
                  adjustedNiftyStart={adjustedNiftyStart}
                  adjustedNiftyEnd={adjustedNiftyEnd}
                />
              </div>
              <div className="grand-div">
                <ScatterPlotGraph
                  data={activeoiData}
                  adjustedNiftyStart={adjustedNiftyStart}
                  adjustedNiftyEnd={adjustedNiftyEnd}
                />
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

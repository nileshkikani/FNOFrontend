"use client";
// ===========UTILITIES===============
import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import axiosInstance from "@/utils/axios";
import { API_ROUTER } from "@/services/apiRouter";
import "./global.css"

//  ===========HOOKS ===========
import useActiveOiData from "@/hooks/useActiveOiData";
import { useAppSelector } from "@/store";
import useNiftyFutureData from "@/hooks/useNiftyFutureData";
import NiftyFuturesTable from "@/component/NiftyFutures/NiftyFuturesTable";
import CoiDiffGraph from "@/component/ActiveOI/ActiveOi-Graphs/CoiDiff-Graph";
import IntradayDiffGraph from "@/component/ActiveOI/ActiveOi-Graphs/IntradayDiff-Graph";

// ===========GRAPH COMPONENTS ===========
const ChangeOIGraph = dynamic(() =>
  import("@/component/ActiveOI/ActiveOi-Graphs/ChangeOI-Graph")
);
const ScatterPlotGraph = dynamic(() =>
  import("@/component/ActiveOI/ActiveOi-Graphs/ScatterPlot-Graph")
);
const CallVsPutGraph = dynamic(() =>
  import("@/component/ActiveOI/ActiveOi-Graphs/CallVsPut-Graph")
);
const ActiveOiTable = dynamic(() =>
  import("@/component/ActiveOI/ActiveOiTable")
);
const NiftyFuturesGraph = dynamic(() =>
  import("@/component/NiftyFutures/NiftyFutures-Graphs/NiftyFuturesGraph")
);

//  ===========LOADING ANIMATION ===========
const PropagateLoader = dynamic(() => import("react-spinners/PropagateLoader"));

export default function Page() {
  const {
    getData,
    dateDropDownChange,
    uniqueDates,
    isLoading,
    dropDownChange,
  } = useActiveOiData();

  // const { getNiftyFuturesData, selectedOption } = useNiftyFutureData();

  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds == 5 minutes
  const [marketClosed, setMarketClosed] = useState(false);
  const [niftyFuturesDate,setNiftyFuturesDates] = useState();
  const authState = useAppSelector((state) => state.auth.authState);
  const checkUserIsLoggedIn = useAppSelector((state) => state.auth.isUser);

  const memoizedTimeLeft = useMemo(() => timeLeft, [timeLeft]);

  useEffect(() => {
    if(checkUserIsLoggedIn){

      getData();
      // getNiftyFuturesData();
      const intervalId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(intervalId);
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

  console.log("opopop",niftyFuturesDate);

  useEffect(()=>{
    const getNiftyFuturesData = async () => {
    console.log("insidefuncc")
      if (!authState && checkUserIsLoggedIn) {
        return router.push('/login');
      }
      try {
        let apiUrl = `${API_ROUTER.NIFTY_FUTURE_DATA}`;
        const response = await axiosInstance.get( apiUrl, {
          headers: { Authorization: `Bearer ${authState.access}` }
        });
        console.log("ytytyt",response);
        if (response.status === 200) {
          setNiftyFuturesDates(response.data)

        } else {
          router.push("/login");
        }
      } catch (error) {
        // handleResponceError();
        console.log("qwqw");
      }
    };
    getNiftyFuturesData();
  },[])

  return (
    <div>
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
          {marketClosed ? (
            <h1 className="timer">MARKET CLOSED</h1>
          ) : (
            <h1>
              Next Refresh In:
              <span className="timer">
                {`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}
              </span>
            </h1>
          )}
          <label>
            Strikes above/below ATM
            <select onChange={dropDownChange}>
              <option value="5">5</option>
              <option value="15" selected>
                15
              </option>
            </select>
          </label>
          <label>
            Date
            <select onChange={dateDropDownChange}>
              {uniqueDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </label>
          {/* ----------COI DIFFERENCE------------------- */}
          
            <CoiDiffGraph />
            <IntradayDiffGraph/>
         
          {/* -------------------ACTIVE OI SECTION------------------ */}
          <>
          <div className="active-oi-table">
            <ActiveOiTable />
          </div>
            <div className="graph-div">
              <ChangeOIGraph />
            </div>
            <div className="graph-div">
              <CallVsPutGraph />
            </div>
            <div className="graph-div">
              <ScatterPlotGraph />
            </div>
          </>
          {/* -----------------------NIFTY FUTURES SECTION-------------------- */}
          <>
            {/* {!selectedOption ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "50px",
                }}
              >
                <PropagateLoader
                  color="#33a3e3"
                  loading={!selectedOption}
                  size={15}
                />
              </div>
            ) : (
              <> */}
                <div className="main-div">
                  <NiftyFuturesTable />
                </div>
                <div className="main-div">
                  <NiftyFuturesGraph />
                </div>
              </>
            {/* )} */}
          {/* </> */}
        </>
      )}
    </div>
  );
}

"use client";

// ===========UTILITIES===============
import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";

//  ===========HOOKS ===========
import useActiveOiData from "@/hooks/useActiveOiData";

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

//  ===========LOADING ANIMATION ===========
const ClipLoader = dynamic(() => import("react-spinners/ClipLoader"));

export default function Page() {
  const {
    getData,
    dateDropDownChange,
    uniqueDates,
    isLoading,
    dropDownChange,
  } = useActiveOiData();

  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds == 5 minutes
  const [marketClosed, setMarketClosed] = useState(false);

  const memoizedTimeLeft = useMemo(() => timeLeft, [timeLeft]);

  useEffect(() => {
    getData();
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(intervalId);
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

  return (
    <div>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "50px",
          }}
        >
          <ClipLoader
            color="#bfbfbf"
            loading={isLoading}
            size={70}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
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

          <>
            <ActiveOiTable />
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
        </>
      )}
    </div>
  );
}

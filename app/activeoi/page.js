"use client";
import { useEffect, useState,useMemo } from "react";

// -------HOOKS-------------
import useActiveOiData from "@/hooks/useActiveOiData";

//---------GRAPH COMPONENTS----------
import ChangeOIGraph from "@/component/ActiveOi-Graphs/ChangeOI-Graph";
import ScatterPlotGraph from "@/component/ActiveOi-Graphs/ScatterPlot-Graph";
import CallVsPutGraph from "@/component/ActiveOi-Graphs/CallVsPut-Graph";

export default function Page() {
  const {
    getData,
    filteredByDate,
    dateDropDownChange,
    uniqueDates,
    isLoading,
    checkFive,
    dropDownChange
  } = useActiveOiData();
  // console.log('UNIQUE DATEs from page',uniqueDates);

  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds == 5 minutes
  const [marketClosed, setMarketClosed] = useState(false);

  const memoizedTimeLeft = useMemo(() => timeLeft, [timeLeft]);

  useEffect(() => {
    getData();
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000); //--updates states every sec

    return () => clearInterval(intervalId);
  }, []);

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
  }, [memoizedTimeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // console.log(typeof uniqueDates);
  // console.log("filtered by log",typeof filteredByDate);
  return (
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
          <option value="15">15</option>
          <option value="5">5</option>
        </select>
      </label>
      <label>
        Date
        <select onChange={dateDropDownChange}>
        {uniqueDates.map(date => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>
      </label>
      {isLoading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <div className="table-container">
          <table className="active-oi-table">
            <thead>
              <tr>
                {/* <th>Strike Price</th> */}
                <th>Live Nifty</th>
                <th>Time</th>
                {/* -------5-------- */}
                {!checkFive ? (
                  <>
                    <th>CE OI</th>
                    <th>PE OI</th>
                    <th>Net Difference</th>
                    <th>PCR</th>
                    <th>COI Diff</th>
                    <th>Intraday Diff</th>
                    <th>Call OI Diff</th>
                    <th>Put OI Diff</th>
                  </>
                ) : (
                  <>
                    {/* --------15------- */}
                    <th>CE OI</th>
                    <th>PE OI</th>
                    <th>Net Difference</th>
                    <th>PCR</th>
                    <th>COI Diff</th>
                    <th>Intraday Diff</th>
                    <th>Call OI Diff</th>
                    <th>Put OI Diff</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredByDate?.map((item) => (
                <tr key={item?.id}>
                  {/* <td>
                    {Number(item?.strike_price).toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                  </td> */}
                  <td>
                    {Number(item?.live_nifty).toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td>
                    {new Date(item?.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  {!checkFive ? (
                    <>
                      <td>
                        {Number(item?.ce_oi).toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td>
                        {Number(item?.pe_oi).toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td>
                        {Number(item?.net_difference).toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td>{item?.pcr}</td>
                      <td>
                        {Number(item?.coi_difference).toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td>
                        {Number(item?.intraday_difference).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                          }
                        )}
                      </td>
                      <td>
                        {Number(item?.call_oi_difference).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                          }
                        )}
                      </td>
                      <td>
                        {Number(item?.put_oi_difference).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                          }
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        {Number(item?.large_ce_oi).toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td>
                        {Number(item?.large_pe_oi).toLocaleString("en-IN", {
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td>
                        {Number(item?.large_net_difference).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                          }
                        )}
                      </td>
                      <td>{item?.large_pcr}</td>
                      <td>
                        {Number(item?.large_coi_difference).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                          }
                        )}
                      </td>
                      <td>
                        {Number(item?.large_intraday_difference).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                          }
                        )}
                      </td>
                      <td>
                        {Number(item?.large_call_oi_difference).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                          }
                        )}
                      </td>
                      <td>
                        {Number(item?.large_put_oi_difference).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 0,
                          }
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
  );
}

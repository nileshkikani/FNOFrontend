"use client";
import { useEffect } from "react";
import ActiveOIGraph from "@/component/ActiveOi-Graphs/ActiveOI-Graph";
import ScatterPlotGraph from "@/component/ActiveOi-Graphs/ScatterPlot-Graph";
import useActiveOiData from "@/hooks/useActiveOiData";

export default function Page() {
  const {
    data,
    fetchActiveOIData,
    handlePrevious,
    handleNext,
    currentPage,
    isLoading,
    recordCount,
  } = useActiveOiData();

  useEffect(() => {
    fetchActiveOIData(currentPage);
    const intervalId = setInterval(() => {
      fetchActiveOIData(currentPage);
    }, 305000); //---5 minutes 5 seconds

    return () => clearInterval(intervalId);
  }, [currentPage]);

  const totalPages = Math.ceil(recordCount / 15);

  return (
    <>
      <div className="main-div">
        <div>
          <h1 className="table-title">Active OI Page</h1>
          <h1 className="table-title">total records : {recordCount || 0}</h1>
          {isLoading ? (
            <div className="loading">Loading data...</div>
          ) : (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Strike Price</th>
                    <th>Created At</th>
                    <th>CE OI</th>
                    <th>PE OI</th>
                    <th>Net Difference</th>
                    <th>PCR</th>
                    <th>COI Difference</th>
                    <th>Intraday Difference</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item) => (
                    <tr key={item?.id}>
                      <td>{item?.strike_price}</td>
                      <td>{new Date(item?.created_at).toLocaleString()}</td>
                      <td>{item?.ce_oi}</td>
                      <td>{item?.pe_oi}</td>
                      <td>{item?.net_difference}</td>
                      <td>{item?.pcr}</td>
                      <td>{item?.coi_difference}</td>
                      <td>{item?.intraday_difference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="btndiv">
            {currentPage === 1 ? null : (
              <button className="prevbtn" onClick={handlePrevious}>
                Previous
              </button>
            )}
            {currentPage === totalPages || totalPages === 0 ? null : (
              <button className="nextbtn" onClick={handleNext}>
                Next
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="main-div">
        <ActiveOIGraph />
      </div>
      <div className="main-div">
        <ScatterPlotGraph />
      </div>
    </>
  );
}

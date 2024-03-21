"use client";
import { API_ROUTER } from "@/services/apiRouter";
import axiosInstance from "@/utils/axios";
import { useEffect, useState } from "react";

export default function Page() {
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const getData = async (page) => {
    setIsLoading(true);
    await axiosInstance
      .get(`${API_ROUTER.OPTIONDATA_LIST}?page=${page}`)
      .then((response) => {
        // console.log(response.data.results);
        setApiData(response.data.results);
        setIsLoading(false);
      })
      .catch((err) => console.log("error calling API:", err));
  };

  useEffect(() => {
    getData(currentPage);
  }, [currentPage]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="main-div">
      <div>
        <h1 className="table-title">Option Data Page </h1>
        {isLoading ? (
          <div className="loading">Loading data...</div>
        ) : (
          <div>
            <span className="expiry">
              Expiry date: {apiData[0]?.expiry_date}
            </span>
            <div className="table-div">
              <table>
                <thead>
                  <tr>
                    <th>CREATED AT</th>
                    <th>CALL NET OI</th>
                    <th>CALL PRICE CHANGE </th>
                    <th>CALL VOLUME</th>
                    <th>CALL CHANGE OI</th>
                    <th>CALL LTP</th>
                    <th>STRIKE</th>
                    <th>PUT LTP</th>
                    <th>PUT CHANGE OI</th>
                    <th>PUT VOLUME</th>
                    <th>PUT PRICE CHANGE </th>
                    <th>PUT NET OI</th>
                  </tr>
                </thead>
                <tbody>
                  {apiData?.map((item) => (
                    <tr key={item?.id}>
                      <td>{new Date(item?.created_at).toLocaleString()}</td>
                      <td>{item?.call_net_oi}</td>
                      <td>{item?.call_price_change}</td>
                      <td>{item?.call_volume}</td>
                      <td>{item?.call_change_oi}</td>
                      <td>{item?.call_ltp}</td>
                      <td>{item?.strike_price}</td>
                      <td>{item?.put_ltp}</td>
                      <td>{item?.put_change_oi}</td>
                      <td>{item?.put_volume}</td>
                      <td>{item?.put_price_change}</td>
                      <td>{item?.put_net_oi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="btndiv">
          {currentPage === 1 ? (
            ""
          ) : (
            <button className="prevbtn" onClick={handlePrevious}>
              previous
            </button>
          )}
          <button className="nextbtn" onClick={handleNext}>
            next
          </button>
        </div>
      </div>
    </div>
  );
}

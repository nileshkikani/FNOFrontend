"use client";

import React from "react";
import useFutureData from "@/hooks/useFutureData";

function FutureData() {
  const {
    handleDateChange,
    dateConfig,
    FIRST_TABLE_DATA,
    SECOND_TABLE_DATA,
    FIRST_DATE_OPTIONS,
    SECOND_DATE_OPTIONS,
  } = useFutureData();

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "20px", color: "green" }}>
        Futures Data
      </h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          padding: "25px",
          gap: "20px",
        }}
      >
        <div style={{ width: "48%" }}>
          <div>
            <label htmlFor="dateDropdown">Select a Date: </label>
            <select
              id="dateDropdown"
              className="custom-date-input"
              value={dateConfig?.firstTableDate}
              onChange={(e) => handleDateChange(e, "firstTableDate")}
            >
              {FIRST_DATE_OPTIONS?.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
          {dateConfig?.firstTableDate && (
            <div>
              <h2 style={{ textAlign: "center", marginBottom: 8 }}>
                {dateConfig?.firstTableDate}
              </h2>
              <div className="scrolling-table">
                <table>
                  <thead>
                    <tr>
                      {/* <th>Date</th> */}
                      <th>Client Type</th>
                      <th>Future Long</th>
                      <th>Future Short</th>
                      <th>Net Diff</th>
                      <th>L/S Ratio</th>
                      <th></th>
                      <th>Future Long</th>
                      <th>Future Short</th>
                      <th>Net Diff</th>
                      <th>L/S Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FIRST_TABLE_DATA?.map((item) => (
                      <tr key={item.id}>
                        {/* <td>{item.date}</td> */}
                        <td>{item.client_type}</td>
                        <td>{item.future_index_long}</td>
                        <td>{item.future_index_short}</td>
                        <td>
                          {item.future_index_long && item.future_index_short
                            ? item.future_index_long - item.future_index_short
                            : "N/A"}
                        </td>
                        <td>
                          {item.future_index_long && item.future_index_short
                            ? (
                                item.future_index_long / item.future_index_short
                              ).toFixed(3)
                            : "N/A"}
                        </td>
                        <th>|</th>
                        <td>{item.future_stock_long}</td>
                        <td>{item.future_stock_short}</td>
                        <td>
                          {item.future_stock_long && item.future_stock_short
                            ? item.future_stock_long - item.future_stock_short
                            : "N/A"}
                        </td>
                        <td>
                          {item.future_stock_long && item.future_stock_short
                            ? (
                                item.future_stock_long / item.future_stock_short
                              ).toFixed(3)
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div style={{ width: "48%" }}>
          <div>
            <label htmlFor="dateDropdown">Select a Date: </label>
            <select
              className="custom-date-input"
              id="dateDropdown"
              value={dateConfig.secondTableDate}
              onChange={(e) => handleDateChange(e, "secondTableDate")}
            >
              {SECOND_DATE_OPTIONS?.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>
          {dateConfig?.secondTableDate && (
            <div>
              <h2 style={{ textAlign: "center", marginBottom: 8 }}>
                {dateConfig?.secondTableDate}
              </h2>
              <div className="scrolling-table">
                <table>
                  <thead>
                    <tr>
                      {/* <th>Date</th> */}
                      <th>Client Type</th>
                      <th>Future Long</th>
                      <th>Future Short</th>
                      <th>Net Diff</th>
                      <th>L/S Ratio</th>
                      <th></th>
                      <th>Future Long</th>
                      <th>Future Short</th>
                      <th>Net Diff</th>
                      <th>L/S Ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SECOND_TABLE_DATA?.map((item) => (
                      <tr key={item.id}>
                        {/* <td>{item.date}</td> */}
                        <td>{item.client_type}</td>
                        <td>{item.future_index_long}</td>
                        <td>{item.future_index_short}</td>
                        <td>
                          {item.future_index_long && item.future_index_short
                            ? item.future_index_long - item.future_index_short
                            : "N/A"}{" "}
                        </td>
                        <td>
                          {item.future_index_long && item.future_index_short
                            ? (
                                item.future_index_long / item.future_index_short
                              ).toFixed(3)
                            : "N/A"}{" "}
                        </td>
                        <th>|</th>
                        <td>{item.future_stock_long}</td>
                        <td>{item.future_stock_short}</td>
                        <td>
                          {item.future_stock_long && item.future_stock_short
                            ? item.future_stock_long - item.future_stock_short
                            : "N/A"}{" "}
                        </td>
                        <td>
                          {item.future_stock_long && item.future_stock_short
                            ? (
                                item.future_stock_long / item.future_stock_short
                              ).toFixed(3)
                            : "N/A"}{" "}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div>
          {dateConfig?.firstTableDate && dateConfig?.secondTableDate && (
            <div style={{ width: "48%" }}>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>ROC(FIL&FIS)</th>
                      <th></th>
                      <th>ROC(FSL&FSS)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SECOND_TABLE_DATA?.map((s1, index) => (
                      <tr key={s1.id}>
                        <td>
                          {FIRST_TABLE_DATA?.[index] &&
                            FIRST_TABLE_DATA?.[index].future_index_long -
                              FIRST_TABLE_DATA?.[index].future_index_short -
                              (s1.future_index_long - s1.future_index_short)}
                        </td>
                        <td>|</td>
                        <td>
                          {FIRST_TABLE_DATA?.[index] &&
                            FIRST_TABLE_DATA?.[index].future_stock_long -
                              FIRST_TABLE_DATA?.[index].future_stock_short -
                              (s1.future_stock_long - s1.future_stock_short)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FutureData;

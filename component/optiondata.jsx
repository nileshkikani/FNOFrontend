// "use client";

// import React, { useMemo } from "react";
// import axiosInstance from "@/utils/axios";
// import { API_ROUTER } from "@/services/apiRouter";
// import { useEffect } from "react";
// import { useState } from "react";
// import useOptionsData from "@/hooks/useOptionsData";

// function OptionsData() {
//   const {
//     handleDateChange,
//     dateConfig,
//     FIRST_TABLE_DATA,
//     SECOND_TABLE_DATA,
//     FIRST_DATE_OPTIONS,
//     SECOND_DATE_OPTIONS,
//   } = useOptionsData();

//   return (
//     <>
//       <h1 style={{ textAlign: "center", marginTop: "20px", color: "green" }}>
//         Options Writers
//       </h1>
//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           padding: "25px",
//           gap: "20px",
//         }}
//       >
//         <div style={{ width: "48%" }}>
//           <div>
//             <label htmlFor="dateDropdown">Select a Date: </label>
//             <select
//               className="custom-date-input"
//               id="dateDropdown"
//               value={dateConfig.firstTableDate}
//               onChange={(e) => handleDateChange(e, "firstTableDate")}
//             >
//               {/*-------CHRONOLOGICALLY DATE SORTING------- */}
//               {FIRST_DATE_OPTIONS?.slice()
//                 .sort((a, b) => new Date(a) - new Date(b))
//                 .map((date) => (
//                   <option key={date} value={date}>
//                     {date}
//                   </option>
//                 ))}
//             </select>
//           </div>
//           {dateConfig?.firstTableDate && (
//             <div>
//               <h2 style={{ textAlign: "center", marginBottom: 8 }}>
//                 {dateConfig?.firstTableDate}
//               </h2>
//               <div className="scrolling-table">
//                 <table>
//                   <thead>
//                     <tr>
//                       {/* <th>Date</th> */}
//                       <th>Client Type</th>
//                       <th>Call Long</th>
//                       <th>Call Short</th>
//                       <th>Net Diff</th>
//                       <th>L/S Ratio</th>
//                       <th></th>
//                       <th>Put Long</th>
//                       <th>Put Short</th>
//                       <th>Net Diff</th>
//                       <th>L/S Ratio</th>
//                       <th></th>
//                       <th>Call Long</th>
//                       <th>Call Short</th>
//                       <th>Net Diff</th>
//                       <th>L/S Ratio</th>
//                       <th></th>
//                       <th>Put Long</th>
//                       <th>Put Short</th>
//                       <th>Net Diff</th>
//                       <th>L/S Ratio</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {FIRST_TABLE_DATA?.map((item) => (
//                       <tr key={item.id}>
//                         {/* <td>{item.date}</td> */}
//                         <td>{item.client_type}</td>
//                         <td>{item.option_index_call_long}</td>
//                         <td>{item.option_index_call_short}</td>
//                         <td>
//                           {item.option_index_call_long &&
//                           item.option_index_call_short
//                             ? item.option_index_call_long -
//                               item.option_index_call_short
//                             : "N/A"}{" "}
//                         </td>
//                         <td>
//                           {item.option_index_call_long &&
//                           item.option_index_call_short
//                             ? (
//                                 item.option_index_call_long /
//                                 item.option_index_call_short
//                               ).toFixed(3)
//                             : "N/A"}{" "}
//                         </td>
//                         <th>|</th>

//                         <td>{item.option_index_put_long}</td>
//                         <td>{item.option_index_put_short}</td>
//                         <td>
//                           {item.option_index_put_long &&
//                           item.option_index_put_short
//                             ? item.option_index_put_long -
//                               item.option_index_put_short
//                             : "N/A"}{" "}
//                         </td>
//                         <td>
//                           {item.option_index_put_long &&
//                           item.option_index_put_short
//                             ? (
//                                 item.option_index_put_long /
//                                 item.option_index_put_short
//                               ).toFixed(3)
//                             : "N/A"}{" "}
//                         </td>
//                         <th>|</th>

//                         <td>{item.option_stock_call_long}</td>
//                         <td>{item.option_stock_call_short}</td>
//                         <td>
//                           {item.option_stock_call_long &&
//                           item.option_stock_call_short
//                             ? item.option_stock_call_long -
//                               item.option_stock_call_short
//                             : "N/A"}{" "}
//                         </td>
//                         <td>
//                           {item.option_stock_call_long &&
//                           item.option_stock_call_short
//                             ? (
//                                 item.option_stock_call_long /
//                                 item.option_stock_call_short
//                               ).toFixed(3)
//                             : "N/A"}{" "}
//                         </td>

//                         <th>|</th>

//                         <td>{item.option_stock_put_long}</td>
//                         <td>{item.option_stock_put_short}</td>
//                         <td>
//                           {item.option_stock_put_long &&
//                           item.option_stock_put_short
//                             ? item.option_stock_put_long -
//                               item.option_stock_put_short
//                             : "N/A"}{" "}
//                         </td>
//                         <td>
//                           {item.option_stock_put_long &&
//                           item.option_stock_put_short
//                             ? (
//                                 item.option_stock_put_long /
//                                 item.option_stock_put_short
//                               ).toFixed(3)
//                             : "N/A"}{" "}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//         <div style={{ width: "48%" }}>
//           <div>
//             <label htmlFor="dateDropdown">Select a Date: </label>
//             <select
//               className="custom-date-input"
//               id="dateDropdown"
//               value={dateConfig.secondTableDate}
//               onChange={(e) => handleDateChange(e, "secondTableDate")}
//             >
//               {SECOND_DATE_OPTIONS?.map((date) => (
//                 <option key={date} value={date}>
//                   {date}
//                 </option>
//               ))}
//             </select>
//           </div>
//           {dateConfig?.secondTableDate && (
//             <div>
//               <h2 style={{ textAlign: "center", marginBottom: 8 }}>
//                 {dateConfig?.secondTableDate}
//               </h2>
//               <div className="scrolling-table">
//                 <table>
//                   <thead>
//                     <tr>
//                       {/* <th>Date</th> */}
//                       <th>Client Type</th>
//                       <th>Call Long</th>
//                       <th>Call Short</th>
//                       <th>Net Diff</th>
//                       <th>L/S Ratio</th>
//                       <th></th>
//                       <th>Put Long</th>
//                       <th>Put Short</th>
//                       <th>Net Diff</th>
//                       <th>L/S Ratio</th>
//                       <th></th>
//                       <th>Call Long</th>
//                       <th>Call Short</th>
//                       <th>Net Diff</th>
//                       <th>L/S Ratio</th>
//                       <th></th>
//                       <th>Put Long</th>
//                       <th>Put Short</th>
//                       <th>Net Diff</th>
//                       <th>L/S Ratio</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {SECOND_TABLE_DATA?.map((item) => (
//                       <tr key={item.id}>
//                         {/* <td>{item.date}</td> */}
//                         <td>{item.client_type}</td>
//                         <td>{item.option_index_call_long}</td>
//                         <td>{item.option_index_call_short}</td>
//                         <td>
//                           {item.option_index_call_long &&
//                           item.option_index_call_short
//                             ? item.option_index_call_long -
//                               item.option_index_call_short
//                             : "N/A"}{" "}
//                         </td>
//                         <td>
//                           {item.option_index_call_long &&
//                           item.option_index_call_short
//                             ? (
//                                 item.option_index_call_long /
//                                 item.option_index_call_short
//                               ).toFixed(3)
//                             : "N/A"}{" "}
//                         </td>
//                         <th>|</th>

//                         <td>{item.option_index_put_long}</td>
//                         <td>{item.option_index_put_short}</td>
//                         <td>
//                           {item.option_index_put_long &&
//                           item.option_index_put_short
//                             ? item.option_index_put_long -
//                               item.option_index_put_short
//                             : "N/A"}{" "}
//                         </td>
//                         <td>
//                           {item.option_index_put_long &&
//                           item.option_index_put_short
//                             ? (
//                                 item.option_index_put_long /
//                                 item.option_index_put_short
//                               ).toFixed(3)
//                             : "N/A"}{" "}
//                         </td>
//                         <th>|</th>

//                         <td>{item.option_stock_call_long}</td>
//                         <td>{item.option_stock_call_short}</td>
//                         <td>
//                           {item.option_stock_call_long &&
//                           item.option_stock_call_short
//                             ? item.option_stock_call_long -
//                               item.option_stock_call_short
//                             : "N/A"}{" "}
//                         </td>
//                         <td>
//                           {item.option_stock_call_long &&
//                           item.option_stock_call_short
//                             ? (
//                                 item.option_stock_call_long /
//                                 item.option_stock_call_short
//                               ).toFixed(3)
//                             : "N/A"}{" "}
//                         </td>

//                         <th>|</th>

//                         <td>{item.option_stock_put_long}</td>
//                         <td>{item.option_stock_put_short}</td>
//                         <td>
//                           {item.option_stock_put_long &&
//                           item.option_stock_put_short
//                             ? item.option_stock_put_long -
//                               item.option_stock_put_short
//                             : "N/A"}{" "}
//                         </td>
//                         <td>
//                           {item.option_stock_put_long &&
//                           item.option_stock_put_short
//                             ? (
//                                 item.option_stock_put_long /
//                                 item.option_stock_put_short
//                               ).toFixed(3)
//                             : "N/A"}{" "}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>

//         <div>
//           {dateConfig?.firstTableDate && dateConfig?.secondTableDate && (
//             <div style={{ width: "48%" }}>
//               <div>
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>ROC(OICL&OICL)</th>
//                       <th></th>
//                       <th>ROC(OIPL&OIPS)</th>
//                       <th></th>
//                       <th>ROC(OSCL&OSCS)</th>
//                       <th></th>
//                       <th>ROC(OSPL&OSPS)</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {SECOND_TABLE_DATA?.map((s1, index) => (
//                       <tr key={s1.id}>
//                         <td>
//                           {FIRST_TABLE_DATA?.[index] &&
//                             FIRST_TABLE_DATA?.[index].option_index_call_long -
//                               FIRST_TABLE_DATA?.[index]
//                                 .option_index_call_short -
//                               (s1.option_index_call_long -
//                                 s1.option_index_call_short)}
//                         </td>
//                         <td>|</td>
//                         <td>
//                           {FIRST_TABLE_DATA?.[index] &&
//                             FIRST_TABLE_DATA?.[index].option_index_put_long -
//                               FIRST_TABLE_DATA?.[index].option_index_put_short -
//                               (s1.option_index_put_long -
//                                 s1.option_index_put_short)}
//                         </td>
//                         <td>|</td>

//                         <td>
//                           {FIRST_TABLE_DATA?.[index] &&
//                             FIRST_TABLE_DATA?.[index].option_stock_call_long -
//                               FIRST_TABLE_DATA?.[index]
//                                 .option_stock_call_short -
//                               (s1.option_stock_call_long -
//                                 s1.option_stock_call_short)}
//                         </td>
//                         <td>|</td>
//                         <td>
//                           {FIRST_TABLE_DATA?.[index] &&
//                             FIRST_TABLE_DATA?.[index].option_stock_put_long -
//                               FIRST_TABLE_DATA?.[index].option_stock_put_short -
//                               (s1.option_stock_put_long -
//                                 s1.option_stock_put_short)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }

// export default OptionsData;

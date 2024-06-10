import React,{useState,useEffect} from 'react';
import axios from 'axios';

// ------HOOKS------

const ActiveOiTable = ({strikeAtm,data}) => {
 
  const getClass = (value) => {
    return value < 0 ? 'red-oi-table' : 'green-oi-table';
  };

  return (
    <>
      <div className="table-container1">
        <table className="table1">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Live Nifty</th>
              <th className="table-header-cell">Predicted Nifty</th>
              <th className="table-header-cell">Time</th>
              <th className="table-header-cell">CE OI</th>
              <th className="table-header-cell">PE OI</th>
              <th className="table-header-cell">Net Difference</th>
              <th className="table-header-cell">PCR</th>
              <th className="table-header-cell">COI Diff</th>
              <th className="table-header-cell">Intraday Diff</th>
              <th className="table-header-cell">Call OI Diff</th>
              <th className="table-header-cell">Put OI Diff</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data && data?.map((item) => (
              <tr key={item?.id}>
                <td className="table-cell">
                  {Number(item?.live_nifty).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </td>
                <td className="table-cell">{item.predicted_nifty}</td>
                <td className="table-cell">
                  {new Date(item?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                {strikeAtm && strikeAtm == "15" ? (
                  <>
                    <td className="table-cell">
                      {Number(item?.large_ce_oi).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="table-cell">
                      {Number(item?.large_pe_oi).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="table-cell">
                      {Number(item?.large_net_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="table-cell">{item?.large_pcr}</td>
                    <td className="table-cell">
                      {Number(item?.large_coi_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className={getClass(item?.large_intraday_difference)}>
                      {Number(item?.large_intraday_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="table-cell">
                      {Number(item?.large_call_oi_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="table-cell">
                      {Number(item?.large_put_oi_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                  </>
                ) : (
                  <>
                    <td className="table-cell">
                      {Number(item?.ce_oi).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="table-cell">
                      {Number(item?.pe_oi).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="table-cell">
                      {Number(item?.net_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="table-cell">{item?.pcr}</td>
                    <td className="table-cell">
                      {Number(item?.coi_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className={getClass(item?.intraday_difference)}>
                      {Number(item?.intraday_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="table-cell">
                      {Number(item?.call_oi_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td className="table-cell">
                      {Number(item?.put_oi_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ActiveOiTable;

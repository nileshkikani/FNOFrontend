import React from 'react';

// ------HOOKS------
import useActiveOiData from '@/hooks/useActiveOiData';

const ActiveOiTable = () => {
  const { filteredByDate, checkFive } = useActiveOiData();


  const getClass = (value) => {
    return value < 0 ? 'red-oi-table' : 'green-oi-table';
  };

  return (
    <>
      <div className="table-container">
        <table className="active-oi-table">
          <thead>
            <tr>
              <th>Live Nifty</th>
              <th>Time</th>
                  <th>CE OI</th>
                  <th>PE OI</th>
                  <th>Net Difference</th>
                  <th>PCR</th>
                  <th>COI Diff</th>
                  <th>Intraday Diff</th>
                  <th>Call OI Diff</th>
                  <th>Put OI Diff</th>
            </tr>
          </thead>
          <tbody>
            {filteredByDate?.map((item) => (
              <tr key={item?.id}>
                <td>{Number(item?.live_nifty).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                <td>{new Date(item?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                {!checkFive ? (
                  <>
                    <td>{Number(item?.ce_oi).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td>{Number(item?.pe_oi).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td>{Number(item?.net_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td>{item?.pcr}</td>
                    <td>{Number(item?.coi_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td className={getClass(item?.intraday_difference)}>
                      {Number(item?.intraday_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td>
                      {Number(item?.call_oi_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td>{Number(item?.put_oi_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  </>
                ) : (
                  <>
                    <td>{Number(item?.large_ce_oi).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td>{Number(item?.large_pe_oi).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td>{Number(item?.large_net_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td>{item?.large_pcr}</td>
                    <td>{Number(item?.large_coi_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td className={getClass(item?.large_intraday_difference)}>
                      {Number(item?.large_intraday_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td>
                      {Number(item?.large_call_oi_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </td>
                    <td>
                      {Number(item?.large_put_oi_difference).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
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

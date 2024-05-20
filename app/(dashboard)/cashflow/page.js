'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

//--------HOOKS---------------
import useCashflowData from '@/hooks/useCashflowData';

//-----GRAPH COMPONENTS----------
const MoneyFlowGraph = dynamic(() => import('@/component/MoneyFlow-Graphs/MoneyFlow-Graph'));
import { useAppSelector } from '@/store';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import ActiveMoneyFlow from "@/component/MoneyFlow-Graphs/ActiveMoneyFlow-Graph";
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

//  ===========LOADING ANIMATION ===========
const PropagateLoader = dynamic(() => import('react-spinners/PropagateLoader'));

const Page = () => {
  const { handleResponceError } = useAuth();
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedScript, setSelectedScript] = useState("");
  const [allDates, setAllDates] = useState("");
  const [allScript, setAllScript] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const authState = useAppSelector((state) => state.auth.authState);
 
  const getData = async () => {    
    try {
      setLoading(true);
      let apiUrl = `${API_ROUTER.CASH_FLOW_TOP_TEN}`;
      
      const response = await axiosInstance.get(selectedDate && selectedScript ? apiUrl += `?date=${selectedDate}&symbol=${selectedScript}`: apiUrl, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });
      if (response.status == 200) {
        if(!allDates && !selectedDate && !selectedScript){
          setAllDates(response?.data?.dates)
          setAllScript(response?.data?.symbols)
          setSelectedDate(response?.data?.dates[0])
          setSelectedScript(response?.data?.symbols?.find(item => item === "HDFCBANK"))
          setLoading(false)
          return
        }
        setData(response?.data)
        setLoading(false)    
      }
      else{
        router.push('/login');
      }
    } catch (err) {
      handleResponceError()
      console.log('error is this:', err);
    }
  };

  useEffect(() => {
    authState && getData();
  }, []);

  useEffect(() => {
     getData();
  }, [selectedScript,selectedDate]);
  
  const filterByStockAndDate = (event, isDateDropdown) => {
    isDateDropdown ? setSelectedDate(event.target.value) :setSelectedScript(event.target.value)      
  };

  return (<>
      <div className="graph-div"> <ActiveMoneyFlow data={data}/> </div>
  
  {/* -----------------------DATE DROPDOWN------------------- */}
  <h1 className="table-title">SELECT DATE</h1>
      <select onChange={(e) => filterByStockAndDate(e, true)} value={selectedDate ?selectedDate :"" } className="stock-dropdown">
        {allDates && allDates?.map((stockData, index) => (
          <option key={index} value={stockData}>
            {stockData}
          </option>
        ))}
      </select>
      <button
      className="refresh-button"
      onClick={()=>getData()}
    >
      Refresh
    </button>
      {/* -------------------STOCK DROPDOWN---------------------- */}
      <h1 className="table-title">SELECT SCRIPT</h1>
      <select value={selectedScript}  onChange={(e) => filterByStockAndDate(e, false)} className="stock-dropdown">
        {allScript && allScript?.map((stockData, index) => (
          <option key={index} value={stockData}>
            {stockData}
          </option>
        ))}
      </select>
  {
    loading? (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh'
        }}
      >
        <PropagateLoader color="#33a3e3" loading={loading} size={15} />
      </div>
    ):(<>
      <div>
        {data && (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Close</th>
                  <th>Open</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>Average</th>
                  <th>
                    Volume<span className="in-thousand">in thousand</span>
                  </th>
                  <th>
                    Money Flow
                    <span className="in-thousand">in thousand</span>
                  </th>
                  <th>
                    Net Money Flow
                    <span className="in-thousand">in thousand</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data
                  .slice()
                  .reverse()
                  .map((item) => (
                    <tr key={item?.id}>
                      <td>{item?.time}</td>
                      <td>{item?.close}</td>
                      <td>{item?.open}</td>
                      <td>{item?.high}</td>
                      <td>{item?.low}</td>
                      <td>{item?.average}</td>
                      <td>{item?.volume}</td>
                      <td>{item?.money_flow}</td>
                      <td>{item?.net_money_flow}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="graph-div"> <MoneyFlowGraph data={data}/> </div>
    </>
    )
  }
    </>
  );
};

export default Page;

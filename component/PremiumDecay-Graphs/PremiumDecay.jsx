'use client'
import React,{useState,useEffect} from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';


// const sumByTimestamp = (data) => {
//   const result = {};

//   data.forEach(strikeData => {
//     strikeData.forEach(item => {
//       const { created_at, call_decay, put_decay, total_call_decay, total_put_decay } = item;

//       if (!result[created_at]) {
//         result[created_at] = {
//           created_at,
//           call_decay: 0,
//           put_decay: 0,
//           total_call_decay: 0,
//           total_put_decay: 0
//         };
//       }

//       result[created_at].call_decay += call_decay;
//       result[created_at].put_decay += put_decay;
//       result[created_at].total_call_decay += total_call_decay;
//       result[created_at].total_put_decay += total_put_decay;
//     });
//   });

//   return Object.values(result);
// };


const PremiumDecayChart = ({ data, isChecked }) => {
  const [fullFinalData,setFullFinalData] = useState([])
  console.log('initial', data);
  useEffect(()=>{
  if(data.length<=2){
    setFullFinalData(data[1].data)
  }else {
    let filteredByStrike = [];
    let allSelectedStrikeData = []
    const filteredData = data
      .filter((sp) => isChecked.includes(sp.strike_price))
      .map((i) => filteredByStrike.push(i.data));
    console.log('inLoop', filteredData);

    if (filteredByStrike.length > 1) {
      filteredByStrike.map((i) => 
        i.map((j) => {
//got all data of selected strikes here, 
//now do sum of data filter by time--(check filtering by time in browser console to get better idea)
          console.log(j,'jlog');
          allSelectedStrikeData.push(j);
        })
      );
    }


    // -------------mybe helpfull to apply filter data by time--------
    //  new Date(created_at).toLocaleTimeString([], {
    //   hour: '2-digit',
    //   minute: '2-digit'
    // }) 
    // function deepCopy(array) {
    //   return JSON.parse(JSON.stringify(array));
    // }
    // -------------time modification-------------
    function modifyTime(dataArray) {
      return dataArray.map(item => {
        const date = new Date(item.created_at);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        
        // Create a new object with modified time (example modification: adding 1 hour)
        const newDate = new Date(date);
        newDate.setHours(newDate.getHours() + 1);
        const newHours = newDate.getHours().toString().padStart(2, '0');
        const newMinutes = newDate.getMinutes().toString().padStart(2, '0');
        // const newTime = `${newHours}:${newMinutes}`;
    
        // Return a new object with modified time
        return {
          ...item,
          original_time: time,
          // modified_time: newTime,
        };
      });
    }


    function groupAndSum(dataArray) {
      return dataArray.reduce((acc, item) => {
        if (!acc[item.original_time]) {
          acc[item.original_time] = {
            original_time: item.original_time,
            call_decay: 0,
            put_decay: 0,
            total_call_decay: 0,
            total_put_decay: 0
          };
        }
        
        // Sum the fields
        acc[item.original_time].call_decay += item.call_decay || 0;
        acc[item.original_time].put_decay += item.put_decay || 0;
        acc[item.original_time].total_call_decay += item.total_call_decay || 0;
        acc[item.original_time].total_put_decay += item.total_put_decay || 0;
        
        return acc;
      }, {});
    }

    const copiedArray = [...allSelectedStrikeData];
    let afterTimeModification = modifyTime(copiedArray)
    
    //filter this all data by original_time key and then sum it, then add to new array and pass that array to component
    // console.log('allSelectedStrikeData',allSelectedStrikeData)

   
    // --------------after time modification--------------
    console.log('afterTimeModification',afterTimeModification)

    const groupedAndSummed = groupAndSum(afterTimeModification);
    const resultArray = Object.values(groupedAndSummed);

    console.log('fullfinal',resultArray)
    setFullFinalData(resultArray)
  }
},[])
  // const prepareChartData = () => {
  //   let chartData = [];
  //   if (!Array.isArray(data) || data.length === 0) {
  //     return chartData;
  //   }

  //   data.forEach((item) => {
  //     const strikePrice = item.strike_price;
  //     const itemData = item.data;

  //     if (!Array.isArray(itemData) || itemData.length === 0) {
  //       return;
  //     }

  //     itemData.forEach((dataItem) => {
  //       const createdAt = dataItem.created_at;
  //       const callDecay = dataItem.call_decay;
  //       const putDecay = dataItem.put_decay;
  //       const TotalPutDecay = dataItem.total_put_decay;
  //       const TotalCallDecay = dataItem.total_call_decay;

  //       let existingEntry = chartData.find((entry) => entry.created_at === createdAt);

  //       if (!existingEntry) {
  //         existingEntry = {
  //           created_at: new Date(createdAt),
  //           strikePrice
  //         };
  //         chartData.push(existingEntry);
  //       }

  //       if (callDecay !== undefined) {
  //         existingEntry.call_decay = callDecay;
  //       }
  //       if (putDecay !== undefined) {
  //         existingEntry.put_decay = putDecay;
  //       }
  //       if (TotalPutDecay !== undefined) {
  //         existingEntry.total_put_decay = TotalPutDecay;
  //       }
  //       if (TotalCallDecay !== undefined) {
  //         existingEntry.total_call_decay = TotalCallDecay;
  //       }
  //     });
  //   });

  //   chartData.sort((a, b) => a.created_at - b.created_at);

  //   return chartData;
  // };

  // const chartData = prepareChartData();

  console.log('final',fullFinalData)

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ComposedChart data={fullFinalData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="original_time"
          // tickFormatter={(timeStr) =>
          //   new Date(timeStr).toLocaleTimeString([], {
          //     hour: '2-digit',
          //     minute: '2-digit'
          //   })
          // }
        />
        <YAxis yAxisId="left" />
        <YAxis yAxisId="right" orientation="right" />
        <Tooltip
          labelFormatter={(timeStr) =>
            new Date(timeStr).toLocaleTimeString([], {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }
          content={(tooltipProps) => {
            const { label, payload } = tooltipProps;
            if (!payload || payload.length === 0) return null;
            const { created_at } = payload[0].payload;
            const formattedDate = new Date(created_at).toLocaleString();
            return (
              <div
                // className="custom-tooltip"
                style={{ backgroundColor: '#ffffff', padding: '10px', border: '1px solid #cccccc' }}
              >
                <p>{formattedDate}</p>
                {payload.map((entry, index) => (
                  <p key={`item-${index}`}>
                    {entry.name}: {entry.value}
                  </p>
                ))}
                {/* <p>Strike Price: {payload[0].payload.strikePrice}</p> */}
              </div>
            );
          }}
        />
        <Legend />
        <Line
          yAxisId="right"
          type="linear"
          dataKey="total_call_decay"
          name="Total Call Decay"
          stroke="#63D168"
          dot={false}
        />
        <Line
          yAxisId="right"
          type="linear"
          dataKey="total_put_decay"
          name="Total Put Decay"
          stroke="#E96767"
          dot={false}
        />
        <Bar yAxisId="left" dataKey="call_decay" name="Call Decay" fill="#63D168" />
        <Bar yAxisId="left" dataKey="put_decay" name="Put Decay" fill="#E96767" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default PremiumDecayChart;

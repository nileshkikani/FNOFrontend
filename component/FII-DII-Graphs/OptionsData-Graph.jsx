import React, { useState, useEffect } from 'react';
import {
  Brush,
  XAxis,
  ComposedChart,
  Line,
  Bar,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

// import useFiiDiiData from '@/hooks/useFiiDiiData';

const OptionDataGraph = ({filteredByClient}) => {
  // const { filteredClientData } = useFiiDiiData();
  const [yAxisDomain, setYAxisDomain] = useState([0, 100]);

  useEffect(() => {
    const callOiValues = filteredByClient.map((item) => item.dif_index_call);
    const putOiValues = filteredByClient.map((item) => item.dif_index_put);
    const allValues = callOiValues.concat(putOiValues);
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    setYAxisDomain([minValue, maxValue]);
  }, [filteredByClient]);

  return (
    <>
      <div style={{ width: '100%', height: '400px' }}>
        <h1 className="table-title">INDEX OPTION OI</h1>
        <ResponsiveContainer width="100%" height="110%">
          <ComposedChart
            width={500}
            height={400}
            data={filteredByClient}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid />
            <XAxis
              dataKey="date"
              tickFormatter={(timeStr) => {
                const date = new Date(timeStr);
                const monthIndex = date.getMonth();
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const monthAbbreviation = months[monthIndex];
                const dayOfMonth = date.getDate();
                return `${dayOfMonth} ${monthAbbreviation}`;
              }}
            />
            <YAxis domain={yAxisDomain} />
            <Tooltip />
            <Legend />
            <Bar name="call oi" dataKey="dif_index_call" fill="#63D168" activeDot={{ r: 8 }} />
            <Bar name="put oi" dataKey="dif_index_put" fill="#E96767" activeDot={{ r: 8 }} />
            {/* <Brush dataKey="date" height={30} stroke="#0A3D62" /> */}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default OptionDataGraph;

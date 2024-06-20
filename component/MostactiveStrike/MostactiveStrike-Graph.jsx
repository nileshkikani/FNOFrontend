import React from 'react'
import {
    Bar,
    XAxis,
    ResponsiveContainer,
    YAxis,
    CartesianGrid,
    Tooltip,
    ComposedChart
  } from 'recharts';

const MostactiveStrike = ({data}) => {
  return (
    <>
    <h1 className="table-title">Most Active</h1>
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="110%">
        <ComposedChart
          width={500}
          height={400}
          data={data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          }}
        >
          <CartesianGrid stroke="#E5E5E5" />
          <XAxis
            dataKey="strike_price"
          />
          <YAxis yAxisId="left" />
          <Tooltip
          />
          <Bar yAxisId="left" name="call oi chnage" dataKey="call_oi_change" fill="#E96767" />
          <Bar yAxisId="left" name="put oi change" dataKey="put_oi_change" fill="#63D168" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </>
  )
}

export default MostactiveStrike
import React, { useState } from 'react'
import { StoryFn, Meta } from '@storybook/react'
import RecoverTimeGraph from '../src/RecoverTimeGraph'
import { ChartProps } from '../src/interfaces/propInterfaces'
import DatePicker from "react-datepicker"
import '../node_modules/react-datepicker/dist/react-datepicker.css'
import dataSet from './data'
import { DoraRecord } from '../src/interfaces/apiInterfaces'

export default {
  title: 'RecoverTimeGraph',
  component: RecoverTimeGraph,
} as Meta

const getDateRange = (data: DoraRecord[]) : {start: Date, end: Date} => {
  return data.reduce(
    (acc, item) => {
      if (item.created_at < acc.start) {
        acc.start = item.created_at;
      }
      if (item.created_at > acc.end) {
        acc.end = item.created_at;
      }
      return acc;
    },
    { start: new Date(), end: new Date() }
  );
}

const Template: StoryFn<ChartProps> = () => {
  const {start, end} = getDateRange(dataSet[0])

  const [data, setData] = useState<any>(dataSet[0])
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string | undefined>()
  const [graphStartDate, setGraphStartDate] = useState<Date>(start)
  const [graphEndDate, setGraphEndDate] = useState<Date>(end)
  const [calendarStartDate, setCalendarStartDate] = useState<Date>(start)
  const [calendarEndDate, setCalendarEndDate] = useState<Date>(end)

  const changeDataSet = (event: any) => {
    setData(dataSet[event.target.value])

    const {start, end} = getDateRange(dataSet[event.target.value])
console.log(start, end)
    setGraphStartDate(start)
    setGraphEndDate(end)
    setCalendarStartDate(start)
    setCalendarEndDate(end)
  }

  const changeLoading = (event: any) => {
    setLoading(event.target.checked)
  }

  const changeMessage = (event: any) => {
    if(event.target.value !== message) {
      setMessage(event.target.value)
    }
  }

  const changeDateRange = async ( dates: any ) => {
    const [start, end] = dates;
    console.log(start, end)

    setCalendarStartDate(start)
    setCalendarEndDate(end)

    if(!start || !end) {
      return
    }

    setGraphStartDate(start)
    setGraphEndDate(end)
  }

  return (
    <div style={{height: "200px", width: "600px"}}>
    <div style={{display: "flex", justifyContent: "space-evenly", alignItems:"center", color: "white"}}>
      <div>
        <label>Data Set:</label>
        <select onChange={changeDataSet}>
          <option value={0} selected>Low</option>
          <option value={1}>High</option>
          <option value={2}>Medium</option>
          <option value={3}>Elite</option>
          <option value={4}>Team</option>
        </select>
      </div>
      <div>
        <label>Loading:</label>
        <input type='checkbox' checked={loading} onChange={changeLoading} />
      </div>
      <div>
        <label>Message:</label>
        <input type='text' value={message ?? ""} onChange={changeMessage} />
      </div>
      <div>
        <label>Graph Date Range:</label>
        <DatePicker
            selected={calendarStartDate}
            onChange={changeDateRange}
            startDate={calendarStartDate}
            endDate={calendarEndDate}
            selectsRange
            popperPlacement="bottom"
          />
      </div>
    </div>
      <br/>
      <br/>
      <RecoverTimeGraph graphStart={graphStartDate} graphEnd={graphEndDate} loading={loading} message={message} data={data} />
    </div>
  )
}

export const Example = Template.bind({})
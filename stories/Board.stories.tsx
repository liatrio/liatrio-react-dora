import React, { useState } from 'react'
import { StoryFn, Meta } from '@storybook/react'
import Board from '../src/Boards/Board'
import { ChartProps, MetricThresholdSet } from '../src/interfaces/propInterfaces'

import dataSet from './data'
import DatePicker from 'react-datepicker'
import { changeFailureRateName, changeLeadTimeName, defaultMetricThresholdSet, deploymentFrequencyName, recoverTimeName } from '../src/constants'
import { getDateDaysInPast } from '../src/functions/dateFunctions'
import { DoraRecord } from '../src/interfaces/apiInterfaces'

import './general.css'

export default {
  title: 'Board',
  component: Board,
} as Meta

const getDateRange = (data: DoraRecord[]) : {start: Date, end: Date} => {
  const defaultStart = getDateDaysInPast(-3000)
  const defaultEnd = getDateDaysInPast(3000)

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
    { start: defaultStart, end: defaultEnd }
  );
}

const Template: StoryFn<ChartProps> = () => {
  const {start, end} = getDateRange(dataSet[0])

  const [data, setData] = useState<any>(dataSet[0])
  const [loading, setLoading] = useState<boolean>(false)
  const [includeWeekends, setIncludeWeekends] = useState<boolean>(false)
  const [message, setMessage] = useState<string | undefined>()
  const [graphStartDate, setGraphStartDate] = useState<Date>(start)
  const [graphEndDate, setGraphEndDate] = useState<Date>(end)
  const [calendarStartDate, setCalendarStartDate] = useState<Date>(start)
  const [calendarEndDate, setCalendarEndDate] = useState<Date>(end)
  const [metricThresholdSet, setMetricThresholdSet] = useState<MetricThresholdSet>({...defaultMetricThresholdSet})

  const changeDataSet = (event: any) => {
    setData(dataSet[event.target.value])

    const {start, end} = getDateRange(dataSet[event.target.value])

    setGraphStartDate(start)
    setGraphEndDate(end)
    setCalendarStartDate(start)
    setCalendarEndDate(end)
  }

  const changeLoading = (event: any) => {
    setLoading(event.target.checked)
  }

  const changeIncludeWeekends = (event: any) => {
    setIncludeWeekends(event.target.checked)
  }

  const changeMessage = (event: any) => {
    if(event.target.value !== message) {
      setMessage(event.target.value)
    }
  }

  const changeDateRange = (dates: any) => {
    const [start, end] = dates

    setCalendarStartDate(start)
    setCalendarEndDate(end)

    if(!start || !end) {
      return
    }

    setGraphStartDate(start)
    setGraphEndDate(end)
  }

  const changeThreshold = (event: any) => {
    const metric = event.target.dataset.metric
    const rank = event.target.dataset.rank

    setMetricThresholdSet(prev => {
      const obj = {...prev} as any
      const def = defaultMetricThresholdSet as any

      const newValue = event.target.value ?? def[metric][rank]
      
      if(obj[metric][rank] === newValue) {
        return prev
      }

      obj[metric][rank] = Number.parseFloat(newValue)

      return obj
    })
  }


  return (
    <div style={{height: "200px", width: "600px", maxWidth: "600px"}}>
      <div style={{display: "flex", justifyContent: "center", alignItems:"center", color: "white", flexWrap: "wrap"}}>
        <div style={{flex: "1 0 48%", boxSizing: "border-box", margin: "5px"}}>
          <label>Data Set:</label>
          <select onChange={changeDataSet}>
            <option value={0} selected>Low</option>
            <option value={1}>High</option>
            <option value={2}>Medium</option>
            <option value={3}>Elite</option>
            <option value={4}>Team</option>
          </select>
        </div>
        <div style={{flex: "1 0 48%", boxSizing: "border-box", margin: "5px"}}>
          <label>Message:</label>
          <input type='text' value={message ?? ""} onChange={changeMessage} />
        </div>
        <div style={{flexBasis: "100%", height: "0", margin: "0"}}></div>
        <div style={{flex: "1 0 48%", boxSizing: "border-box", margin: "5px"}}>
          <label>Loading:</label>
          <input type='checkbox' checked={loading} onChange={changeLoading} />
        </div>
        <div style={{flex: "1 0 48%", boxSizing: "border-box", margin: "5px"}}>
          <label>Include Weekends:</label>
          <input type='checkbox' checked={loading} onChange={changeIncludeWeekends} />
        </div>
        <div style={{flexBasis: "100%", height: "0", margin: "0"}}></div>
        <div style={{flex: "1 0 48%", boxSizing: "border-box", margin: "5px"}}>
          <div>Deployment Frequency Thresholds:</div>
          <div>
            <label>Elite:</label>&nbsp;
            <input style={{width: "30px"}} min={0} type='number' value={metricThresholdSet.deploymentFrequency!.elite!} onChange={changeThreshold} data-metric={deploymentFrequencyName} data-rank="elite" /><span> hrs</span>
            <br/>
            <label>High:</label>&nbsp;
            <input style={{width: "30px"}} min={0} type='number' value={metricThresholdSet.deploymentFrequency!.high!} onChange={changeThreshold} data-metric={deploymentFrequencyName} data-rank="high" /><span> hrs</span>
            <br/>
            <label>Medium:</label>&nbsp;
            <input style={{width: "30px"}} min={0} type='number' value={metricThresholdSet.deploymentFrequency!.medium!} onChange={changeThreshold} data-metric={deploymentFrequencyName} data-rank="medium" /><span> hrs</span>
          </div>
        </div>
        <div style={{flex: "1 0 48%", boxSizing: "border-box", margin: "5px"}}>
          <div>Change Lead Time Thresholds:</div>
          <div>
            <label>Elite:</label>&nbsp;
            <input style={{width: "30px"}} min={0} type='number' value={metricThresholdSet.changeLeadTime!.elite!} onChange={changeThreshold} data-metric={changeLeadTimeName} data-rank="elite" /><span> hrs</span>
            <br/>
            <label>High:</label>&nbsp;
            <input style={{width: "30px"}} min={0} type='number' value={metricThresholdSet.changeLeadTime!.high!} onChange={changeThreshold} data-metric={changeLeadTimeName} data-rank="high" /><span> hrs</span>
            <br/>
            <label>Medium:</label>&nbsp;
            <input style={{width: "30px"}} min={0} type='number' value={metricThresholdSet.changeLeadTime!.medium!} onChange={changeThreshold} data-metric={changeLeadTimeName} data-rank="medium" /><span> hrs</span>
          </div>
        </div>
        <div style={{flexBasis: "100%", height: "0", margin: "0"}}></div>
        <div style={{flex: "1 0 48%", boxSizing: "border-box", margin: "5px"}}>
          <div>Change Failure Rate Thresholds:</div>
          <div>
            <label>Elite:</label>&nbsp;
            <input style={{width: "30px"}} min={0} type='number' value={metricThresholdSet.changeFailureRate!.elite!} onChange={changeThreshold} data-metric={changeFailureRateName} data-rank="elite" /><span> hrs</span>
            <br/>
            <label>High:</label>&nbsp;
            <input style={{width: "30px"}} min={0} type='number' value={metricThresholdSet.changeFailureRate!.high!} onChange={changeThreshold} data-metric={changeFailureRateName} data-rank="high" /><span> hrs</span>
            <br/>
            <label>Medium:</label>&nbsp;
            <input style={{width: "30px"}} min={0} type='number' value={metricThresholdSet.changeFailureRate!.medium!} onChange={changeThreshold} data-metric={changeFailureRateName} data-rank="medium" /><span> hrs</span>
          </div>
        </div>
        <div style={{flex: "1 0 48%", boxSizing: "border-box", margin: "5px"}}>
          <div>Recover Time Thresholds:</div>
          <div>
            <label>Elite:</label>&nbsp;
            <input style={{width: "30px"}} min={0} type='number' value={metricThresholdSet.recoverTime!.elite!} onChange={changeThreshold} data-metric={recoverTimeName} data-rank="elite" /><span> hrs</span>
            <br/>
            <label>High:</label>&nbsp;
            <input style={{width: "30px"}} min={0} type='number' value={metricThresholdSet.recoverTime!.high!} onChange={changeThreshold} data-metric={recoverTimeName} data-rank="high" /><span> hrs</span>
            <br/>
            <label>Medium:</label>&nbsp;
            <input style={{width: "30px"}} min={0} type='number' value={metricThresholdSet.recoverTime!.medium!} onChange={changeThreshold} data-metric={recoverTimeName} data-rank="medium" /><span> hrs</span>
          </div>
        </div>
        <div style={{flexBasis: "100%", height: "0", margin: "0"}}></div>
        <div style={{flex: "1 0 48%", boxSizing: "border-box", margin: "5px"}}>
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
      <Board metricThresholdSet={metricThresholdSet} includeWeekendsInCalculations={includeWeekends} graphStart={graphStartDate} graphEnd={graphEndDate} loading={loading} message={message} data={data} />
    </div>
  )
}

export const Example = Template.bind({})
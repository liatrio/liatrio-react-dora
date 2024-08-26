import React, { useEffect, useState } from 'react'
import { ComposedChart , Area, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { TrendProps } from './interfaces/propInterfaces'
import { DoraRecord } from './interfaces/apiInterfaces'
import { buildNonGraphBody, formatDateTicks, generateTicks } from './functions/chartFunctions'
import { blue, defaultGraphEnd, defaultGraphStart, green, grey, millisecondsToWeeks, orange, purple, trendName, yellow } from './constants'
import { buildDoraStateForPeriod } from './functions/metricFunctions'
import { getDateDaysInPast, stripTime, getEndOfWeek, getStartOfWeek } from './functions/dateFunctions'
import { DoraRank } from './interfaces/metricInterfaces'

interface GraphData {
  date: number
  overallAvg: number
  deploymentFrequencyAvg: number
  changeLeadTimeAvg: number
  changeFailureRateAvg: number
  recoverTimeAvg: number
}

const defaultGraphData : GraphData = {
  date: 0,
  overallAvg: 0,
  deploymentFrequencyAvg: 0,
  changeFailureRateAvg: 0,
  changeLeadTimeAvg: 0,
  recoverTimeAvg: 0,
}

const composeGraphData = (props: TrendProps) : [GraphData[], Date, Date] => {
  let allStart = getDateDaysInPast(-30000)
  let allEnd = getDateDaysInPast(30000)

  const dataByDate = props.data.reduce((acc: Map<number, DoraRecord[]>, record: DoraRecord) => {
    const date = (new Date(Date.UTC(record.created_at.getUTCFullYear(), record.created_at.getUTCMonth(), record.created_at.getUTCDate())))
    const weekStart = getStartOfWeek(date)

    let entry = acc.get(weekStart)

    if (record.created_at < allStart) {
      allStart = record.created_at
    }

    if (record.created_at > allEnd) {
      allEnd = record.created_at
    }

    if (!entry) {
      entry = [record]

      acc.set(weekStart, entry)
    } else {
      entry.push(record)
    }

    return acc
  }, new Map<number, DoraRecord[]>())

  const dates = Array.from(dataByDate.keys())

  dates.sort((left, right) => left - right)

  const graphData: GraphData[] = []

  dates.forEach((key: number) => {
    const data = dataByDate.get(key)
    const start = new Date(key)
    const end = new Date(getEndOfWeek(start))

    const state = buildDoraStateForPeriod(props, data!, start, end)

    const averageRank = (state.changeFailureRate.rank + state.changeLeadTime.rank + state.deploymentFrequency.rank + state.recoverTime.rank) / 4

    graphData.push({
      overallAvg: averageRank,
      changeFailureRateAvg: state.changeFailureRate.rank,
      deploymentFrequencyAvg: state.deploymentFrequency.rank,
      changeLeadTimeAvg: state.changeLeadTime.rank,
      recoverTimeAvg: state.recoverTime.rank,
      date: key
    })
  })

  graphData[0].date = allStart.getTime()
  graphData[graphData.length - 1].date = allEnd.getTime()

  return [graphData, allStart, allEnd]
}

const formatRankTicks = (tick: any): string => {
  if(tick === DoraRank.unknown) {
    return ""
  } else if(tick === DoraRank.elite) {
    return "Elite"
  } else if(tick === DoraRank.high) {
    return "High"
  } else if(tick === DoraRank.medium) {
    return "Medium"
  } else {
    return "Low"
  }
}

const filterGraphData = (data: GraphData[], start: number, end: number) : GraphData[] => {
  const filtered = data.filter((entry: GraphData) => {
    return entry.date >= start && entry.date <= end
  })

  return filtered
}

const TrendGraph : React.FC<TrendProps> = (props: TrendProps) => {
  const [graphData, setGraphData] = useState<GraphData[]>([])
  const [allData, setAllData] = useState<GraphData[]>([])
  const [noData, setNoData] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [dataStartDate, setDataStartDate] = useState<Date>(new Date())
  const [dataEndDate, setDataEndDate] = useState<Date>(new Date())

  useEffect(() => {
    if(!props.data || props.data.length === 0) {
        setNoData(true)
        setGraphData([])
        setAllData([])
        return
    }

    setNoData(false)

    const [composedData, start, end] = composeGraphData(props)
console.log("Data Range:", start, end)
    setDataStartDate(start)
    setDataEndDate(end)
    setAllData(composedData)
  }, [props.data])

  useEffect(() => {
    if(allData.length === 0) {
      return
    }

    let newStart = new Date(dataStartDate)
    let newEnd = new Date(dataEndDate)

    if(props.graphStart && props.graphEnd) {
      newStart = new Date(getStartOfWeek(props.graphStart))
      newEnd = new Date(getEndOfWeek(props.graphEnd))
console.log("New Range:", newStart, newEnd)
      setStartDate(stripTime(props.graphStart))
      setEndDate(stripTime(props.graphEnd))
      console.log("New Display:", props.graphStart, props.graphEnd)
    } else {
      setStartDate(dataStartDate)
      setEndDate(dataEndDate)
    }

    const filteredData = filterGraphData(allData, newStart.getTime(), newEnd.getTime())

    setGraphData(filteredData)
  }, [props.graphEnd, props.graphStart, allData])

  const nonGraphBody = buildNonGraphBody(props, noData, trendName)

  if(nonGraphBody) {
    return nonGraphBody
  } else if(graphData.length <= 1) {
    return (
      <div data-testid={trendName} style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <span style={{color: "white"}}>Not Enough Data to calculate a Trend</span>
      </div>
    )
  }

  const ticks = generateTicks(startDate, endDate, 5)

  return (
    <div data-testid={trendName} className="chart-wrapper">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          width={500}
          height={300}
          data={graphData}
          barGap={20}
          margin={{
            right: 40,
            top: 10
          }}
        >
          <defs>
            <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={purple} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={grey} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#FFFFFF44' />
          <XAxis padding={{left: 9, right: 9}} dataKey="date" tickSize={15} interval={0} type={"number"} tick={{fill: "#FFFFFF"}} ticks={ticks} domain={[startDate.getTime(), endDate.getTime()]} tickFormatter={formatDateTicks} />
          <YAxis type={"number"} tick={{fill: "#FFFFFF"}} allowDecimals={false} domain={[0, 4]} tickFormatter={formatRankTicks}/>
          <Area animationDuration={0} type="monotone" dataKey="overallAvg" stroke={purple} fillOpacity={1} fill="url(#colorAvg)" />
          {props.showIndividualTrends && <>
            <Line animationDuration={0} type="monotone" dot={false} dataKey="deploymentFrequencyAvg" stroke={orange} />
            <Line animationDuration={0} type="monotone" dot={false} dataKey="changeLeadTimeAvg" stroke={yellow} />
            <Line animationDuration={0} type="monotone" dot={false} dataKey="changeFailureRateAvg" stroke={green} />
            <Line animationDuration={0} type="monotone" dot={false} dataKey="recoverTimeAvg" stroke={blue} />
          </>}
        </ComposedChart>
      </ResponsiveContainer>
      <br/>
      {props.showIndividualTrends && <>
        <div style={{width: "75%", display: "flex", justifyContent: "space-evenly", alignItems: "center", flexWrap: "wrap"}}>
          <span style={{color: orange}}>&#9643; Deployment Frequency</span>
          <span style={{color: yellow}}>&#9643; Change Lead Time</span>
          <span style={{color: green}}>&#9643; Change Failure Rate</span>
          <span style={{color: blue}}>&#9643; Recover Time</span>
          <span style={{color: purple}}>&#9643; Overall</span>
        </div>
      </>}
    </div>
  )
}

export default TrendGraph

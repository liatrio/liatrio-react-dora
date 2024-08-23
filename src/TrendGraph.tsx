import React, { useEffect, useState } from 'react'
import { ComposedChart , Area, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { TrendProps } from './interfaces/propInterfaces'
import { DoraRecord } from './interfaces/apiInterfaces'
import { buildNonGraphBody, formatDateTicks, generateDistinctColors, generateTicks } from './functions/chartFunctions'
import { defaultGraphEnd, defaultGraphStart, grey, purple, trendName } from './constants'
import { buildDoraStateForPeriod } from './functions/metricFunctions'
import { getDateDaysInPast, getEndOfWeek, getStartOfWeek } from './functions/dateFunctions'
import { DoraRank } from './interfaces/metricInterfaces'

interface GraphData {
  date: number
  overallAvg: number
  deploymentFrequencyAvg: number
  changeLeadTimeAvg: number
  changeFailureRateAvg: number
  recoverTimeAvg: number
}

const composeGraphData = (props: TrendProps) : [GraphData[], Date, Date] => {
  let start = getDateDaysInPast(defaultGraphStart)
  let end = getDateDaysInPast(defaultGraphEnd)

  if(!props.data || props.data.length === 0) {
    return [[], start, end]
  }

  const dataByDate = props.data.reduce((acc: Map<number, DoraRecord[]>, record: DoraRecord) => {
    if(!record.status) {
      return acc
    }

    const date = (new Date(Date.UTC(record.created_at.getUTCFullYear(), record.created_at.getUTCMonth(), record.created_at.getUTCDate())))
    const weekStart = getStartOfWeek(date)

    let entry = acc.get(weekStart)

    if (!entry) {
      entry = [record]

      acc.set(weekStart, entry)
    } else {
      entry.push(record)
    }

    return acc
  }, new Map<number, DoraRecord[]>())

  const dates = Array.from(dataByDate.keys())

  if(dates.length === 0) {
    return [[], start, end]
  }

  dates.sort((left, right) => left - right)

  const result: GraphData[] = []

  dates.forEach((key: number) => {
    const data = dataByDate.get(key)
    const start = new Date(key)
    const end = new Date(getEndOfWeek(start))

    const state = buildDoraStateForPeriod(props, data!, start, end)

    const averageRank = (state.changeFailureRate.rank + state.changeLeadTime.rank + state.deploymentFrequency.rank + state.recoverTime.rank) / 4

    result.push({
      overallAvg: averageRank,
      changeFailureRateAvg: state.changeFailureRate.rank,
      deploymentFrequencyAvg: state.deploymentFrequency.rank,
      changeLeadTimeAvg: state.changeLeadTime.rank,
      recoverTimeAvg: state.recoverTime.rank,
      date: key
    })
  })

  if(dates.length === 1) {
    start = new Date(dates[0])
    end = new Date(getEndOfWeek(new Date(dates[0])))

    const lastRecord = {...result[0]}

    lastRecord.date = end.getTime()

    result.push(lastRecord)
  } else {
    start = new Date(dates[0])
    end = new Date(getEndOfWeek(new Date(dates[dates.length - 1])))
    result[result.length - 1].date = end.getTime()
  }

  return [result, start, end]
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

const TrendGraph : React.FC<TrendProps> = (props: TrendProps) => {
  const [graphData, setGraphData] = useState<GraphData[]>([])
  const [noData, setNoData] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<Date>(getDateDaysInPast(defaultGraphStart))
  const [endDate, setEndDate] = useState<Date>(getDateDaysInPast(defaultGraphEnd))

  useEffect(() => {
    if(!props.data || props.data.length === 0) {
        setNoData(true)
        setGraphData([])
        return
    }

    setNoData(false)

    const [composedData, start, end] = composeGraphData(props)

    setGraphData(composedData)
    setStartDate(start)
    setEndDate(end)
  }, [props.data])

  const nonGraphBody = buildNonGraphBody(props, noData, trendName)

  if(nonGraphBody) {
    return nonGraphBody
  }

  const colors = generateDistinctColors(4)
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
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis padding={{left: 9, right: 9}} dataKey="date" tickSize={15} interval={0} type={"number"} tick={{fill: "#FFFFFF"}} ticks={ticks} domain={[startDate.getTime(), endDate.getTime()]} tickFormatter={formatDateTicks} />
          <YAxis type={"number"} tick={{fill: "#FFFFFF"}} allowDecimals={false} domain={[0, 4]} tickFormatter={formatRankTicks}/>
          <Area animationDuration={0} type="monotone" dataKey="overallAvg" stroke={purple} fillOpacity={1} fill="url(#colorAvg)" />
          {props.showIndividualTrends && <>
            <Line animationDuration={0} type="monotone" dataKey="deploymentFrequencyAvg" stroke={colors[0]} />
            <Line animationDuration={0} type="monotone" dataKey="changeLeadTimeAvg" stroke={colors[1]} />
            <Line animationDuration={0} type="monotone" dataKey="changeFailureRateAvg" stroke={colors[2]} />
            <Line animationDuration={0} type="monotone" dataKey="recoverTimeAvg" stroke={colors[3]} />
          </>}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TrendGraph

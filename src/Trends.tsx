import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import CustomBar from './CustomBar'
import { Tooltip } from 'react-tooltip'
import TooltipContent from './ToolTip/TooltipContent'
import { ChartProps } from './interfaces/propInterfaces'
import { DoraRecord } from './interfaces/apiInterfaces'
import { buildNonGraphBody, formatDateTicks, generateDistinctColors, generateTicks } from './functions/chartFunctions'
import { blue, defaultGraphEnd, defaultGraphStart, green, grey, millisecondsToDays, millisecondsToWeeks, orange, purple, trendName, yellow } from './constants'
import { buildDoraStateForPeriod } from './functions/metricFunctions'
import { getDateDaysInPast, getEndOfWeek, getStartOfWeek } from './functions/dateFunctions'
import { Rank } from './interfaces/metricInterfaces'

interface GraphData {
  date: number
  avg: number
}

const composeGraphData = (props: ChartProps) : [GraphData[], Date, Date] => {
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
      avg: averageRank,
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
  if(tick === Rank.unknown) {
    return ""
  } else if(tick === Rank.elite) {
    return "Elite"
  } else if(tick === Rank.high) {
    return "High"
  } else if(tick === Rank.medium) {
    return "Medium"
  } else {
    return "Low"
  }
}

const Trends : React.FC<ChartProps> = (props: ChartProps) => {
  const [graphData, setGraphData] = useState<GraphData[]>([])
  const [tooltipContent, setTooltipContent] = useState<any>(null)
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

  const ticks = generateTicks(startDate, endDate, 5)

  // const handleMouseOverBar = (event: any, payload: any) => {
  //   const repository = event.target.parentNode.parentNode.parentNode.parentNode.className.baseVal.split(' ').filter((item: any) => !item.includes('recharts'))[0]
  //   setTooltipContent(<TooltipContent type={trendName} repository={repository} payload={[payload]} />)
  // }

  return (
    <div data-testid={trendName} className="chart-wrapper">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
          <Area type="monotone" dataKey="avg" stroke={purple} fillOpacity={1} fill="url(#colorAvg)" />
          {/* {graphData.map((repo, idx) => { 
            const key = `${repo}.count`
            return (
              <Bar animationDuration={0} className={repo} key={idx} dataKey={key} stackId="a" fill={colors[idx]} barSize={maxBarWidth} shape={(props: any) => <CustomBar {...props} tooltipId="dfTooltip" mouseOver={handleMouseOverBar} />}/>
            )
          })} */}
        </AreaChart>
      </ResponsiveContainer>
      <Tooltip className='chartTooltip' delayHide={2000} clickable={true} classNameArrow='chartTooltipArrow' id="dfTooltip"  border="1px solid white" opacity="1" content={tooltipContent}/>
    </div>
  )
}

export default Trends

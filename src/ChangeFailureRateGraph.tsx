import React, { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid,  ResponsiveContainer } from 'recharts'
import CustomBar from './CustomBar'
import { Tooltip } from 'react-tooltip'
import TooltipContent from './ToolTip/TooltipContent'
import { ChartProps } from './interfaces/propInterfaces'
import { DoraRecord } from './interfaces/apiInterfaces'
import { buildNonGraphBody, formatDateTicks, generateTicks, useSharedLogic } from './functions/chartFunctions'
import { changeFailureRateName, millisecondsToDays } from './constants'

export const composeGraphData = (_: ChartProps, data: DoraRecord[]) => {
  let reduced = data.reduce((acc: Map<number, any>, record: DoraRecord) => {
    const date = (new Date(Date.UTC(record.created_at.getUTCFullYear(), record.created_at.getUTCMonth(), record.created_at.getUTCDate()))).getTime()
    let entry = acc.get(date)

    if (!entry) {
      entry = {
        date: date
      }

      acc.set(date, entry)
    }

    const key = record.repository
    let count = entry[key]

    if(!count) {
      count = {
        successful: 0,
        failed: 0,
        total: 0,
        failures: [],
        successes: [],
      }

      if(record.status === true && !record.failed_at) {
        count.successful = 1
        count.successes.push(record)
      } else {
        count.failed = 1
        count.failures.push(record)
      }

      entry[key] = count
    } else {
      if(record.status === true && !record.failed_at) {
        count.successful++
        count.successes.push(record)
      } else {
        count.failed++
        count.failures.push(record)
      }
    }

    const total = entry[key].failed + entry[key].successful

    count.total = entry[key].failed / (total < 1 ? 1 : total)

    return acc
  }, new Map<number, DoraRecord[]>())

  let result = Array.from(reduced.values())

  result.sort((l, r) => new Date(l.date).getTime() - new Date(r.date).getTime())

  return result
}

const ChangeFailureRateGraph : React.FC<ChartProps> = (props: ChartProps) => {
  const [tooltipContent, setTooltipContent] = useState<any>(null)
  const [graphData, setGraphData] = useState<any>(null)

  const [startDate, endDate, colors, repositories, noData] = useSharedLogic(props, composeGraphData, setGraphData)

  const ticks = useMemo(() => generateTicks(startDate, endDate, 5), [startDate, endDate])
  const maxBarWidth = useMemo(() => (1 / ((endDate.getTime() - startDate.getTime()) / millisecondsToDays)) * 33 + "%", [startDate, endDate])

  const nonGraphBody = buildNonGraphBody(props, noData, changeFailureRateName)

  if(nonGraphBody) {
    return nonGraphBody
  }

  const handleMouseOverBar = (event: any, payload: any) => {
    const repository = event.target.parentNode.parentNode.parentNode.parentNode.className.baseVal.split(' ').filter((item: any) => !item.includes('recharts'))[0]
    setTooltipContent(<TooltipContent type={changeFailureRateName} payload={[payload]} repository={repository}/>)
  }

  return (
    <div data-testid={changeFailureRateName} className="chart-wrapper">
      <ResponsiveContainer width="100%" height="100%">
      <BarChart
          width={500}
          height={300}
          data={graphData}
          margin={{
            right: 40,
            top: 10
          }}
          barCategoryGap={0}
          barGap={0}
          barSize={10}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis padding={{left: 9, right: 9}} dataKey="date" tickSize={15} type="number" tick={{fill: "#FFFFFF"}} ticks={ticks} domain={[startDate.getTime(), endDate.getTime()]} tickFormatter={formatDateTicks} />
          <YAxis type="number" tick={{fill: "#FFFFFF"}} tickFormatter={(tick) => tick * 100 + "%"}/>
          {repositories.map((repo, idx) => (
            <Bar animationDuration={0} key={repo} className={repo} dataKey={`${repo}.total`} fill={colors[idx]} shape={(props: any) => <CustomBar {...props} tooltipId="cfrTooltip" mouseOver={handleMouseOverBar} />}/>
          ))}
        </BarChart>
      </ResponsiveContainer>
      <Tooltip className='chartTooltip' delayHide={2000} clickable={true} classNameArrow='chartTooltipArrow' id="cfrTooltip"  border="1px solid white" opacity="1" content={tooltipContent}/>
    </div>
  )
}

export default ChangeFailureRateGraph

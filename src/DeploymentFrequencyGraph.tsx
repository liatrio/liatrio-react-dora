import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import CustomBar from './CustomBar'
import { Tooltip } from 'react-tooltip'
import TooltipContent from './ToolTip/TooltipContent'
import { deploymentFrequencyName, millisecondsToDays } from './constants'
import { ChartProps } from './interfaces/propInterfaces'
import { DoraRecord } from './interfaces/apiInterfaces'
import { buildNonGraphBody, formatDateTicks, generateTicks, useSharedLogic } from './functions/chartFunctions'

export const composeGraphData = (_: ChartProps, data: DoraRecord[]) : any[] => {
  const reduced = data.reduce((acc: Map<number, any>, record: DoraRecord) => {
    if(!record.status) {
      return acc
    }

    const date = (new Date(Date.UTC(record.created_at.getUTCFullYear(), record.created_at.getUTCMonth(), record.created_at.getUTCDate()))).getTime()
    let entry = acc.get(date)

    if (!entry) {
      entry = {
        date: date
      }

      acc.set(date, entry)
    }

    let repo = entry[record.repository]

    if(!repo) {
      repo = {
        count: 1,
        urls: [record.deploy_url]
      }

      entry[record.repository] = repo
    } else {
      repo.count++
      repo.urls.push(record.deploy_url)
    }

    return acc
  }, new Map<number, DoraRecord[]>())

  let result = Array.from(reduced.values())

  result.sort((l, r) => new Date(l.date).getTime() - new Date(r.date).getTime())

  return result
}

const DeploymentFrequencyGraph : React.FC<ChartProps> = (props: ChartProps) => {
  const [graphData, setGraphData] = useState<any[]>([])
  const [maxDeploys, setMaxDeploys] = useState<number>(0)
  const [tooltipContent, setTooltipContent] = useState<any>(null)
  const [startDate, endDate, colors, repositories, noData] = useSharedLogic(props, composeGraphData, setGraphData)

  const ticks = generateTicks(startDate, endDate, 5)
  const maxBarWidth = (1 / ((endDate.getTime() - startDate.getTime()) / millisecondsToDays)) * 33 + "%"

  const nonGraphBody = buildNonGraphBody(props, noData, deploymentFrequencyName)

  if(nonGraphBody) {
    return nonGraphBody
  }

  useEffect(() => {
    let max = 0

    graphData.forEach((entry: any) => {
      Object.keys(entry).forEach((key: string) => {
        if(key === 'date') {
          return
        }

        const count = entry[key].count

        if(count > max) {
          max = count
        }
      })
    })

    setMaxDeploys(max)
  }, [graphData])

  const handleMouseOverBar = (event: any, payload: any) => {
    const repository = event.target.parentNode.parentNode.parentNode.parentNode.className.baseVal.split(' ').filter((item: any) => !item.includes('recharts'))[0]
    setTooltipContent(<TooltipContent type={deploymentFrequencyName} repository={repository} payload={[payload]} />)
  }

  return (
    <div data-testid={deploymentFrequencyName} className="chart-wrapper">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={graphData}
          barGap={20}
          margin={{
            right: 40,
            top: 10
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis padding={{left: 9, right: 9}} dataKey="date" tickSize={15} interval={0} type={"number"} tick={{fill: "#FFFFFF"}} ticks={ticks} domain={[startDate.getTime(), endDate.getTime()]} tickFormatter={formatDateTicks} />
          <YAxis type={"number"} tick={{fill: "#FFFFFF"}} allowDecimals={false} domain={[0, maxDeploys]}/>
          {repositories.map((repo, idx) => {
            const key = `${repo}.count`
            return (
              <Bar animationDuration={0} className={repo} key={idx} dataKey={key} stackId="a" fill={colors[idx]} barSize={maxBarWidth} shape={(props: any) => <CustomBar {...props} tooltipId="dfTooltip" mouseOver={handleMouseOverBar} />}/>
            )
          })}
        </BarChart>
      </ResponsiveContainer>
      <Tooltip className='chartTooltip' delayHide={2000} clickable={true} classNameArrow='chartTooltipArrow' id="dfTooltip"  border="1px solid white" opacity="1" content={tooltipContent}/>
    </div>
  )
}

export default DeploymentFrequencyGraph

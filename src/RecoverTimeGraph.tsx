import React, { useState } from "react"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import CustomDot from "./CustomDot"
import "./general.css"
import TooltipContent from "./ToolTip/TooltipContent"
import { Tooltip } from "react-tooltip"
import { ChartProps } from "./interfaces/propInterfaces"
import { DoraRecord } from "./interfaces/apiInterfaces"
import { buildNonGraphBody, formatDateTicks, generateTicks, useSharedLogic } from "./functions/chartFunctions"
import { buildDoraState } from "./functions/metricFunctions"
import { recoverTimeName } from "./constants"

export const composeGraphData = (props: ChartProps, data: DoraRecord[]) => {
  let reduced = data.reduce((acc: Map<number, any>, record: DoraRecord) => {
    if (record.recoverTime === undefined) {
      return acc
    }

    const date = new Date(Date.UTC(record.created_at.getUTCFullYear(), record.created_at.getUTCMonth(), record.created_at.getUTCDate())).getTime()
    let entry = acc.get(date)

    if (!entry) {
      entry = {
        date: date,
      }

      acc.set(date, entry)
    }

    let payload = entry[record.repository]

    if (!payload) {
      entry[record.repository] = {
        count: 1,
        totalTime: record.recoverTime,
        avgTime: record.recoverTime,
        records: [record],
        avgLabel: " hrs",
      }
    } else {
      payload.count++
      payload.totalTime += record.recoverTime
      payload.avgTime += payload.totalTime / payload.count
      payload.records.push(record)
    }

    return acc
  }, new Map<number, DoraRecord[]>())

  let result = Array.from(reduced.values())

  result.sort((l, r) => new Date(l.date).getTime() - new Date(r.date).getTime())

  return result
}

const RecoverTimeGraph: React.FC<ChartProps> = (props: ChartProps) => {
  const [graphData, setGraphData] = useState<any[]>([])
  const [tooltipContent, setTooltipContent] = useState<any>(null)
  const [usedRepositories, setUsedRepositories] = useState<string[]>([])
  const [yLabel, setYLabel] = useState<any>(" hrs")

  const postCompose = (componentProps: ChartProps, data: DoraRecord[], composedData: any) => {
    const state = buildDoraState(componentProps, data)

    const repositories: string[] = []

    if (state.recoverTime.average > 48) {
      composedData.forEach((entry: any) => {
        Object.keys(entry).map((key: any) => {
          if (key !== "date") {
            repositories.push(key)

            let payload = entry[key]

            payload.avgTimeHrs = payload.avgTime
            payload.avgTimeDays = payload.avgTime / 24
            payload.avgTimeMins = payload.avgTime * 60
            payload.avgTime /= 24
            payload.avgLabel = " days"
          }
        })
      })

      setYLabel(" days")
    } else if (state.recoverTime.average < 1) {
      composedData.forEach((entry: any) => {
        Object.keys(entry).map((key: any) => {
          if (key !== "date") {
            repositories.push(key)

            let payload = entry[key]

            payload.avgTimeHrs = payload.avgTime
            payload.avgTimeDays = payload.avgTime / 24
            payload.avgTimeMins = payload.avgTime * 60
            payload.avgTime *= 60
            payload.avgLabel = " mins"
          }
        })
      })

      setYLabel(" mins")
    } else {
      setYLabel(" hrs")
      composedData.forEach((entry: any) => {
        Object.keys(entry).map((key: any) => {
          if (key !== "date") {
            repositories.push(key)
          }
        })
      })
    }

    setUsedRepositories(Array.from(new Set(repositories)))
  }

  const [startDate, endDate, colors, _, noData] = useSharedLogic(props, composeGraphData, setGraphData, postCompose)

  const ticks = generateTicks(startDate, endDate, 5)

  const nonGraphBody = buildNonGraphBody(props, noData, recoverTimeName)

  if(nonGraphBody) {
      return nonGraphBody
  }

  const handleMouseOverDot = (event: any, payload: any) => {
    const repository = event.target.className.baseVal
    setTooltipContent(<TooltipContent repository={repository} type={recoverTimeName} payload={[payload]} />)
  }

  return (
    <div data-testid={recoverTimeName} className="chart-wrapper">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={graphData}
          margin={{
            right: 40,
            top: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            padding={{ left: 9, right: 9 }}
            dataKey="date"
            tickSize={15}
            type={"number"}
            tick={{ fill: "#FFFFFF" }}
            ticks={ticks}
            domain={[startDate.getTime(), endDate.getTime()]}
            tickFormatter={formatDateTicks}
          />
          <YAxis name="Time" unit={yLabel} tick={{ fill: "#FFFFFF" }} />
          {usedRepositories.map((repo, idx) => (
            <Line
              connectNulls={true}
              type="monotone"
              animationDuration={0}
              key={repo}
              dataKey={`${repo}.avgTime`}
              fill={colors[idx]}
              className={repo}
              stroke={colors[idx]}
              dot={(props: any) => <CustomDot {...props} className={repo} tooltipId="rtTooltip" mouseOver={handleMouseOverDot} />}
              activeDot={(props: any) => <CustomDot {...props} className={repo} tooltipId="rtTooltip" mouseOver={handleMouseOverDot} />}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <Tooltip
        className="chartTooltip"
        delayHide={2000}
        clickable={true}
        classNameArrow="chartTooltipArrow"
        id="rtTooltip"
        border="1px solid white"
        opacity="1"
        content={tooltipContent}
      />
    </div>
  )
}

export default RecoverTimeGraph

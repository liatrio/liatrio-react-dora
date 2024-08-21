import React, { useState, useEffect } from "react"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import Loading from "./Loading/Loading"
import noDataImg from "./assets/no_data.png"
import CustomDot from "./CustomDot"
import "./general.css"
import TooltipContent from "./ToolTip/TooltipContent"
import { Tooltip } from "react-tooltip"
import { ChartProps } from "./interfaces/propInterfaces"
import { DoraRecord } from "./interfaces/apiInterfaces"
import { getDateDaysInPast } from "./functions/dateFunctions"
import { extractUniqueRepositories, formatTicks, generateDistinctColors, generateTicks } from "./functions/chartFunctions"
import { buildDoraState } from "./functions/metricFunctions"
import { fetchData } from "./functions/fetchFunctions"

export const extractAvgRecoverTimePerDay = (props: ChartProps, data: DoraRecord[]) => {
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

const RecoverTime: React.FC<ChartProps> = (props: ChartProps) => {
  const [graphData, setGraphData] = useState<any[]>([]);
  const [repositories, setRepositories] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [noData, setNoData] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(props.start ?? getDateDaysInPast(30));
  const [endDate, setEndDate] = useState<Date>(props.end ?? getDateDaysInPast(0));
  const [tooltipContent, setTooltipContent] = useState<any>(null);
  const [yLabel, setYLabel] = useState<any>(" hrs");

  const ticks = generateTicks(startDate, endDate, 5);

  const organizeData = (data: DoraRecord[]) => {
    if (!data || data.length === 0) {
      setNoData(true)
      setRepositories([])
      setGraphData([])
      setColors([])
      setLoading(false)
      setYLabel(" hrs")
      return
    }

    setNoData(false)

    const extractedData = extractAvgRecoverTimePerDay(props, data);

    const state = buildDoraState(props, data)

    const usedRepositories: any = {}

    if (state.recoverTime.average > 48) {
      extractedData.forEach((entry) => {
        Object.keys(entry).map((key: any) => {
          if (key !== "date") {
            if(usedRepositories[key]) {
                usedRepositories[key]++
            } else {
                usedRepositories[key] = 1
            }

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
      extractedData.forEach((entry) => {
        Object.keys(entry).map((key: any) => {
          if (key !== "date") {
            if(usedRepositories[key]) {
                usedRepositories[key]++
            } else {
                usedRepositories[key] = 1
            }

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
      extractedData.forEach((entry) => {
        Object.keys(entry).map((key: any) => {
          if (key !== "date") {
            if(usedRepositories[key]) {
                usedRepositories[key]++
            } else {
                usedRepositories[key] = 1
            }
          }
        })
      })
    }

    setGraphData(extractedData)

    const allRepositories = extractUniqueRepositories(data)
    const finalRepositories: any = []
    
    allRepositories.forEach(repo => {
        if(usedRepositories[repo]) {
            finalRepositories.push(repo)
        }
    })
    
    setRepositories(finalRepositories)

    setColors(generateDistinctColors(finalRepositories.length))
    setLoading(false)
  }

  useEffect(() => {
    setStartDate(props.start ?? getDateDaysInPast(30));
    setEndDate(props.end ?? getDateDaysInPast(0));
    setLoading(true);
    fetchData(props, organizeData);
  }, [props]);

  if (props.message) {
    return (
      <div data-testid="RecoverTime" style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <span style={{color: "white"}}>{props.message}</span>
      </div>
    )
  } else if (loading || props.loading) {
    return (
      <div data-testid="RecoverTime" style={{ width: "100%", height: "100%" }}>
        <Loading enabled={loading || (props.loading ?? false)} />
      </div>
    )
  } else if (noData) {
    return (
      <div data-testid="RecoverTime" style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img alt="No Data" title="No Data" src={noDataImg} style={{ width: "150px" }} />
      </div>
    )
  }

  const handleMouseOverDot = (event: any, payload: any) => {
    const repository = event.target.className.baseVal
    setTooltipContent(<TooltipContent repository={repository} type="rt" payload={[payload]} />)
  }

  return (
    <div data-testid="RecoverTime" className="chart-wrapper">
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
            tickFormatter={formatTicks}
          />
          <YAxis name="Time" unit={yLabel} tick={{ fill: "#FFFFFF" }} />
          {repositories.map((repo, idx) => (
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

export default RecoverTime

import React, { useState, useEffect } from 'react'
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts'
import { extractUniqueRepositories, fetchData, formatTicks, generateDistinctColors, generateTicks, getDateDaysInPast, Props, Record } from './Helpers'
import Loading from './Loading/Loading'
import noDataImg from './assets/no_data.png'
import CustomDot from './CustomDot'
import './general.css'
import TooltipContent from './ToolTip/TooltipContent'
import { Tooltip } from 'react-tooltip'

export const extractAvgRecoverTimePerDay = (props: Props, data: Record[]) => {
    let reduced = data.reduce((acc: Map<number, any>, record: Record) => {
        if(record.recoverTime === undefined) {
            return acc;
        }

        const date = (new Date(Date.UTC(record.created_at.getUTCFullYear(), record.created_at.getUTCMonth(), record.created_at.getUTCDate()))).getTime()
        let entry = acc.get(date)

        if (!entry) {
            entry = {
                date: date
            }

            acc.set(date, entry)
        }

        let payload = entry[record.repository]

        if(!payload) {
            entry[record.repository] = {
                count: 1,
                totalTime: record.recoverTime,
                avgTime: record.recoverTime,
                records: [record]
            }
        } else {
            payload.count++
            payload.totalTime += record.recoverTime
            payload.avgTime += payload.totalTime / payload.count
            payload.records.push(record)
        }

        return acc
    }, new Map<number, Record[]>())

    let result = Array.from(reduced.values())

    result.sort((l, r) => new Date(l.date).getTime() - new Date(r.date).getTime())

    return result
}

const RecoverTime : React.FC<Props> = (props: Props) => {
    const [graphData, setGraphData] = useState<any[]>([])
    const [repositories, setRepositories] = useState<string[]>([])
    const [colors, setColors] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [noData, setNoData] = useState<boolean>(false)
    const [startDate, setStartDate] = useState<Date>(props.start ?? getDateDaysInPast(31))
    const [endDate, setEndDate] = useState<Date>(props.end ?? getDateDaysInPast(1))
    const [tooltipContent, setTooltipContent] = useState<any>(null)

    const ticks = generateTicks(startDate, endDate, 5)

    const organizeData = (data: Record[]) => {
        if(data.length === 0) {
            setNoData(true)
        }

        const extractedData = extractAvgRecoverTimePerDay(props, data)

        setGraphData(extractedData)

        const repositories = extractUniqueRepositories(data)

        setRepositories(repositories)

        setColors(generateDistinctColors(repositories.length))
        setLoading(false)
    }

    useEffect(() => {
        setStartDate(props.start ?? getDateDaysInPast(31))
        setEndDate(props.end ?? getDateDaysInPast(1))
        setLoading(true)
        fetchData(props, organizeData)
    }, [props])

    if(loading || props.loading) {
        return (
            <div data-testid="RecoverTime" style={{width: "100%", height: "100%"}}>
                <Loading enabled={loading || (props.loading ?? false)} />
            </div>
        )
    }

    if(noData) {
        return (
            <div data-testid="RecoverTime" style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
              <img alt="No Data" title="No Data" src={noDataImg} style={{width: "150px"}}/>
            </div>
        )
    }

    const handleMouseOverDot = (event: any, payload: any) => {
        setTooltipContent(<TooltipContent type="rt" payload={[payload]} />)
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
                        top: 10
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis padding="gap" dataKey="date" tickSize={15} type={"number"} tick={{fill: "#FFFFFF"}} ticks={ticks} domain={[startDate.getTime(), endDate.getTime()]} tickFormatter={formatTicks} />
                    <YAxis name="Time" unit=" hrs" tick={{fill: "#FFFFFF"}} />
                    {repositories.map((repo, idx) => (
                        <Line animationDuration={0} key={repo} dataKey={`${repo}.avgTime`} fill={colors[idx]} 
                        dot={(props: any) => <CustomDot {...props} tooltipId="rtTooltip" mouseOver={handleMouseOverDot} />}
                        activeDot={(props: any) => <CustomDot {...props} tooltipId="rtTooltip" mouseOver={handleMouseOverDot} />} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
            <Tooltip className='chartTooltip' delayHide={2000} clickable={true} classNameArrow='chartTooltipArrow' id="rtTooltip"  border="1px solid white" opacity="1" content={tooltipContent}/>
        </div>
    )
}

export default RecoverTime

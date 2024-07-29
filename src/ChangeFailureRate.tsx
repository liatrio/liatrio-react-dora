import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts'
import { fetchData, generateDistinctColors, Record, Props, extractUniqueRepositories, getDate, formatTicks, generateTicks } from './Helpers'
import Loading from './Loading/Loading'
import noDataImg from './assets/no_data.png'
import ToolTip from './ToolTip/ToolTip'

export const extractChangeFailureRatePerDay = (props: Props, data: Record[]) => {
    let reduced = data.reduce((acc: Map<number, any>, record: Record) => {
        const date = (new Date(Date.UTC(record.created_at.getUTCFullYear(), record.created_at.getUTCMonth(), record.created_at.getUTCDate()))).getTime()
        let entry = acc.get(date)

        if (!entry) {
            entry = {
                type: "cfr",
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
                total: 0
            }

            if(record.status === true && !record.failed_at) {
                count.successful = 1
            } else {
                count.failed = 1
            }

            entry[key] = count
        } else {
            if(record.status === true && !record.failed_at) {
                count.successful++
            } else {
                count.failed++
            }
        }

        count.total = entry[key].failed / (entry[key].successful < 1 ? 1 : entry[key].successful)
    
        return acc
    }, new Map<number, Record[]>())

    let result = Array.from(reduced.values())
    
    result.sort((l, r) => new Date(l.date).getTime() - new Date(r.date).getTime())

    return result
}

const ChangeFailureRate : React.FC<Props> = (props: Props) => {
    const [graphData, setGraphData] = useState<any[]>([])
    const [repositories, setRepositories] = useState<string[]>([])
    const [colors, setColors] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [noData, setNoData] = useState<boolean>(false)
    const [startDate, setStartDate] = useState<Date>(props.start ?? getDate(31))
    const [endDate, setEndDate] = useState<Date>(props.end ?? getDate(1))

    const ticks = generateTicks(startDate, endDate, 5)

    const organizeData = (data: Record[]) => {
        if(data.length === 0) {
            setNoData(true)
        }

        const extractedData = extractChangeFailureRatePerDay(props, data)
        
        setGraphData(extractedData)

        const repositories = extractUniqueRepositories(data)

        setRepositories(repositories)

        setColors(generateDistinctColors(repositories.length))
        setLoading(false)
    }

    useEffect(() => {
        setStartDate(props.start ?? getDate(31))
        setEndDate(props.end ?? getDate(1))
        setLoading(true)
        fetchData(props, organizeData)
    }, [props])

    if(loading || props.loading) {
        return (
            <div data-testid="ChangeFailureRate" style={{width: "100%", height: "100%"}}>
              <Loading enabled={loading || (props.loading ?? false)} />
            </div>
        )
    }

    if(noData) {
        return ( 
            <div data-testid="ChangeFailureRate" style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <img alt="No Data" title="No Data" src={noDataImg} style={{width: "150px"}}/>
            </div>
        )
    }

    return (
        <div data-testid="ChangeFailureRate" style={{width: "100%", height: "100%"}}>
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
                    <XAxis dataKey="date" tickSize={15} type="number" tick={{fill: "#FFFFFF"}} ticks={ticks} domain={[startDate.getTime(), endDate.getTime()]} tickFormatter={formatTicks} />
                    <YAxis type="number" tick={{fill: "#FFFFFF"}} tickFormatter={(tick) => tick * 100 + "%"}/>
                    <Tooltip content={<ToolTip />} />
                    {repositories.map((repo, idx) => (
                        <Line key={repo} dataKey={`${repo}.total`} fill={colors[idx]} dot={{r: 8}} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ChangeFailureRate

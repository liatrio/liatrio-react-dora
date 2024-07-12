import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts'
import { fetchData, generateDistinctColors, Record, Props, extractUniqueRepositories } from './Helpers'
import Loading from './Loading/Loading'
import noData from './assets/no_data.png'

export const extractChangeFailureRatePerDay = (data: Record[]) => {
    let reduced = data.reduce((acc: Map<string, any>, record: Record) => {        
        if(record.status === true && !record.failed_at) {
            return acc
        }

        const date = record.created_at.toISOString().split('T')[0]
        let entry = acc.get(date)

        if (!entry) {
            entry = {
                date: date
            }

            acc.set(date, entry)
        }

        const key = record.repository
        const count = entry[key]

        if(!count) {
            entry[key] = 1
        } else {
            entry[key]++
        }
    
        return acc
    }, new Map<string, Record[]>())

    let result = Array.from(reduced.values())
    
    result.sort((l, r) => new Date(l.date).getTime() - new Date(r.date).getTime())

    return result
}

const ChangeFailureRate : React.FC<Props> = (props: Props) => {
    const [graphData, setGraphData] = useState<any[]>([])
    const [repositories, setRepositories] = useState<string[]>([])
    const [colors, setColors] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const organizeData = (data: Record[]) => {
        const extractedData = extractChangeFailureRatePerDay(data)
        
        setGraphData(extractedData)

        const repositories = extractUniqueRepositories(data)

        setRepositories(repositories)

        setColors(generateDistinctColors(repositories.length))
        setLoading(false)
    }

    useEffect(() => {
        setLoading(true)
        fetchData(props, organizeData)
    }, [props])

    if(loading) {
        return (
            <div data-testid="ChangeFailureRate" style={{width: "100%", height: "100%"}}>
                <Loading enabled={loading} />
            </div>
        )
    }

    if(graphData.length === 0) {
        return ( 
            <div data-testid="ChangeFailureRate" style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
              <img alt="No Data" title="No Data" src={noData} style={{width: "150px"}}/>
            </div>
        )
    }

    return (
        <div data-testid="ChangeFailureRate" style={{width: "100%", height: "100%"}}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={graphData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend
                        align="center"
                        verticalAlign="bottom"
                        layout="horizontal"
                    />
                    <ReferenceLine y={0} stroke="#000" />
                    {repositories.map((repo, idx) => (
                        <Bar key={idx} dataKey={repo} stackId="a" fill={colors[idx]}>
                            <LabelList dataKey={repo} fontWeight="bold" fontSize='16' fill='#000000' />
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ChangeFailureRate

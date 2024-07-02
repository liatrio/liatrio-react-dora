import React, { useState, useEffect } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, LineChart, Line } from 'recharts'
import { extractUniqueRepositories, fetchData, generateDistinctColors, Props, Record } from './Helpers'

export const extractAvgRecoverTimePerDay = (data: Record[]) => {
    let reduced = data.reduce((acc: Map<string, any>, record: Record) => {
        const date = record.created_at.toISOString().split('T')[0]
        let entry = acc.get(date)

        if (!entry) {
            entry = {
                date: date
            }

            acc.set(date, entry)
        }

        if(!entry[record.repository]) {
            entry[record.repository] = {
                count: 1,
                totalTime: record.recoverTime,
                avgTime: record.recoverTime
            }
        } else {
            entry[record.repository].count++
            entry[record.repository].totalTime += record.recoverTime
            entry[record.repository].avgTime += entry[record.repository].totalTime / entry[record.repository].count
        }
    
        return acc
    }, new Map<string, Record[]>())

    return Array.from(reduced.values())
}

const RecoverTime : React.FC<Props> = (props: Props) => {
    const [graphData, setGraphData] = useState<any[]>([])
    const [repositories, setRepositories] = useState<string[]>([])
    const [colors, setColors] = useState<string[]>([])

    const organizeData = (data: Record[]) => {
        const extractedData = extractAvgRecoverTimePerDay(data)
        
        setGraphData(extractedData)

        const repositories = extractUniqueRepositories(data)

        setRepositories(repositories)

        setColors(generateDistinctColors(repositories.length))
    }

    useEffect(() => {
        fetchData(props, organizeData)
    }, [props])

    return (
        <div data-testid="RecoverTime" style={{width: "100%", height: "100%", paddingBottom: "10px", border: "1px solid white", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <div style={{color: "white", paddingTop: "10px"}}>Recover Time</div>
            <hr style={{width: "100%", position: "relative", left: "-1px"}}/>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={graphData}
                    stackOffset="sign"
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
                        <Line key={repo} dataKey={`${repo}.avgTime`} fill={colors[idx]} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default RecoverTime

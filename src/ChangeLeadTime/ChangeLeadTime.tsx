import React, { useState, useEffect, useCallback } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { fetchData, generateDistinctColors, Record, Props } from '../Helpers'
import ChangeLeadTimeTooltip from './ChangeLeadTimeTooltip'

export const extractChangeLeadTimePerRepository = (data: Record[]) => {
    let reduced = data.reduce((acc, record) => {
        const repository = record.repository

        if (!acc.has(repository)) {
            acc.set(repository, [])
        }

        acc.get(repository)?.push(record)
    
        return acc
    }, new Map<string, Record[]>())

    return reduced
}

const ChangeLeadTime : React.FC<Props> = (props: Props) => {
    const [graphData, setGraphData] = useState<Map<string, Record[]>>(new Map<string, Record[]>())
    const [colors, setColors] = useState<string[]>([])

    const organizeData = useCallback((data: Record[]) => {
        const extractedData = extractChangeLeadTimePerRepository(data)
        setGraphData(extractedData)

        setColors(generateDistinctColors(extractedData.size))
    }, [])

    useEffect(() => {
        fetchData(props, organizeData)
    }, [props])

    return (
        <div data-testid="ChangeLeadTime" style={{width: "100%", height: "100%", paddingBottom: "10px", border: "1px solid white", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <div style={{color: "white", paddingTop: "10px"}}>Change Lead Time</div>
            <hr style={{width: "100%", position: "relative", left: "-1px"}}/>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{
                        top: 20,
                        right: 20,
                        left: 20,
                        bottom: 20,
                    }}
                >
                    <CartesianGrid />
                    <XAxis type="number" dataKey="start" name="Date" domain={['auto', 'auto']} tickFormatter={(date: string | number | Date) => { console.log(date); return (new Date(date)).toLocaleDateString(); } }/>
                    <YAxis type="number" dataKey="totalCycle" name="Time" unit="hrs" />
                    <Tooltip content={<ChangeLeadTimeTooltip />} />
                    <Legend />
                    {Array.from(graphData.keys()).map((key, idx) => (
                        <Scatter key={key} name={key} data={graphData.get(key)} fill={colors[idx]} />
                    ))}
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ChangeLeadTime

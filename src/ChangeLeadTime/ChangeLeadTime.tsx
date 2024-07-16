import React, { useState, useEffect, useCallback } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { fetchData, generateDistinctColors, Record, Props } from '../Helpers'
import ChangeLeadTimeTooltip from './ChangeLeadTimeTooltip'
import Loading from '../Loading/Loading'
import noData from '../assets/no_data.png'

export const extractChangeLeadTimePerRepository = (data: Record[]) => {
    let reduced = data.reduce((acc, record) => {
        if(!record.merged_at) {
            return acc;
        }

        const repository = record.repository

        if (!acc.has(repository)) {
            acc.set(repository, [])
        }

        let records = acc.get(repository);
        
        if(records) {
            records.push(record)
            // @ts-ignore
            records.sort((l, r) => l.merged_at.getTime() - r.merged_at.getTime())
        }
    
        return acc
    }, new Map<string, Record[]>())

    return reduced
}

const ChangeLeadTime : React.FC<Props> = (props: Props) => {
    const [graphData, setGraphData] = useState<Map<string, Record[]>>(new Map<string, Record[]>())
    const [colors, setColors] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const organizeData = useCallback((data: Record[]) => {
        const extractedData = extractChangeLeadTimePerRepository(data)
        setGraphData(extractedData)        

        setColors(generateDistinctColors(extractedData.size))
        setLoading(false)
    }, [])

    useEffect(() => {
        setLoading(true)
        fetchData(props, organizeData)
    }, [props])

    if(loading || props.loading) {
        return (
            <div data-testid="ChangeLeadTime" style={{width: "100%", height: "100%"}}>
                <Loading enabled={loading} />
            </div>
        )
    }

    if(graphData.size === 0) {
        return ( 
            <div data-testid="ChangeLeadTime" style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
              <img alt="No Data" title="No Data" src={noData} style={{width: "150px"}}/>
            </div>
        )
    }

    return (
        <div data-testid="ChangeLeadTime" style={{width: "100%", height: "100%"}}>
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
                    <XAxis type="number" dataKey="start" name="Date" domain={['auto', 'auto']} tickFormatter={(date: string | number | Date) => { return (new Date(date)).toLocaleDateString(); } }/>
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

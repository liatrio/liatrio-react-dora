import React, { useState, useEffect, useCallback } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { fetchData, generateDistinctColors, Record, Props } from '../Helpers'
import ChangeLeadTimeTooltip from './ChangeLeadTimeTooltip'
import { CycleGraphRecord } from './ChangeLeadTime.types'

const calculateRecordSummary = (record: Record) : CycleGraphRecord => {
    const mergedAt = record.merged_at.getTime()
    const prodDeployedAt = record.created_at.getTime()
    const openedAt = record.opened_at.getTime()

    const totalCycle = parseFloat(((prodDeployedAt - openedAt) / (1000 * 60 * 60)).toFixed(2))
    const timeInPR = parseFloat(((mergedAt - openedAt) / (1000 * 60 * 60)).toFixed(2))
    const timeInTest = parseFloat(((prodDeployedAt - mergedAt) / (1000 * 60 * 60)).toFixed(2))
    const start = (new Date(record.merged_at.toISOString().split('T')[0])).getTime()

    return {
        totalCycle,
        start,
        timeInPR,
        timeInTest,
        data: record
    }
}

const ChangeLeadTime : React.FC<Props> = (props: Props) => {
    const [cycleData, setCycleData] = useState<Map<string, CycleGraphRecord[]>>(new Map<string, CycleGraphRecord[]>())
    // const [meanData, setMeanData] = useState<CycleMeanRecord[]>([])
    const [colors, setColors] = useState<string[]>([])

    const filterAndGroupCycleData = useCallback((data: Record[]) : Map<string, CycleGraphRecord[]> => {
        return data.reduce((acc, record) => {
            const dateKey = record.repository

            if((props.repositories && props.repositories.length > 0 && !props.repositories.includes(record.repository))
                || (props.team !== undefined && record.team !== props.team)
            ) {
                return acc
            }

            if (!acc.has(dateKey)) {
                acc.set(dateKey, [])
            }

            const summaryRecord = calculateRecordSummary(record)

            acc.get(dateKey)?.push(summaryRecord)
        
            return acc
        }, new Map<string, CycleGraphRecord[]>())
    }, [props.repositories, props.team])

    const organizeData = useCallback((data: Record[]) => {
        const groupedData = filterAndGroupCycleData(data)
        setCycleData(groupedData)
        setColors(generateDistinctColors(groupedData.size))
    }, [filterAndGroupCycleData])

    useEffect(() => {
        fetchData(props, organizeData)
    }, [props])

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
                    <XAxis type="number" dataKey="start" name="Date" domain={['auto', 'auto']} tickFormatter={(date: string | number | Date) => { console.log(date); return (new Date(date)).toLocaleDateString(); } }/>
                    <YAxis type="number" dataKey="totalCycle" name="Time" unit="hrs" />
                    <Tooltip content={<ChangeLeadTimeTooltip />} />
                    <Legend />
                    {Array.from(cycleData.keys()).map((key, idx) => (
                        <Scatter key={key} name={key} data={cycleData.get(key)} fill={colors[idx]} />
                    ))}
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ChangeLeadTime

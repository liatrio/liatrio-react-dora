import React, { useState, useEffect, useCallback } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { fetchData, generateDistinctColors } from '../Helpers'
import ChangeLeadTimeTooltip from './ChangeLeadTimeTooltip'
import { ChangeLeadTimeProps, CycleGraphRecord, CycleMeanRecord, CycleRecord } from './ChangeLeadTime.types'

const dateKeys = ['openedAt', 'mergedAt', 'devDeployedAt', 'testDeployedAt', 'prodDeployedAt']

const cycleRecordReviver = (key: string, value: any) => {
    if (dateKeys.includes(key)) {
        return new Date(value)
    }

    return value
}

const calculateRecordSummary = (record: CycleRecord) : CycleGraphRecord => {
    const mergedAt = record.mergedAt.getTime()
    const prodDeployedAt = record.prodDeployedAt.getTime()
    const openedAt = record.openedAt.getTime()
    const testDeployedAt = record.testDeployedAt.getTime()
    const devDeployedAt = record.devDeployedAt.getTime()

    const totalCycle = parseFloat(((prodDeployedAt - openedAt) / (1000 * 60 * 60)).toFixed(2))
    const timeInPR = parseFloat(((mergedAt - openedAt) / (1000 * 60 * 60)).toFixed(2))
    const timeInPipeline = parseFloat(((devDeployedAt - mergedAt) / (1000 * 60 * 60)).toFixed(2))
    const timeInDev = parseFloat(((testDeployedAt - devDeployedAt) / (1000 * 60 * 60)).toFixed(2))
    const timeInTest = parseFloat(((prodDeployedAt - testDeployedAt) / (1000 * 60 * 60)).toFixed(2))
    const start = (new Date(record.mergedAt.toISOString().split('T')[0])).getTime()

    return {
        totalCycle,
        start,
        timeInPR,
        timeInPipeline,
        timeInDev,
        timeInTest,
        data: record
    }
}

const buildMeans = (data: Map<string, CycleGraphRecord[]>) : CycleMeanRecord[] => {
    const groupedData = new Map<number, CycleGraphRecord[]>();

    data.forEach((records, key) => {
        records.forEach(record => {
            const dateKey = (new Date(record.data.openedAt.toISOString().split('T')[0])).getTime()
            
            if (!groupedData.has(dateKey)) {
                groupedData.set(dateKey, [])
            }

            groupedData.get(dateKey)!.push(record)
        })
    })

    const meansByDay : CycleMeanRecord[] = []

    groupedData.forEach((records, date) => {
        const totalRecords = records.length;
        const totalTimeInPipeline = records.reduce((sum, record) => sum + record.timeInPipeline, 0)
        const totalTimeInPR = records.reduce((sum, record) => sum + record.timeInPR, 0)
        const totalTimeInDev = records.reduce((sum, record) => sum + record.timeInDev, 0)
        const totalTimeInTest = records.reduce((sum, record) => sum + record.timeInTest, 0)

        meansByDay.push({
            start: date,
            meanTimeInPipeline: totalTimeInPipeline / totalRecords,
            meanTimeInPR: totalTimeInPR / totalRecords,
            meanTimeInDev: totalTimeInDev / totalRecords,
            meanTimeInTest: totalTimeInTest / totalRecords
        })
    })

    meansByDay.sort((l, r) => l.start - r.start)

    return meansByDay
}

const ChangeLeadTime : React.FC<ChangeLeadTimeProps> = (props: ChangeLeadTimeProps) => {
    const [cycleData, setCycleData] = useState<Map<string, CycleGraphRecord[]>>(new Map<string, CycleGraphRecord[]>())
    // const [meanData, setMeanData] = useState<CycleMeanRecord[]>([])
    const [colors, setColors] = useState<string[]>([])

    const filterAndGroupCycleData = useCallback((data: CycleRecord[]) : Map<string, CycleGraphRecord[]> => {
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

    const organizeData = useCallback((data: CycleRecord[]) => {
        const groupedData = filterAndGroupCycleData(data)
        // const meanData = buildMeans(groupedData)
        setCycleData(groupedData)
        // setMeanData(meanData)
        setColors(generateDistinctColors(groupedData.size))
    }, [filterAndGroupCycleData])

    useEffect(() => {
        if(!props.data) {
            if(!props.api) {
                return;
            }
            
            const body = {
                repositories: props.repositories,
                team: props.team,
                start: props.start,
                end: props.end
            }
            
            fetchData(props.api, body, cycleRecordReviver, organizeData, props.getAuthHeaderValue)
        } else {
            const data: CycleRecord[] = JSON.parse(props.data, cycleRecordReviver)
            organizeData(data)
        }
    }, [props.api, props.repositories, props.team, props.start, props.end, props.data, organizeData])

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

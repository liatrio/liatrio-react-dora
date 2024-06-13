import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Treemap, ReferenceLine, LabelList } from 'recharts'
import { fetchData, generateDistinctColors } from './Helpers'

interface ChangeFailureRateRecord {
    created_at: Date,
    repository: string,
    status: boolean,
    team: string
}

const changeFailureRateRecordReviver = (key: string, value: any) => {
    if (key === 'created_at') {
        return new Date(value)
    }

    return value
}

export interface ChangeFailureRateProps {
    api?: string,
    getAuthHeaderValue?: () => Promise<string | undefined>,
    team?: string,
    repositories?: string[],
    data?: string,
    end?: Date,
    start?: Date
}

const ChangeFailureRate : React.FC<ChangeFailureRateProps> = (props: ChangeFailureRateProps) => {
    const [graphData, setGraphData] = useState<any[]>([])
    const [repositories, setRepositories] = useState<{color: number, name: string}[]>([])
    const [colors, setColors] = useState<string[]>([])

    const filterAndGroupData = (data: ChangeFailureRateRecord[]) : Map<string, ChangeFailureRateRecord[]> => {
        return data.reduce((acc, record) => {
            const dateKey = record.created_at.toISOString().split('T')[0]

            if((props.repositories && props.repositories.length > 0 && !props.repositories.includes(record.repository))
                || (props.team !== undefined && record.team !== props.team)
            ) {
                return acc
            }

            if (!acc.has(dateKey)) {
                acc.set(dateKey, [])
            }

            acc.get(dateKey)?.push(record)
        
            return acc
        }, new Map<string, ChangeFailureRateRecord[]>())
    }

    const summarizeAndColorizeData = (data: Map<string, ChangeFailureRateRecord[]>) => {
        const graphData: any[] = []
        const repositoryColors: {color: number, name: string}[] = []
        
        for(const date of data.keys()) {
            const records = data.get(date)

            let dayData: any = {
                date: date,
            }

            for(const record of records ?? []) {
                let keyModifier = ""

                if(record.status === false) {
                    keyModifier += "-failure"
                } else {
                    keyModifier += "-success"
                }

                const key = record.repository + keyModifier
                const count = dayData[key]

                if(!count) {
                    dayData[key] = record.status ? 1 : -1

                    const colorIndex = repositoryColors.findIndex(f => f.name === key)

                    if(colorIndex < 0) {
                        repositoryColors.push({
                            color: repositoryColors.length,
                            name: key
                        })
                    }
                } else {
                    dayData[key] = count + (record.status ? 1 : -1)
                }
            }
            
            graphData.push(dayData)
        }

        console.log(graphData)

        setColors(generateDistinctColors(repositoryColors.length))
        setGraphData(graphData)
        setRepositories(repositoryColors)
    }

    const organizeData = (data: ChangeFailureRateRecord[]) => {
        const groupedRecordsByCreated = filterAndGroupData(data)

        summarizeAndColorizeData(groupedRecordsByCreated)
    }

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
            
            fetchData(props.api, body, changeFailureRateRecordReviver, organizeData, props.getAuthHeaderValue)
        } else {
            const data: ChangeFailureRateRecord[] = JSON.parse(props.data, changeFailureRateRecordReviver)
            organizeData(data)
        }
    }, [props.api, props.repositories, props.team, props.start, props.end])

    return (
        <div data-testid="ChangeFailureRate" style={{width: "100%", height: "100%"}}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
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
                        <Bar key={idx} dataKey={repo.name} stackId="a" fill={colors[repo.color]}>
                            <LabelList dataKey={repo.name} fontWeight="bold" fontSize='16' fill='#000000' />
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ChangeFailureRate

import React, { useState, useEffect } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Treemap, ReferenceLine, LabelList, LineChart, Line } from 'recharts'
import { fetchData, generateDistinctColors } from './Helpers'

interface RecoverTimeRecord {
    created_at: Date,
    repository: string,
    fixed_at: Date,
    team: string
}

const recoverTimeRecordReviver = (key: string, value: any) => {
    if (['created_at', 'fixed_at'].includes(key)) {
        return new Date(value)
    }

    return value
}

export interface RecoverTimeProps {
    api?: string,
    getAuthHeaderValue?: () => Promise<string | undefined>,
    team?: string,
    repositories?: string[],
    data?: string,
    end?: Date,
    start?: Date
}

const RecoverTime : React.FC<RecoverTimeProps> = (props: RecoverTimeProps) => {
    const [graphData, setGraphData] = useState<any[]>([])
    const [repositories, setRepositories] = useState<{color: number, name: string}[]>([])
    const [colors, setColors] = useState<string[]>([])

    const filterAndGroupData = (data: RecoverTimeRecord[]) : Map<string, RecoverTimeRecord[]> => {
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
        }, new Map<string, RecoverTimeRecord[]>())
    }

    const summarizeAndColorizeData = (data: Map<string, RecoverTimeRecord[]>) => {
        const graphData: any[] = []
        const repositoryColors: {color: number, name: string}[] = []
        
        for(const date of data.keys()) {
            const records = data.get(date)

            let dayData: any = {
                date: date,
            }

            for(const record of records ?? []) {
                const repoDay = dayData[record.repository]

                if(!repoDay) {
                    let graphRecord: any = {
                        count: 1,
                        time: parseFloat(((record.fixed_at.getTime() - record.created_at.getTime()) / (1000 * 60 * 60)).toFixed(2))
                    }

                    const colorIndex = repositoryColors.findIndex(f => f.name === record.repository)

                    if(colorIndex < 0) {
                        repositoryColors.push({
                            color: repositoryColors.length,
                            name: record.repository
                        })
                    }

                    dayData[record.repository] = graphRecord;
                } else {
                    repoDay.count += 1
                    repoDay.time += parseFloat(((record.fixed_at.getTime() - record.created_at.getTime()) / (1000 * 60 * 60)).toFixed(2))
                }
            }

            for(const key in dayData) {
                if(key === 'date') {
                    continue
                }

                const repoDay = dayData[key]

                dayData[key] = repoDay.time / repoDay.count
            }
            
            graphData.push(dayData)
        }

        setColors(generateDistinctColors(repositoryColors.length))
        setGraphData(graphData)
        setRepositories(repositoryColors)
    }

    const organizeData = (data: RecoverTimeRecord[]) => {
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
            
            fetchData(props.api, body, recoverTimeRecordReviver, organizeData, props.getAuthHeaderValue)
        } else {
            const data: RecoverTimeRecord[] = JSON.parse(props.data, recoverTimeRecordReviver)
            organizeData(data)
        }
    }, [props.api, props.repositories, props.team, props.start, props.end])

    return (
        <div data-testid="ChangeFailureRate" style={{width: "100%", height: "100%"}}>
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
                        <Line key={idx} dataKey={repo.name} fill={colors[repo.color]} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default RecoverTime

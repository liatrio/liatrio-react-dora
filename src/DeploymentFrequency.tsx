import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Treemap, ReferenceLine, LabelList } from 'recharts'
import { fetchData, generateDistinctColors } from './Helpers'

enum DeploymentState {
    success,
    failure
}

interface DeploymentRecord {
    created_at: Date,
    updated_at: Date,
    environment: string,
    state: DeploymentState,
    repository: string,
    team: string
}

const deploymentRecordReviver = (key: string, value: any) => {
    if (key === 'created_at' || key === 'updated_at') {
        return new Date(value)
    }

    if (key === 'state') {
        return value === "success" ? DeploymentState.success : DeploymentState.failure
    }

    return value
}

export interface DeploymentFrequencyProps {
    api: string,
    team: string,
    repositories?: string[],
    includeFailures?: boolean,
    environment?: string,
    data?: string,
    end?: Date,
    start?: Date
}

const DeploymentFrequency = (props: DeploymentFrequencyProps) => {
    const [graphData, setGraphData] = useState<any[]>([])
    const [repositories, setRepositories] = useState<{color: number, name: string}[]>([])
    const [colors, setColors] = useState<string[]>([])

    const filterAndGroupData = (data: DeploymentRecord[]) : Map<string, DeploymentRecord[]> => {
        return data.reduce((acc, record) => {
            const dateKey = record.created_at.toISOString().split('T')[0]

            if((props.repositories && props.repositories.length > 0 && !props.repositories.includes(record.repository))
                || (props.includeFailures !== true && record.state === DeploymentState.failure)
                || (props.environment !== undefined && record.environment !== props.environment)
                || (props.team !== undefined && record.team !== props.team)
            ) {
                return acc
            }

            if (!acc.has(dateKey)) {
                acc.set(dateKey, [])
            }

            acc.get(dateKey)?.push(record)
        
            return acc
        }, new Map<string, DeploymentRecord[]>())
    }

    const summarizeAndColorizeData = (data: Map<string, DeploymentRecord[]>) => {
        const graphData: any[] = []
        const repositoryColors: {color: number, name: string}[] = []
        
        for(const date of data.keys()) {
            const records = data.get(date)

            let dayData: any = {
                date: date,
            }

            for(const record of records ?? []) {
                let keyModifier = ""

                if(props.includeFailures) {
                    if(record.state === DeploymentState.failure) {
                        keyModifier += "-failure"
                    } else {
                        keyModifier += "-success"
                    }
                }

                const key = record.repository + keyModifier
                const count = dayData[key]

                if(!count) {
                    dayData[`${key}`] = record.state === DeploymentState.success ? 1 : -1

                    const colorIndex = repositoryColors.findIndex(f => f.name === key)

                    if(colorIndex < 0) {
                        repositoryColors.push({
                            color: repositoryColors.length,
                            name: key
                        })
                    }
                } else {
                    dayData[`${key}`] = count + (record.state === DeploymentState.success ? 1 : -1)
                }
            }
            
            graphData.push(dayData)
        }

        setColors(generateDistinctColors(repositoryColors.length))
        setGraphData(graphData)
        setRepositories(repositoryColors)
    }

    const organizeData = (data: DeploymentRecord[]) => {
        const groupedRecordsByCreated = filterAndGroupData(data)

        summarizeAndColorizeData(groupedRecordsByCreated)
    }

    useEffect(() => {
        if(!props.data) {
            const body = {
                repositories: props.repositories,
                team: props.team,
                start: props.start,
                end: props.end
            }
            
            fetchData(props.api, body, deploymentRecordReviver, organizeData)
        } else {
            const data: DeploymentRecord[] = JSON.parse(props.data, deploymentRecordReviver)
            organizeData(data)
        }
    }, [props.api, props.repositories])
    
    return (
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
    )
}

export default DeploymentFrequency

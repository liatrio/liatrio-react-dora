import React, { useState, useEffect } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Treemap, ReferenceLine, LabelList, LineChart, Line } from 'recharts'
import { fetchData, generateDistinctColors, Props, Record } from './Helpers'

const RecoverTime : React.FC<Props> = (props: Props) => {
    const [graphData, setGraphData] = useState<any[]>([])
    const [repositories, setRepositories] = useState<{color: number, name: string}[]>([])
    const [colors, setColors] = useState<string[]>([])

    const filterAndGroupData = (data: Record[]) : Map<string, Record[]> => {
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
        }, new Map<string, Record[]>())
    }

    const summarizeAndColorizeData = (data: Map<string, Record[]>) => {
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

    const organizeData = (data: Record[]) => {
        const groupedRecordsByCreated = filterAndGroupData(data)

        summarizeAndColorizeData(groupedRecordsByCreated)
    }

    useEffect(() => {
        fetchData(props, organizeData)
    }, [props])

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

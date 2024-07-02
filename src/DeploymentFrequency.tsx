import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts'
import { fetchData, generateDistinctColors, Record, Props, extractUniqueRepositories} from './Helpers'

export const extractDeploymentsPerDay = (data: Record[]) => {
    const reduced = data.reduce((acc: Map<string, any>, record: Record) => {
        if(record.status === false) {
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

        if(!entry[record.repository]) {
            entry[record.repository] = 1
        } else {
            entry[record.repository]++
        }
    
        return acc
    }, new Map<string, Record[]>())

    return Array.from(reduced.values())
}

const DeploymentFrequency : React.FC<Props> = (props: Props) => {
    const [graphData, setGraphData] = useState<any[]>([])
    const [repositories, setRepositories] = useState<string[]>([])
    const [colors, setColors] = useState<string[]>([])

    const organizeData = (data: Record[]) => {
        const extractedData = extractDeploymentsPerDay(data)
        setGraphData(extractedData)

        const repositories = extractUniqueRepositories(data)

        setRepositories(repositories)

        setColors(generateDistinctColors(repositories.length))
    }

    useEffect(() => {
        fetchData(props, organizeData)
    }, [props])
    
    return (
        <div data-testid="DeploymentFrequency" style={{width: "100%", height: "100%", paddingBottom: "10px", border: "1px solid white", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <div style={{color: "white", paddingTop: "10px"}}>Deployment Frequency</div>
            <hr style={{width: "100%", position: "relative", left: "-1px"}}/>
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
                        <Bar key={idx} dataKey={repo} stackId="a" fill={colors[idx]}>
                            <LabelList dataKey={repo} fontWeight="bold" fontSize='16' fill='#000000' />
                        </Bar>
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default DeploymentFrequency

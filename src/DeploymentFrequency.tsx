import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { fetchData, generateDistinctColors, Record, Props, extractUniqueRepositories, getDateDaysInPast, generateTicks, formatTicks} from './Helpers'
import Loading from './Loading/Loading'
import noDataImg from './assets/no_data.png'
import CustomBar from './CustomBar'
import { Tooltip } from 'react-tooltip'
import TooltipContent from './ToolTip/TooltipContent'

export const extractDeploymentsPerDay = (props: Props, data: Record[]) : [any[], number] => {
    let max = 0

    const reduced = data.reduce((acc: Map<number, any>, record: Record) => {
        if(!record.status) {
            return acc
        }

        const date = (new Date(Date.UTC(record.created_at.getUTCFullYear(), record.created_at.getUTCMonth(), record.created_at.getUTCDate()))).getTime()
        let entry = acc.get(date)

        if (!entry) {
            entry = {
                date: date
            }

            acc.set(date, entry)
        }

        let repo = entry[record.repository]

        if(!repo) {
            repo = {
                count: 1,
                urls: [record.deploy_url]
            }

            entry[record.repository] = repo
        } else {
            repo.count++
            repo.urls.push(record.deploy_url)
        }
        
        if(max < repo.count) {
            max = repo.count
        }

        return acc
    }, new Map<number, Record[]>())

    let result = Array.from(reduced.values())

    result.sort((l, r) => new Date(l.date).getTime() - new Date(r.date).getTime())

    return [result, max]
}

const DeploymentFrequency : React.FC<Props> = (props: Props) => {
    const [graphData, setGraphData] = useState<any[]>([])
    const [repositories, setRepositories] = useState<string[]>([])
    const [colors, setColors] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [noData, setNoData] = useState<boolean>(false)
    const [startDate, setStartDate] = useState<Date>(props.start ?? getDateDaysInPast(31))
    const [endDate, setEndDate] = useState<Date>(props.end ?? getDateDaysInPast(1))
    const [maxDeploys, setMaxDeploys] = useState<number>(0)
    const [tooltipContent, setTooltipContent] = useState<any>(null)

    const ticks = generateTicks(startDate, endDate, 5)
    const maxBarWidth = (1 / ((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))) * 33 + "%"

    const organizeData = (data: Record[]) => {
        if(data.length === 0) {
            setNoData(true)
        }

        const [extractedData, deploys] = extractDeploymentsPerDay(props, data)
        setGraphData(extractedData)
        setMaxDeploys(deploys)

        const repositories = extractUniqueRepositories(data)

        setRepositories(repositories)

        setColors(generateDistinctColors(repositories.length))
        setLoading(false)
    }

    useEffect(() => {
        setStartDate(props.start ?? getDateDaysInPast(31))
        setEndDate(props.end ?? getDateDaysInPast(1))
        setLoading(true)
        fetchData(props, organizeData)
    }, [props])

    if(loading || props.loading) {
        return (
            <div data-testid="DeploymentFrequency" style={{width: "100%", height: "100%"}}>
                <Loading enabled={loading || (props.loading ?? false)} />
            </div>
        )
    }

    if(noData) {
        return (
            <div data-testid="DeploymentFrequency" style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
              <img alt="No Data" title="No Data" src={noDataImg} style={{width: "150px"}}/>
            </div>
        )
    }

    const handleMouseOverBar = (event: any, payload: any) => {
        setTooltipContent(<TooltipContent type="df" payload={[payload]} />)
    }

    return (
        <div data-testid="DeploymentFrequency" className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={graphData}
                    barGap={20}
                    margin={{
                        right: 40,
                        top: 10
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis padding="gap" dataKey="date" tickSize={15} interval={0} type={"number"} tick={{fill: "#FFFFFF"}} ticks={ticks} domain={[startDate.getTime(), endDate.getTime()]} tickFormatter={formatTicks} />
                    <YAxis type={"number"} tick={{fill: "#FFFFFF"}} allowDecimals={false} domain={[0, maxDeploys]}/>
                    {repositories.map((repo, idx) => { 
                        const key = `${repo}.count`
                        return (
                            <Bar animationDuration={0} key={idx} dataKey={key} stackId="a" fill={colors[idx]} barSize={maxBarWidth} shape={(props: any) => <CustomBar {...props} tooltipId="dfTooltip" mouseOver={handleMouseOverBar} />}/>
                        )
                    })}
                </BarChart>
            </ResponsiveContainer>
            <Tooltip className='chartTooltip' delayHide={2000} clickable={true} classNameArrow='chartTooltipArrow' id="dfTooltip"  border="1px solid white" opacity="1" content={tooltipContent}/>
        </div>
    )
}

export default DeploymentFrequency

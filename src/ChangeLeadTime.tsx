import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { fetchData, generateDistinctColors, DoraRecord, ChartProps, getDateDaysInPast, generateTicks, formatTicks } from './Helpers'
import Loading from './Loading/Loading'
import noDataImg from './assets/no_data.png'
import TooltipContent from './ToolTip/TooltipContent'
import { Tooltip } from 'react-tooltip'
import CustomShape from './CustomShape'

export const extractChangeLeadTimePerRepository = (data: DoraRecord[]) => {
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
    }, new Map<string, DoraRecord[]>())

    return reduced
}

const ChangeLeadTime : React.FC<ChartProps> = (props: ChartProps) => {
    const [graphData, setGraphData] = useState<Map<string, DoraRecord[]>>(new Map<string, DoraRecord[]>())
    const [colors, setColors] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [noData, setNoData] = useState<boolean>(false)
    const [startDate, setStartDate] = useState<Date>(props.start ?? getDateDaysInPast(31))
    const [endDate, setEndDate] = useState<Date>(props.end ?? getDateDaysInPast(1))
    const [tooltipContent, setTooltipContent] = useState<any>(null)
    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)
    const [node, setNode] = useState<any>(null)
    const [position, setPosition] = useState<any>(null)
    const timeoutRef = useRef<any>(null)

    const ticks = generateTicks(startDate, endDate, 5)

    const organizeData = useCallback((data: DoraRecord[]) => {
        if(data.length === 0) {
            setNoData(true)
        }

        const extractedData = extractChangeLeadTimePerRepository(data)
        setGraphData(extractedData)

        setColors(generateDistinctColors(extractedData.size))
        setLoading(false)
    }, [])

    useEffect(() => {
        setStartDate(props.start ?? getDateDaysInPast(31))
        setEndDate(props.end ?? getDateDaysInPast(1))
        setLoading(true)
        fetchData(props, organizeData)
    }, [props])

    if(loading || props.loading) {
        return (
            <div data-testid="ChangeLeadTime" style={{width: "100%", height: "100%"}}>
                <Loading enabled={loading || (props.loading ?? false)} />
            </div>
        )
    }

    if(noData) {
        return (
            <div data-testid="ChangeLeadTime" style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
              <img alt="No Data" title="No Data" src={noDataImg} style={{width: "150px"}}/>
            </div>
        )
    }

    function getElementCenter(element: any) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        return { x: centerX, y: centerY };
    }

    const handleMouseOverDot = (payload: any, id: any, event: any) => {
        if(id !== node) {
            setNode(id)
            setTooltipContent(<TooltipContent type="clt" payload={[payload]} />)
            setTooltipOpen(true)
        }
        const center = getElementCenter(event.target)

        setPosition(center)
    }

    const handleMouseMoveContainer = (event: any) => {
        if(!tooltipOpen) {
            return
        }

        if(event.target.tagName === "svg" || event.target.tagName === "line") {
            if(!timeoutRef.current) {
                setNode(null)
                timeoutRef.current = setTimeout(() => {setTooltipOpen(false)}, 2000)
            }
        } else if(timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }

    const handleMouseMoveChart = (coords: any, event: any) => {
        handleMouseMoveContainer(event)
    }

    const handleMouseOut = (event: any) => {
        if(!timeoutRef.current) {
            setNode(null)
            timeoutRef.current = setTimeout(() => {setTooltipOpen(false)}, 2000)
        }
    }

    return (
        <div data-testid="ChangeLeadTime" className="chart-wrapper" onMouseMove={handleMouseMoveContainer} onMouseOut={handleMouseOut}>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    width={500}
                    height={300}
                    margin={{
                        right: 40,
                        top: 10
                    }}
                    onMouseMove={handleMouseMoveChart}
                    onMouseLeave={handleMouseOut}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis padding={{left: 9, right: 9}} dataKey="start" tickSize={15} type={"number"} tick={{fill: "#FFFFFF"}} ticks={ticks} domain={[startDate.getTime(), endDate.getTime()]} tickFormatter={formatTicks} />
                    <YAxis type="number" dataKey="totalCycle" name="Time" unit=" hrs" tick={{fill: "#FFFFFF"}} />
                    {Array.from(graphData.keys()).map((key, idx) => (
                        <Scatter animationDuration={0} key={key} name={key} data={graphData.get(key)} fill={colors[idx]} onMouseOver={handleMouseOverDot}
                            shape={(props: any) => <CustomShape {...props} tooltipId="cltTooltip" />}
                            activeShape={(props: any) => <CustomShape {...props} tooltipId="cltTooltip" />}
                        />
                    ))}
                </ScatterChart>
            </ResponsiveContainer>
            <Tooltip className='chartTooltip' offset={20}  isOpen={tooltipOpen} position={position} clickable={true} classNameArrow='chartTooltipArrow' id="cltTooltip" border="1px solid white" opacity="1" content={tooltipContent}/>
        </div>
    )
}

export default ChangeLeadTime

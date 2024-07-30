import React, { useState, useEffect, useCallback } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { fetchData, generateDistinctColors, Record, Props, getDateDaysInPast, generateTicks, formatTicks } from '../Helpers'
import Loading from '../Loading/Loading'
import noDataImg from '../assets/no_data.png'
import ToolTip from '../ToolTip/ToolTip'

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

const renderCustomShape = (props: any) => {
    const { cx, cy, fill } = props;

    return (
      <circle cx={cx} cy={cy} r={8} fill={fill} />
    );
  };

const ChangeLeadTime : React.FC<Props> = (props: Props) => {
    const [graphData, setGraphData] = useState<Map<string, Record[]>>(new Map<string, Record[]>())
    const [colors, setColors] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [noData, setNoData] = useState<boolean>(false)
    const [startDate, setStartDate] = useState<Date>(props.start ?? getDateDaysInPast(31))
    const [endDate, setEndDate] = useState<Date>(props.end ?? getDateDaysInPast(1))

    const ticks = generateTicks(startDate, endDate, 5)

    const organizeData = useCallback((data: Record[]) => {
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

    return (
        <div data-testid="ChangeLeadTime" style={{width: "100%", height: "100%"}}>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{
                        right: 40,
                        top: 10
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis padding="gap" dataKey="start" tickSize={15} type={"number"} tick={{fill: "#FFFFFF"}} ticks={ticks} domain={[startDate.getTime(), endDate.getTime()]} tickFormatter={formatTicks} />
                    <YAxis type="number" dataKey="totalCycle" name="Time" unit=" hrs" tick={{fill: "#FFFFFF"}} />
                    <Tooltip content={<ToolTip />} />
                    {Array.from(graphData.keys()).map((key, idx) => (
                        <Scatter key={key} name={key} data={graphData.get(key)} fill={colors[idx]} shape={renderCustomShape} />
                    ))}
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    )
}

export default ChangeLeadTime

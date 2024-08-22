import React, { useState, useRef } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import TooltipContent from './ToolTip/TooltipContent'
import { Tooltip } from 'react-tooltip'
import CustomShape from './CustomShape'
import { DoraRecord } from './interfaces/apiInterfaces'
import { ChartProps } from './interfaces/propInterfaces'
import { buildNonGraphBody, formatTicks, generateTicks, useSharedLogic } from './functions/chartFunctions'
import { buildDoraState } from './functions/metricFunctions'
import { changeLeadTimeName } from './constants'

export const composeGraphData = (_: ChartProps, data: DoraRecord[]) => {
  let reduced = data.reduce((acc, record) => {
    if(!record.merged_at) {
      return acc
    }

    const repository = record.repository

    if (!acc.has(repository)) {
      acc.set(repository, [])
    }

    let records = acc.get(repository)

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
  const [tooltipContent, setTooltipContent] = useState<any>(null)
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)
  const [node, setNode] = useState<any>(null)
  const [position, setPosition] = useState<any>(null)
  const [yLabel, setYLabel] = useState<any>(' hrs')

  const postCompose = (componentProps: ChartProps, data: DoraRecord[], composedData: any) => {
    const state = buildDoraState(componentProps, data)

    if(state.changeLeadTime.average > 48) {
      composedData.forEach((doraRecords: any, key: any) => {
        doraRecords.forEach((record: any) => {
          record.totalCycle /= 24
        })
      })

      setYLabel(" days")
    } else if(state.changeLeadTime.average < 1) {
      composedData.forEach((doraRecords: any, key: any) => {
        doraRecords.forEach((record: any) => {
          record.totalCycle *= 24
        })
      })

      setYLabel(" mins")
    } else {
      setYLabel(" hrs")
    }
  }

  const [startDate, endDate, colors, _, noData] = useSharedLogic(props, composeGraphData, setGraphData, postCompose)

  const timeoutRef = useRef<any>(null)

  const ticks = generateTicks(startDate, endDate, 5)

  const nonGraphBody = buildNonGraphBody(props, noData, changeLeadTimeName)

  if(nonGraphBody) {
    return nonGraphBody
  }

  function getElementCenter(element: any) {
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    return { x: centerX, y: centerY }
  }

  const handleMouseOverDot = (payload: any, id: any, event: any) => {
    if(id !== node) {
      const repository = ""
      setNode(id)
      setTooltipContent(<TooltipContent repository={repository} type={changeLeadTimeName} payload={[payload]} />)
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
    <div data-testid={changeLeadTimeName} className="chart-wrapper" onMouseMove={handleMouseMoveContainer} onMouseOut={handleMouseOut}>
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
          <YAxis type="number" dataKey="totalCycle" name="Time" unit={yLabel} tick={{fill: "#FFFFFF"}} />
          {Array.from(graphData.keys()).map((key: string, idx: number) => (
            <Scatter className={key} animationDuration={0} key={key} name={key} data={graphData.get(key)} fill={colors[idx]} onMouseOver={handleMouseOverDot}
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

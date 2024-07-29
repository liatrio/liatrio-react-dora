import React from 'react'
import './ToolTip.css'

export interface Payload {
    name: string
    value: number
    payload: any
}

export interface Props {
    active?: boolean
    label?: string | number
    payload?: Payload[]
}

const getTitle = (payloads: Payload[]) => {
    const payload0 = payloads[0]
    const payload = payload0.payload

    if(!payload.type) {
        return (<h3>{payloads[0].payload.title}</h3>)
    } else {
        const date = new Date(payloads[0].payload.date).toISOString().split("T")[0]
        return (<h3>{date}</h3>)
    }
}

const getBody = (payloads: Payload[]) => {
    const payload0 = payloads[0]
    const payload = payload0.payload

    if(!payload.type) {
        return (<>
            <p>Repository: {payload.repository}</p>
            <p>Total Cycle Time: {payload.totalCycle} hrs</p>
        </>)
    } else if(payload.type === "df") {
        return (<>
            {Object.keys(payload).map((key: any) => {
                if(key !== "date" && key !== "type") {
                    return <p>{key}: {payload[key]}</p>
                } else {
                    return <></>
                }
            })}
        </>)
    } else if(payload.type === "cfr") {
        return (<>
            {Object.keys(payload).map((key: any) => {
                if(key !== "date" && key !== "type") {
                    return <p>{key}: {payload[key].total * 100}% </p>
                } else {
                    return <></>
                }
            })}
        </>)
    } else if(payload.type === "rt") {
        return (<>
            {Object.keys(payload).map((key: any) => {
                if(key !== "date" && key !== "type") {
                    return <p>{key}: {payload[key].avgTime} hrs</p>
                } else {
                    return <></>
                }
            })}
        </>)
    }
}

const getFooter = (payloads: Payload[]) => {
    const payload0 = payloads[0]
    const payload = payload0.payload

    if(!payload.type) {
        return (<span>Commit By: {payload.user}</span>)
    } else {
        return (<></>)
    }
}

const ToolTip : React.FC<Props> = ({active, payload}: Props) => {
    if(!active || !payload || !payload.length || payload.length === 0) {
        return (<></>)
    }

    const title = getTitle(payload)
    const body = getBody(payload)
    const footer = getFooter(payload)

    return (
        <div className="dora-tooltip">
            <div className="dora-tooltip-header">
                {title}
            </div>
            <div className="dora-tooltip-body">
                {body}
            </div>
            <div className="dora-tooltip-footer">
                {footer}
            </div>
        </div>
    )
}

export default ToolTip
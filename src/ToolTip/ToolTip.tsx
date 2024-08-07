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
    showExtendedDetail?: boolean
    type: string,
    onClose?: () => void
}

const getTitle = (type: string, payloads: Payload[]) => {
    console.log(payloads)
    const payload0 = payloads[0]
    const payload = payload0.payload

    if(type === "clt") {
        return (<h3>{payload.title}</h3>)
    } else {
        const date = new Date(payload.date).toISOString().split("T")[0]
        return (<h3>{date}</h3>)
    }
}

const getBody = (type: string, payloads: Payload[]) => {
    const payload0 = payloads[0]
    const payload = payload0.payload

    if(type === "clt") {
        return (<>
            <p>Repository: {payload.repository}</p>
            <p>Total Cycle Time: {payload.totalCycle} hrs</p>
        </>)
    } else if(type === "df") {
        return (<>
            {Object.keys(payload).map((key: any) => {
                if(key !== "date" && key !== "type") {
                    return <p>{key}: {payload[key]}</p>
                } else {
                    return <></>
                }
            })}
        </>)
    } else if(type === "cfr") {
        return (<>
            {Object.keys(payload).map((key: any) => {
                if(key !== "date" && key !== "type") {
                    return <p>{key}: {payload[key].total * 100}% </p>
                } else {
                    return <></>
                }
            })}
        </>)
    } else if(type === "rt") {
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

const getFooter = (type: string, payloads: Payload[]) => {
    const payload0 = payloads[0]
    const payload = payload0.payload

    if(type === "clt") {
        return (
            <div className="dora-tooltip-footer">
                <span>Commit By: {payload.user}</span>
            </div>
        )
    } else {
        return (<></>)
    }
}

const ToolTip : React.FC<Props> = ({type, active, payload, showExtendedDetail, onClose}: Props) => {
    if(!active || !payload || !payload.length || payload.length === 0) {
        return (<></>)
    }

    const title = getTitle(type, payload)
    const body = getBody(type, payload)
    const footer = getFooter(type, payload)
    const wrapperClassName = showExtendedDetail ? "dora-tooltip-wrapper" : "";

    const close = onClose ? onClose : () => {}

    return (
        <div className={wrapperClassName} onClick={close}>
            <div className="dora-tooltip">
                <div className="dora-tooltip-header">
                    {title}
                </div>
                <div className="dora-tooltip-body">
                    {body}
                </div>
                {footer}
                {showExtendedDetail ?
                    <>
                        <br/>
                        <p style={{margin: "0px"}}>Coming in a future change</p>
                    </>
                :
                    <>
                        <br/>
                        <p style={{margin: "0px"}}>Click node for more info</p>
                    </>
                }
            </div>
        </div>
    )
}

export default ToolTip
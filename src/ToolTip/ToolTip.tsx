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
    const payload0 = payloads[0]
    const payload = payload0.payload

    if(type === "clt") {
        return (<h3><a className="toolTipLink" href={payload.deploy_url} target="_blank">{payload.title}</a></h3>)
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
                if(key !== "date") {
                    const entry = payload[key]

                    return (<>
                        <p>{key}: 
                            {entry.urls.map((url: string, index: number) => {
                                return <a className="toolTipLink" href={url} target="_blank">{index + 1}</a>
                            })}
                        </p>
                    </>)
                } else {
                    return 
                }
            })}
        </>)
    } else if(type === "cfr") {
        return (<>
            {Object.keys(payload).map((key: any) => {
                if(key !== "date") {
                    const entry = payload[key]

                    return (<>
                        <p>{key}: {payload[key].total * 100}%</p>
                        {entry.successes.length > 0 &&
                            <span className="toolTipSpan">Successes: 
                                {entry.successes.map((record: any, index: number) => {
                                    return <a className="toolTipLink" target='_blank' href={record.deploy_url}>{index + 1}</a>
                                })}
                            </span>
                        }
                        {entry.failures.length > 0 && entry.successes.length > 0 &&
                            <br/>
                        }
                        {entry.failures.length > 0 &&
                            <span className="toolTipSpan">Issues: 
                                {entry.failures.map((record: any, index: number) => {
                                    return <a className="toolTipLink" target='_blank' href={record.issue_url ?? record.deploy_url}>{index + 1}</a>
                                })}
                            </span>
                        }
                    </>)
                } else {
                    return (<></>)
                }
            })}
        </>)
    } else if(type === "rt") {
        return (<>
            {Object.keys(payload).map((key: any) => {
                if(key !== "date") {
                    const entry = payload[key]

                    return (<>
                        <p>{key}: {entry.avgTime} hrs</p>
                    </>)
                } else {
                    return (<></>)
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
                {!showExtendedDetail && type !== "rt" &&
                    <>
                        <br/>
                        <p style={{margin: "0px"}}>Click node/bar to access links</p>
                    </>
                }
            </div>
        </div>
    )
}

export default ToolTip
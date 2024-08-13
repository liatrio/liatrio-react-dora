import React from 'react'
import './TooltipContent.css'

export interface Props {
    active?: boolean
    label?: string | number
    payload?: any[]
    showExtendedDetail?: boolean
    type: string,
    onClose?: () => void
}

const getTitle = (type: string, payloads: any[]) => {
    const payload = payloads[0]

    if(type === "clt") {
        return (<h3><a className="toolTipLink" href={payload.deploy_url} target="_blank">{payload.title}</a></h3>)
    } else {
        const date = new Date(payload.date).toISOString().split("T")[0]
        return (<h3>{date}</h3>)
    }
}

const getBody = (type: string, payloads: any[]) => {
    const payload = payloads[0]

    if(type === "clt") {
        return (<>
            <p>Repository: {payload.repository}</p>
            <p>Total Cycle Time: {payload.totalCycle.toFixed(2)} hrs</p>
        </>)
    } else if(type === "df") {
        return (<>
            {Object.keys(payload).map((key: any, tindex: number) => {
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
            {Object.keys(payload).map((key: any, tindex: number) => {
                if(key !== "date") {
                    const entry = payload[key]

                    return (<>
                        <p>{key}: {(payload[key].total * 100).toFixed(2)}%</p>
                        {entry.successes.length > 0 &&
                            <span key={key} className="toolTipSpan">Successes: 
                                {entry.successes.map((record: any, index: number) => {
                                    return <a className="toolTipLink" target='_blank' href={record.deploy_url}>{index + 1}</a>
                                })}
                            </span>
                        }
                        {entry.failures.length > 0 && entry.successes.length > 0 &&
                            <br/>
                        }
                        {entry.failures.length > 0 &&
                            <span key={key} className="toolTipSpan">Issues: 
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

const getFooter = (type: string, payloads: any[]) => {
    const payload = payloads[0]

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

const TooltipContent : React.FC<Props> = ({type, payload}: Props) => {
    if(!payload || !payload.length || payload.length === 0) {
        return (<></>)
    }

    const title = getTitle(type, payload)
    const body = getBody(type, payload)
    const footer = getFooter(type, payload)

    return (
        <>
            <div className="dora-tooltip-header">
                {title}
            </div>
            <div className="dora-tooltip-body">
                {body}
            </div>
            {footer}
        </>
    )
}

export default TooltipContent
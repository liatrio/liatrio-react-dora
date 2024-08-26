import React, { useEffect, useState } from 'react'
import './TooltipContent.css'
import {v4 as uuidv4} from 'uuid'
import { changeFailureRateName, changeLeadTimeName, deploymentFrequencyName, recoverTimeName } from '../constants'

export interface Props {
  active?: boolean
  label?: string | number
  payload?: any[]
  showExtendedDetail?: boolean
  type: string
  repository: string
  onClose?: () => void
}

const getTitle = (type: string, payloads: any[]) => {
  const payload = payloads[0]

  if(type === changeLeadTimeName) {
    return (<h3 key={uuidv4()}><a key={uuidv4()} className="toolTipLink" href={payload.deploy_url} target="_blank">{payload.title}</a></h3>)
  } else {
    const date = new Date(payload.date).toISOString().split("T")[0]
    return (<h3 key={uuidv4()}>{date}</h3>)
  }
}

const getBody = (repository: string, type: string, payloads: any[]) => {
  const payload = payloads[0]
  const repoData = payload[repository]
  
  if(type === changeLeadTimeName) {
    let displayValue = ""

    switch(payload.cycleLabel) {
      case 'hrs':
        displayValue = payload.totalCycleHrs.toFixed(2)
        break
      case 'mins':
        displayValue = payload.totalCycleMins.toFixed(2)
        break
      case 'days':
        displayValue = payload.totalCycleDays.toFixed(2)
        break
    }

    return (<>
      <p key={uuidv4()}>Repository: {payload.repository}</p>
      <p key={uuidv4()}>Total Cycle Time: {displayValue} {payload.cycleLabel}</p>
    </>)
  } else if(type === deploymentFrequencyName) {
    const urls = repoData.urls.slice(0, 5)
    const dots = repoData.urls.length > 5 ? '...' : ''

    return (<>
      <p key={uuidv4()}>{repository}: 
        {urls.map((url: string, index: number) => {
          return <a key={uuidv4()} className="toolTipLink" href={url} target="_blank">{index + 1}</a>
        })}{dots}
      </p>
    </>)
  } else if(type === changeFailureRateName) {
    const successUrls = repoData.successes.slice(0, 5)
    const successDots = repoData.successes.length > 5 ? '...' : ''
    const failureUrls = repoData.failures.slice(0, 5)
    const failureDots = repoData.failures.length > 5 ? '...' : ''

    return (<>
      <p key={uuidv4()}>{repository}: {(repoData.total * 100).toFixed(2)}%</p>
      {repoData.successes.length > 0 &&
        <span key={uuidv4()} className="toolTipSpan">Successes: 
          {successUrls.map((record: any, index: number) => {
            return <a key={uuidv4()} className="toolTipLink" target='_blank' href={record.deploy_url}>{index + 1}</a>
          })}{successDots}
        </span>
      }
      {repoData.failures.length > 0 && repoData.successes.length > 0 &&
        <br key={uuidv4()}/>
      }
      {repoData.failures.length > 0 &&
        <span key={uuidv4()} className="toolTipSpan">Issues: 
          {failureUrls.map((record: any, index: number) => {
            return <a key={uuidv4()} className="toolTipLink" target='_blank' href={record.issue_url ?? record.deploy_url}>{index + 1}</a>
          })}{failureDots}
        </span>
      }
    </>)
  } else if(type === recoverTimeName) {
    let displayValue = ""

    switch(repoData.avgLabel.trim()) {
      case 'hrs':
        displayValue = repoData.avgTime.toFixed(2)
        break
      case 'mins':
        displayValue = repoData.avgTimeMins.toFixed(2)
        break
      case 'days':
        displayValue = repoData.avgTimeDays.toFixed(2)
        break

    }

    return (<>
      <p key={uuidv4()}>{repository}: {displayValue} {repoData.avgLabel}</p>
    </>)
  }
}

const getFooter = (type: string, payloads: any[]) => {
  const payload = payloads[0]

  if(type === changeLeadTimeName) {
    return (
      <div key={uuidv4()} className="dora-tooltip-footer">
        <span key={uuidv4()}>Commit By: {payload.user}</span>
      </div>
    )
  } else {
    return (<></>)
  }
}

const TooltipContent : React.FC<Props> = ({repository, type, payload}: Props) => {
  if(!payload || !payload.length || payload.length === 0) {
    return (<></>)
  }

  const [body, setBody] = useState<any>()
  const [title, setTitle] = useState<any>()
  const [footer, setFooter] = useState<any>()

  useEffect(() => {
    const titleContent = getTitle(type, payload)
    const bodyContent = getBody(repository, type, payload)
    const footerContent = getFooter(type, payload)

    setBody(bodyContent)
    setFooter(footerContent)
    setTitle(titleContent)
  }, [repository, type, payload])

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
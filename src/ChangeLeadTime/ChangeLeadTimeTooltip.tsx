import React from 'react'
import { ChangeLeadTimeTooltipProps } from "./ChangeLeadTime.types"
import './ChangeLeadTimeTooltip.css'

const ChangeLeadTimeTooltip : React.FC<ChangeLeadTimeTooltipProps> = ({active, payload}: ChangeLeadTimeTooltipProps) => {
  if(!active || !payload || !payload.length) {
      return (<></>)
  }

  return (
    <div className="clt-tooltip">
        <div className="clt-tooltip-header">
            <h3>{payload[0].payload.title}</h3>
        </div>
        <div className="clt-tooltip-body">
            <p>{payload[0].payload.repository}</p>
            <p>Total Cycle Time: {payload[0].payload.totalCycle} hours</p>
            <hr />
            <p>Time in PR: {payload[0].payload.timeInPR} hours</p>
            <p>Time in Test: {payload[0].payload.timeInTest} hours</p>
        </div>
        <div className="clt-tooltip-footer">
            <span>Commit By: {payload[0].payload.user}</span>
        </div>
    </div>
  )
}

export default ChangeLeadTimeTooltip;
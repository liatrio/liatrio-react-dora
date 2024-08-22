import React, { ReactNode, Dispatch, SetStateAction } from 'react'
import { DoraMetric } from '../interfaces/metricInterfaces'
import IconRim from './Rim'
import { purple } from '../constants'

interface Props {
  metric: DoraMetric
  metricTitle: string
  children: ReactNode
  setTooltipContent: Dispatch<SetStateAction<string>>
  showColors?: boolean
  alwaysShowDetails?: boolean
}

const ScoreIcon : React.FC<Props> = (props: Props) => {
  const childrenWithOverriddenProps = React.Children.map(props.children, (child: any) => {
    return React.cloneElement(child, { scale: 1.0 });
  });

  return (
    <div className="score_container">
      <div className="icon_container" data-tooltip-id="scoreTooltip" onMouseOver={() => props.setTooltipContent(`${props.metricTitle}: ${props.metric.display}`)}>
        <IconRim color={props.showColors ? props.metric.color : purple}>
          {childrenWithOverriddenProps}
        </IconRim>
      </div>
      {props.alwaysShowDetails &&
        <div className="detail-content"><span>{props.metricTitle}:<br/>{props.metric.display}</span></div>
      }
    </div>
  )
}

export default ScoreIcon

import React, { useEffect, useState } from 'react'
import './Board.css'
import { Tooltip } from 'react-tooltip'
import DeployFrequencyIcon from '../icons/DeploymentFrequency'
import IconRim from '../icons/Rim'
import ChangeLeadTimeIcon from '../icons/ChangeLeadTime'
import ChangeFailureRateIcon from '../icons/ChangeFailureRate'
import RecoverTimeIcon from '../icons/RecoverTime'
import { BoardProps } from '../interfaces/propInterfaces'
import { DoraState } from '../interfaces/metricInterfaces'
import { boardName, defaultDoraState } from '../constants'
import { buildDoraState } from '../functions/metricFunctions'
import { buildNonGraphBody } from '../functions/chartFunctions'

const Board : React.FC<BoardProps> = (props) => {
  const [state, setState] = useState<DoraState>({...defaultDoraState})
  const [noData, setNoData] = useState<boolean>(false)
  const [tooltipContent, setTooltipContent] = useState<any>(true)

  useEffect(() => {
    if(!props.data || props.data.length === 0) {
        setNoData(true)
        return
    }

    setNoData(false)

    const state = buildDoraState(props, props.data)

    setState(state)
  }, [props.data, props.graphEnd, props.graphStart, props.includeWeekendsInCalculations, props.holidays, props.metricThresholdSet])

  const nonGraphBody = buildNonGraphBody(props, noData, boardName)

  if(nonGraphBody) {
      return nonGraphBody
  }

  return (
    <div data-testid={boardName} className="board">
        <div className="score_container">
          <div className="icon_container" data-tooltip-id="scoreTooltip" onMouseOver={() => setTooltipContent(`Deployment Frequency: ${state.deploymentFrequency.display}`)}>
            <IconRim hexColor={state.deploymentFrequency.color}>
              <DeployFrequencyIcon hexColor="#FFFFFF"/>
            </IconRim>
          </div>
          {props.alwaysShowDetails &&
            <div className="detail-content"><span>Deployment Frequency:<br/>{state.deploymentFrequency.display}</span></div>
          }
        </div>
        <div className="score_container">
          <div className="icon_container" data-tooltip-id="scoreTooltip" onMouseOver={() => setTooltipContent(`Change Lead Time: ${state.changeLeadTime.display}`)}>
            <IconRim hexColor={state.changeLeadTime.color}>
              <ChangeLeadTimeIcon hexColor="#FFFFFF"/>
            </IconRim>
          </div>
          {props.alwaysShowDetails &&
            <div className="detail-content"><span>Change Lead Time:<br/>{state.changeLeadTime.display}</span></div>
          }
        </div>
        <div className="score_container">
          <div className="icon_container" data-tooltip-id="scoreTooltip" onMouseOver={() => setTooltipContent(`Change Failure Rate: ${state.changeFailureRate.display}`)}>
            <IconRim hexColor={state.changeFailureRate.color}>
              <ChangeFailureRateIcon hexColor="#FFFFFF"/>
            </IconRim>
          </div>
          {props.alwaysShowDetails &&
            <div className="detail-content"><span>Change Failure Rate:<br/>{state.changeFailureRate.display}</span></div>
          }
        </div>
        <div className="score_container">
          <div className="icon_container" data-tooltip-id="scoreTooltip" onMouseOver={() => setTooltipContent(`Recovery Time: ${state.recoverTime.display}`)}>
            <IconRim hexColor={state.recoverTime.color}>
              <RecoverTimeIcon hexColor="#FFFFFF"/>
            </IconRim>
          </div>
          {props.alwaysShowDetails &&
            <div className="detail-content"><span>Recovery Time:<br/>{state.recoverTime.display}</span></div>
          }
        </div>
        {!props.alwaysShowDetails &&
          <Tooltip className='scoreTooltip' id="scoreTooltip"  border="1px solid white" opacity="1" content={tooltipContent}/>
        }
    </div>
  )
}

export default Board

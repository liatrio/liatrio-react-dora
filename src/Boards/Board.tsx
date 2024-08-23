import React, { useEffect, useState } from 'react'
import './Board.css'
import { Tooltip } from 'react-tooltip'
import DeployFrequencyIcon from '../icons/DeploymentFrequency'
import ChangeLeadTimeIcon from '../icons/ChangeLeadTime'
import ChangeFailureRateIcon from '../icons/ChangeFailureRate'
import RecoverTimeIcon from '../icons/RecoverTime'
import { BoardProps } from '../interfaces/propInterfaces'
import { DoraState } from '../interfaces/metricInterfaces'
import { boardName, defaultDoraState } from '../constants'
import { buildDoraState } from '../functions/metricFunctions'
import { buildNonGraphBody } from '../functions/chartFunctions'
import ScoreIcon from '../icons/Score'
import TrendIcon from '../icons/Trend'

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

  if(props.showTrends) {
    return (
      <div data-testid={boardName} className="board">
        <TrendIcon metric={state.deploymentFrequency} metricTitle={"Deployment Frequency"} alwaysShowDetails={props.alwaysShowDetails} setTooltipContent={setTooltipContent}>
          <DeployFrequencyIcon color="#FFFFFF"/>
        </TrendIcon>
        <TrendIcon metric={state.changeLeadTime} metricTitle={"Change Lead Time"} alwaysShowDetails={props.alwaysShowDetails} setTooltipContent={setTooltipContent}>
          <ChangeLeadTimeIcon color="#FFFFFF"/>
        </TrendIcon>
        <TrendIcon metric={state.changeFailureRate} metricTitle={"Change Failure Rate"} alwaysShowDetails={props.alwaysShowDetails} setTooltipContent={setTooltipContent}>
          <ChangeFailureRateIcon color="#FFFFFF"/>
        </TrendIcon>
        <TrendIcon metric={state.recoverTime} metricTitle={"Recover Time"} alwaysShowDetails={props.alwaysShowDetails} setTooltipContent={setTooltipContent}>
          <RecoverTimeIcon color="#FFFFFF"/>
        </TrendIcon>
        {!props.alwaysShowDetails &&
          <Tooltip className='scoreTooltip' id="scoreTooltip"  border="1px solid white" opacity="1" content={tooltipContent}/>
        }
      </div>
    )
  } else {
    return (
      <div data-testid={boardName} className="board">
        <ScoreIcon metric={state.deploymentFrequency} metricTitle={"Deployment Frequency"} alwaysShowDetails={props.alwaysShowDetails} hideColors={props.hideColors} setTooltipContent={setTooltipContent}>
          <DeployFrequencyIcon color="#FFFFFF"/>
        </ScoreIcon>
        <ScoreIcon metric={state.changeLeadTime} metricTitle={"Change Lead Time"} alwaysShowDetails={props.alwaysShowDetails} hideColors={props.hideColors} setTooltipContent={setTooltipContent}>
          <ChangeLeadTimeIcon color="#FFFFFF"/>
        </ScoreIcon>
        <ScoreIcon metric={state.changeFailureRate} metricTitle={"Change Failure Rate"} alwaysShowDetails={props.alwaysShowDetails} hideColors={props.hideColors} setTooltipContent={setTooltipContent}>
          <ChangeFailureRateIcon color="#FFFFFF"/>
        </ScoreIcon>
        <ScoreIcon metric={state.recoverTime} metricTitle={"Recover Time"} alwaysShowDetails={props.alwaysShowDetails} hideColors={props.hideColors} setTooltipContent={setTooltipContent}>
          <RecoverTimeIcon color="#FFFFFF"/>
        </ScoreIcon>
        {!props.alwaysShowDetails &&
          <Tooltip className='scoreTooltip' id="scoreTooltip"  border="1px solid white" opacity="1" content={tooltipContent}/>
        }
      </div>
    )
  }
}

export default Board

import React, { useEffect, useState } from 'react'
import Loading from '../Loading/Loading'
import './Board.css'
import noDataImg from '../assets/no_data.png'
import { Tooltip } from 'react-tooltip'
import DeployFrequencyIcon from '../icons/DeploymentFrequency'
import IconRim from '../icons/Rim'
import ChangeLeadTimeIcon from '../icons/ChangeLeadTime'
import ChangeFailureRateIcon from '../icons/ChangeFailureRate'
import RecoverTimeIcon from '../icons/RecoverTime'
import { BoardProps } from '../interfaces/propInterfaces'
import { DoraState } from '../interfaces/metricInterfaces'
import { defaultDoraState } from '../constants'
import { DoraRecord } from '../interfaces/apiInterfaces'
import { buildDoraState } from '../functions/metricFunctions'
import { fetchData } from '../functions/fetchFunctions'

const Board : React.FC<BoardProps> = (props) => {
  const [state, setState] = useState<DoraState>({...defaultDoraState})

  const [data, setData] = useState<DoraRecord[]>([])
  const [noData, setNoData] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [tooltipContent, setTooltipContent] = useState<any>(true)

  const organizeData = (data: DoraRecord[]) => {
    if(data.length === 0) {
        setNoData(true)
    }

    setData(data)

    const state = buildDoraState(props, data)

    setState(state)

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    fetchData(props, organizeData)
  }, [props])

  if (props.message) {
    return (
      <div data-testid="Board" style={{ width: "100%", height: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <span style={{color: "white"}}>{props.message}</span>
      </div>
    )
  } else  if(loading || props.loading) {
      return (
          <div data-testid="Board" style={{width: "100%", height: "100%", paddingTop: "10px", paddingBottom: "100px"}}>
              <Loading enabled={loading || (props.loading ?? false)} />
          </div>
      )
  } else if(noData) {
      return ( 
        <div data-testid="Board" style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <img alt="No Data" title="No Data" src={noDataImg} style={{width: "150px", padding: "10px"}}/>
        </div>
      )
  }

  return (
    <div data-testid="Board" className="board">
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

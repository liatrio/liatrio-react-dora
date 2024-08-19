import React, { useEffect, useState } from 'react'
import { DoraRecord, ChartProps, fetchData, calculateScores, calculateDoraRanks, convertRankToColor, getScoreDisplay } from '../Helpers'
import Loading from '../Loading/Loading'
import './ScoreBoard.css'
import surroundIcon from '../assets/change_dark.svg'
import dfIcon from '../assets/deploy_dark.svg'
import cltIcon from '../assets/lead_time_dark.svg'
import cfrIcon from '../assets/failure_dark.svg'
import rtIcon from '../assets/recover_dark.svg'
import noDataImg from '../assets/no_data.png'
import { Tooltip } from 'react-tooltip'

interface ScoreBoardState {
  DFColor: string,
  CFRColor: string,
  CLTColor: string,
  RTColor: string,
  RTScore: number,
  DFScore: number,
  CFRScore: number,
  CLTScore: number,
  DFDisplay: string,
  RTDisplay: string,
  CFRDisplay: string,
  CLTDisplay: string
}

const ScoreBoard : React.FC<ChartProps> = (props: ChartProps) => {
  const [state, setState] = useState<ScoreBoardState>({
    DFColor: convertRankToColor(10),
    CLTColor: convertRankToColor(10),
    CFRColor: convertRankToColor(10),
    RTColor: convertRankToColor(10),
    DFScore: NaN,
    CLTScore: NaN,
    CFRScore: NaN,
    RTScore: NaN,
    DFDisplay: '?',
    RTDisplay: '?',
    CFRDisplay: '?',
    CLTDisplay: '?',
  })

  const [data, setData] = useState<DoraRecord[]>([])
  const [noData, setNoData] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [tooltipContent, setTooltipContent] = useState<any>(true)

  const organizeData = (data: DoraRecord[]) => {
    if(data.length === 0) {
        setNoData(true)
    }

    setData(data)

    const scores = calculateScores(props, data)
    const ranks = calculateDoraRanks(props, scores)

    setState({
      DFScore: scores.df,
      CFRScore: scores.cfr,
      CLTScore: scores.clt,
      RTScore: scores.rt,
      DFColor: convertRankToColor(ranks.df),
      CLTColor: convertRankToColor(ranks.clt),
      CFRColor: convertRankToColor(ranks.cfr),
      RTColor: convertRankToColor(ranks.rt),
      DFDisplay: getScoreDisplay(scores.df),
      RTDisplay: getScoreDisplay(scores.rt),
      CFRDisplay: getScoreDisplay(scores.cfr, 'cfr'),
      CLTDisplay: getScoreDisplay(scores.clt),
    })

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    fetchData(props, organizeData)
  }, [props])

  if (props.message) {
    return (
      <div data-testid="RecoverTime" style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <span style={{color: "white"}}>{props.message}</span>
      </div>
    )
  } else  if(loading || props.loading) {
      return (
          <div data-testid="ScoreBoard" style={{width: "100%", height: "100%", paddingTop: "10px", paddingBottom: "100px"}}>
              <Loading enabled={loading || (props.loading ?? false)} />
          </div>
      )
  } else if(noData) {
      return ( 
        <div data-testid="ScoreBoard" style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <img alt="No Data" title="No Data" src={noDataImg} style={{width: "150px", padding: "10px"}}/>
        </div>
      )
  }

  return (
    <div data-testid="ScoreBoard" className="board">
        <div className="score_container">
          <div className="icon_container" data-tooltip-id="scoreTooltip" onMouseOver={() => setTooltipContent(`Deployment Frequency: ${state.DFDisplay}`)}>
            <img className="surround" alt="Deployment Frequency" title="Deployment Frequency" src={surroundIcon} style={{filter: state.DFColor}} />
            <img className="icon" alt="Deployment Frequency" title="Deployment Frequency" src={dfIcon} style={{width: "30%", left: "33px", top: "33px"}}/>
          </div>
          {props.showDetails &&
            <div className="detail-content"><span>Deployment Frequency:<br/>{state.DFDisplay}</span></div>
          }
        </div>
        <div className="score_container">
          <div className="icon_container" data-tooltip-id="scoreTooltip" onMouseOver={() => setTooltipContent(`Change Lead Time: ${state.CLTDisplay}`)}>
            <img className="surround" alt="Change Lead Time" title="Change Lead Time" src={surroundIcon} style={{filter: state.CLTColor}} />
            <img className="icon" alt="Change Lead Time" title="Change Lead Time" src={cltIcon} style={{left: "31px", top: "32px"}}/>
          </div>
          {props.showDetails &&
            <div className="detail-content"><span>Change Lead Time:<br/>{state.CLTDisplay}</span></div>
          }
        </div>
        <div className="score_container">
          <div className="icon_container" data-tooltip-id="scoreTooltip" onMouseOver={() => setTooltipContent(`Change Failure Rate: ${state.CFRDisplay}`)}>
            <img className="surround" alt="Change Failure Rate" title="Change Failure Rate" src={surroundIcon} style={{filter: state.CFRColor}} />
            <img className="icon" alt="Change Failure Rate" title="Change Failure Rate" src={cfrIcon} style={{left: "34px", top: "32px"}}/>
          </div>
          {props.showDetails &&
            <div className="detail-content"><span>Change Failure Rate:<br/>{state.CFRDisplay}</span></div>
          }
        </div>
        <div className="score_container">
          <div className="icon_container" data-tooltip-id="scoreTooltip" onMouseOver={() => setTooltipContent(`Recovery Time: ${state.RTDisplay}`)}>
            <img className="surround" alt="Recovery Rate" title="Recovery Rate" src={surroundIcon} style={{filter: state.RTColor}} />
            <img className="icon" alt="Recovery Rate" title="Recovery Rate" src={rtIcon} style={{left: "33px", top: "34px"}}/>
          </div>
          {props.showDetails &&
            <div className="detail-content"><span>Recovery Time:<br/>{state.RTDisplay}</span></div>
          }
        </div>
        {!props.showDetails &&
          <Tooltip className='scoreTooltip' id="scoreTooltip"  border="1px solid white" opacity="1" content={tooltipContent}/>
        }
    </div>
  )
}

export default ScoreBoard

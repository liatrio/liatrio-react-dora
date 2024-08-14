import React, { useEffect, useState } from 'react'
import { Popover, ArrowContainer } from "react-tiny-popover"
import { Record, Props, fetchData, calculateScores, unknownFilter, MaxDF, calculateScoreColors } from '../Helpers'
import Loading from '../Loading/Loading'
import './ScoreBoard.css'
import surroundIcon from '../assets/change_dark.svg'
import dfIcon from '../assets/deploy_dark.svg'
import cltIcon from '../assets/lead_time_dark.svg'
import cfrIcon from '../assets/failure_dark.svg'
import rtIcon from '../assets/recover_dark.svg'
import noDataImg from '../assets/no_data.png'

interface ScoreBoardState {
  DFColor: string,
  CFRColor: string,
  CLTColor: string,
  RTColor: string,
  RTRate: number,
  DFRate: number,
  CFRRate: number,
  CLTRate: number,
}

const ScoreBoard : React.FC<Props> = (props: Props) => {
  const [state, setState] = useState<ScoreBoardState>({
    DFColor: unknownFilter,
    CLTColor: unknownFilter,
    CFRColor: unknownFilter,
    RTColor: unknownFilter,
    DFRate: 0,
    CLTRate: 0,
    CFRRate: 0,
    RTRate: 0,
  })

  const [data, setData] = useState<Record[]>([])
  const [noData, setNoData] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  
  const [showDFPO, setShowDFPO] = useState(false)
  const [showRTPO, setShowRTPO] = useState(false)
  const [showCFRPO, setShowCFRPO] = useState(false)
  const [showCLTPO, setShowCLTPO] = useState(false)

  const organizeData = (data: Record[]) => {
    if(data.length === 0) {
        setNoData(true)
    }

    setData(data)

    const scores = calculateScores(props, data)
    const colors = calculateScoreColors(props, scores)

    setState({
      DFRate: scores.df,
      CFRRate: scores.cfr,
      CLTRate: scores.clt,
      RTRate: scores.rt,
      DFColor: colors.df,
      CLTColor: colors.clt,
      CFRColor: colors.cfr,
      RTColor: colors.rt
    })

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    fetchData(props, organizeData)
  }, [props])

  if(loading || props.loading) {
      return (
          <div data-testid="ScoreBoard" style={{width: "100%", height: "100%", paddingTop: "10px", paddingBottom: "100px"}}>
              <Loading enabled={loading || (props.loading ?? false)} />
          </div>
      )
  }

  if(noData) {
      return ( 
        <div data-testid="ScoreBoard" style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <img alt="No Data" title="No Data" src={noDataImg} style={{width: "150px", padding: "10px"}}/>
        </div>
      )
  }

  if(!props.showDetails) {
    return (
      <div data-testid="ScoreBoard" className="board">
        <Popover
          isOpen={showDFPO}
          positions={["top", "bottom", "left", "right"]}
          align="start"
          padding={8}
          onClickOutside={() => setShowDFPO(false)}
          content={({ position, childRect, popoverRect }) => (
            <ArrowContainer
              position={position}
              childRect={childRect}
              popoverRect={popoverRect}
              arrowColor={"#494949"}
              arrowSize={8}
            >
              <div>
                <div className="popover-content"><span >Average Deployment Frequency: {state.DFRate === MaxDF ? "Unknown" : state.DFRate.toFixed(2)} hrs</span></div>
              </div>
            </ArrowContainer>
          )}
        >
          <div className="icon_container" onClick={() => setShowDFPO(!showDFPO)}>
            <img className="surround" alt="Deployment Frequency" title="Deployment Frequency" src={surroundIcon} style={{filter: state.DFColor}} />
            <img className="icon" alt="Deployment Frequency" title="Deployment Frequency" src={dfIcon} style={{width: "30%", left: "33px", top: "33px"}}/>
          </div>
        </Popover>
        <Popover
          isOpen={showCLTPO}
          positions={["top", "bottom", "left", "right"]}
          align="start"
          padding={8}
          onClickOutside={() => setShowCLTPO(false)}
          content={({ position, childRect, popoverRect }) => (
            <ArrowContainer
              position={position}
              childRect={childRect}
              popoverRect={popoverRect}
              arrowColor={"#494949"}
              arrowSize={8}
            >
              <div>
                <div className="popover-content"><span >Average Change Lead Time: {state.CLTRate.toFixed(2)} hrs</span></div>
              </div>
            </ArrowContainer>
          )}
        >
          <div className="icon_container" onClick={() => setShowCLTPO(!showCLTPO)}>
            <img className="surround" alt="Change Lead Time" title="Change Lead Time" src={surroundIcon} style={{filter: state.CLTColor}} />
            <img className="icon" alt="Change Lead Time" title="Change Lead Time" src={cltIcon} style={{left: "31px", top: "32px"}}/>
          </div>
        </Popover>
        <Popover
          isOpen={showCFRPO}
          positions={["top", "bottom", "left", "right"]}
          align="start"
          padding={8}
          onClickOutside={() => setShowCFRPO(false)}
          content={({ position, childRect, popoverRect }) => (
            <ArrowContainer
              position={position}
              childRect={childRect}
              popoverRect={popoverRect}
              arrowColor={"#494949"}
              arrowSize={8}
            >
              <div>
                <div className="popover-content"><span >Average Change Failure Rate: {(state.CFRRate * 100).toFixed(2)}%</span></div>
              </div>
            </ArrowContainer>
          )}
        >
          <div className="icon_container" onClick={() => setShowCFRPO(!showCFRPO)}>
            <img className="surround" alt="Change Failure Rate" title="Change Failure Rate" src={surroundIcon} style={{filter: state.CFRColor}} />
            <img className="icon" alt="Change Failure Rate" title="Change Failure Rate" src={cfrIcon} style={{left: "34px", top: "32px"}}/>
          </div>
        </Popover>
        <Popover
          isOpen={showRTPO}
          positions={["top", "bottom", "left", "right"]}
          align="start"
          padding={8}
          onClickOutside={() => setShowRTPO(false)}
          content={({ position, childRect, popoverRect }) => (
            <ArrowContainer
              position={position}
              childRect={childRect}
              popoverRect={popoverRect}
              arrowColor={"#494949"}
              arrowSize={8}
            >
              <div>
                <div className="popover-content"><span >Average Recovery Time: {state.RTRate.toFixed(2)} hrs</span></div>
              </div>
            </ArrowContainer>
          )}
        >
          <div className="icon_container" onClick={() => setShowRTPO(!showRTPO)}>
            <img className="surround" alt="Recovery Rate" title="Recovery Rate" src={surroundIcon} style={{filter: state.RTColor}} />
            <img className="icon" alt="Recovery Rate" title="Recovery Rate" src={rtIcon} style={{left: "33px", top: "34px"}}/>
          </div>
        </Popover>
      </div>
    )
  }

  return (
    <div data-testid="ScoreBoard" className="board">
        <div className="score_container">
          <div className="icon_container" onClick={() => setShowDFPO(!showDFPO)}>
            <img className="surround" alt="Deployment Frequency" title="Deployment Frequency" src={surroundIcon} style={{filter: state.DFColor}} />
            <img className="icon" alt="Deployment Frequency" title="Deployment Frequency" src={dfIcon} style={{width: "30%", left: "33px", top: "33px"}}/>
          </div>
          <div className="detail-content"><span>Deployment Frequency:<br/>{state.DFRate === MaxDF ? "Unknown" : state.DFRate.toFixed(2)} hrs</span></div>
        </div>
        <div className="score_container">
          <div className="icon_container" onClick={() => setShowCLTPO(!showCLTPO)}>
            <img className="surround" alt="Change Lead Time" title="Change Lead Time" src={surroundIcon} style={{filter: state.CLTColor}} />
            <img className="icon" alt="Change Lead Time" title="Change Lead Time" src={cltIcon} style={{left: "31px", top: "32px"}}/>
          </div>
          <div className="detail-content"><span >Change Lead Time:<br/>{state.CLTRate.toFixed(2)} hrs</span></div>
        </div>
        <div className="score_container">
          <div className="icon_container" onClick={() => setShowCFRPO(!showCFRPO)}>
            <img className="surround" alt="Change Failure Rate" title="Change Failure Rate" src={surroundIcon} style={{filter: state.CFRColor}} />
            <img className="icon" alt="Change Failure Rate" title="Change Failure Rate" src={cfrIcon} style={{left: "34px", top: "32px"}}/>
          </div>
          <div className="detail-content"><span >Change Failure Rate:<br/>{(state.CFRRate * 100).toFixed(2)}%</span></div>
        </div>
        <div className="score_container">
          <div className="icon_container" onClick={() => setShowRTPO(!showRTPO)}>
            <img className="surround" alt="Recovery Rate" title="Recovery Rate" src={surroundIcon} style={{filter: state.RTColor}} />
            <img className="icon" alt="Recovery Rate" title="Recovery Rate" src={rtIcon} style={{left: "33px", top: "34px"}}/>
          </div>
          <div className="detail-content"><span >Recovery Time:<br/>{state.RTRate.toFixed(2)} hrs</span></div>
        </div>
    </div>
  )
}

export default ScoreBoard

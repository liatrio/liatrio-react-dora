import React, { useEffect, useState } from 'react'
import { Popover, ArrowContainer } from "react-tiny-popover";
import { Record, Props, fetchData } from '../Helpers'
import './ScoreBoard.css'
import surroundIcon from '../assets/change_dark.svg'
import dfIcon from '../assets/deploy_dark.svg'
import cltIcon from '../assets/lead_time_dark.svg'
import cfrIcon from '../assets/failure_dark.svg'
import rtIcon from '../assets/recover_dark.svg'

const redFilter = "brightness(0) saturate(100%) invert(36%) sepia(86%) saturate(7496%) hue-rotate(356deg) brightness(101%) contrast(102%)"
const greenFilter = "brightness(0) saturate(100%) invert(60%) sepia(75%) saturate(4083%) hue-rotate(73deg) brightness(92%) contrast(92%)"
const yellowFilter = "brightness(0) saturate(100%) invert(93%) sepia(74%) saturate(3024%) hue-rotate(1deg) brightness(102%) contrast(102%)"
const orangeFilter = "brightness(0) saturate(100%) invert(45%) sepia(250%) saturate(500%) hue-rotate(-15deg) brightness(100%) contrast(120%)"

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

const getTimeFrame = (props: Props) : number => {
  let end = props.end
  let start = props.start

  if(!end) {
    end = new Date()
  }

  if(!start) {
    start = new Date()
    start.setDate(end.getDate() - 30)
  }

  return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
}

const calculateCFRRate = (data: Record[]) : number => {
  const totalSuccessfulRecords = data.filter(f => f.status === true).length
  const totalFailedRecords = data.filter(f => f.status === false).length

  return totalFailedRecords / totalSuccessfulRecords
}

const calculatCFRColor = (rate: number) : string => {
  if(rate === 0) {
    return greenFilter
  } else if(rate <= 33.33) {
    return yellowFilter
  } else if(rate <= 66.66) {
    return orangeFilter
  } else {
    return redFilter
  }
}

const calculateCLTRate = (data: Record[]) : number => {
  let totalSuccessfulRecords = 1
  let totalLeadTime = 0

  data.forEach(record => {
    if(record.status === false) {
      return
    }

    totalSuccessfulRecords++
    totalLeadTime += record.totalCycle * 60
  })

  return totalLeadTime / totalSuccessfulRecords
}

const calculateCLTColor = (rate: number) : string => {
  if(rate < 60) {
    return greenFilter
  } else if(rate < 60 * 24) {
    return yellowFilter
  } else if(rate < 60 * 24 * 7) {
    return orangeFilter
  } else {
    return redFilter
  }
}

const calculateDFRate = (timeFrame: number, data: Record[]) : number => {
  const totalSuccessfulRecords = data.filter(f => f.status === true).length

  return totalSuccessfulRecords / timeFrame
}

const calculateDFColor = (rate: number) : string => {
  if(rate === 0) {
    return redFilter
  } else if(rate <= 0.25) {
    return orangeFilter
  } else if(rate <= 1) {
    return yellowFilter
  } else {
    return greenFilter
  }
}

const calculateRTRate = (data: Record[]) : number => {
  let totalFailedRecords = 1
  let totalRecoveryTime = 0

  data.forEach(record => {
    if(record.status === true) {
      return
    }

    totalFailedRecords++
    totalRecoveryTime += record.recoverTime * 60
  })

  return totalRecoveryTime / totalFailedRecords
}

const calculateRTColor = (rate: number) : string => {
  if(rate < 60 ) {
    return greenFilter
  } else if(rate < 60 * 24) {
    return yellowFilter
  } else if(rate < 60 * 24 * 7) {
    return orangeFilter
  } else {
    return redFilter
  }
}

const ScoreBoard : React.FC<Props> = (props: Props) => {
  const [state, setState] = useState<ScoreBoardState>({
    DFColor: redFilter,
    CLTColor: redFilter,
    CFRColor: redFilter,
    RTColor: redFilter,
    DFRate: 0,
    CLTRate: 0,
    CFRRate: 0,
    RTRate: 0,
  })
  
  const [showDFPO, setShowDFPO] = useState(false);
  const [showRTPO, setShowRTPO] = useState(false);
  const [showCFRPO, setShowCFRPO] = useState(false);
  const [showCLTPO, setShowCLTPO] = useState(false);

  const organizeData = (data: Record[]) => {
    const timeFrame = getTimeFrame(props)

    const dfRate = calculateDFRate(timeFrame, data)
    const cltRate = calculateCLTRate(data)
    const cfrRate = calculateCFRRate(data)
    const rtRate = calculateRTRate(data)

    setState({
      DFRate: dfRate,
      CFRRate: cfrRate,
      CLTRate: cltRate,
      RTRate: rtRate,
      DFColor: calculateDFColor(dfRate),
      CLTColor: calculateCLTColor(cltRate),
      CFRColor: calculatCFRColor(cfrRate),
      RTColor: calculateRTColor(rtRate)
    })
  }

  useEffect(() => {
    fetchData(props, organizeData)
  }, [props])

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
              <div className="popover-content"><span >Average Deployment Frequency: {state.DFRate} hrs</span></div>
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
              <div className="popover-content"><span >Average Change Lead Time: {(state.CLTRate / 60).toFixed(2)} hrs</span></div>
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
              <div className="popover-content"><span >Average Change Failure Rate: {state.CFRRate}%</span></div>
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
              <div className="popover-content"><span >Average Recovery Time: {state.RTRate / 60} hrs</span></div>
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

export default ScoreBoard

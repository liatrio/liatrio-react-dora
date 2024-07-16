import React, { useEffect, useState } from 'react'
import { Popover, ArrowContainer } from "react-tiny-popover"
import { Record, Props, fetchData } from '../Helpers'
import Loading from '../Loading/Loading'
import './ScoreBoard.css'
import surroundIcon from '../assets/change_dark.svg'
import dfIcon from '../assets/deploy_dark.svg'
import cltIcon from '../assets/lead_time_dark.svg'
import cfrIcon from '../assets/failure_dark.svg'
import rtIcon from '../assets/recover_dark.svg'
import noData from '../assets/no_data.png'

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

const calculateCFRRate = (data: Record[]) : number => {
  const totalSuccessfulRecords = data.filter(f => f.status === true && !f.failed_at).length
  const totalFailedRecords = data.filter(f => f.status === false || (f.status === true && f.failed_at)).length

  return totalFailedRecords / (totalSuccessfulRecords === 0 ? 1 : totalSuccessfulRecords)
}

const calculatCFRColor = (rate: number) : string => {
  if(rate < 15) {
    return greenFilter
  } else if(rate <= 30) {
    return yellowFilter
  } else if(rate <= 45) {
    return orangeFilter
  } else {
    return redFilter
  }
}

const calculateCLTRate = (data: Record[]) : number => {
  let totalSuccessfulRecords = 0
  let totalLeadTime = 0

  data.forEach(record => {
    if(record.totalCycle === undefined) {
      return
    }

    totalSuccessfulRecords++
    totalLeadTime += record.totalCycle
  })

  return totalLeadTime / (totalSuccessfulRecords === 0 ? 1 : totalSuccessfulRecords)
}

const calculateCLTColor = (rate: number) : string => {
  if(rate < 24) {
    return greenFilter
  } else if(rate < 24 * 7) {
    return yellowFilter
  } else if(rate < 24 * 7 * 4.33) {
    return orangeFilter
  } else {
    return redFilter
  }
}

const MaxDF = 1000000

const calculateDFRate = (props: Props, data: Record[]) : number => {
  let sorted = data
    .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
  
  if(sorted.length === 0) {
    return MaxDF
  }

  let totalDeployTime = 0

  for(let index = 1; index < sorted.length; index++) {
    let diff = sorted[index].created_at.getTime() - sorted[index - 1].created_at.getTime()
    totalDeployTime += diff
  }
  
  let avgDeployTime = (totalDeployTime / sorted.length) / (1000 * 60 * 60)
  
  return avgDeployTime
}

const calculateDFColor = (rate: number) : string => {
  if(rate < 12) {
    return greenFilter
  } else if(rate < 24 * 7) {
    return yellowFilter
  } else if(rate < 24 * 7 * 4.33) {
    return yellowFilter
  } else {
    return redFilter
  }
}

const calculateRTRate = (data: Record[]) : number => {
  let totalFailedRecords = 0
  let totalRecoveryTime = 0

  data.forEach(record => {
    if((record.status === true && !record.failed_at) || record.recoverTime === undefined) {
      return
    }

    totalFailedRecords++
    totalRecoveryTime += record.recoverTime
  })

  return totalRecoveryTime / (totalFailedRecords === 0 ? 1 : totalFailedRecords)
}

const calculateRTColor = (rate: number) : string => {
  if(rate < 1 ) {
    return greenFilter
  } else if(rate < 24) {
    return yellowFilter
  } else if(rate < 24 * 7) {
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

  const [data, setData] = useState<Record[]>([])

  const [loading, setLoading] = useState<boolean>(true)
  
  const [showDFPO, setShowDFPO] = useState(false)
  const [showRTPO, setShowRTPO] = useState(false)
  const [showCFRPO, setShowCFRPO] = useState(false)
  const [showCLTPO, setShowCLTPO] = useState(false)

  const organizeData = (data: Record[]) => {
    setData(data)

    const dfRate = calculateDFRate(props, data)
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

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    fetchData(props, organizeData)
  }, [props])

  if(loading) {
      return (
          <div data-testid="ScoreBoard" style={{width: "100%", height: "100%"}}>
              <Loading enabled={loading} />
          </div>
      )
  }

  if(data.length === 0) {
      return ( 
        <div data-testid="ScoreBoard" style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
          <img alt="No Data" title="No Data" src={noData} style={{width: "150px"}}/>
        </div>
      )
  }

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

export default ScoreBoard

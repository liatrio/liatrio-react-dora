import React from 'react'
import { Props } from '../Helpers'
import './ScoreBoard.css'

const ScoreBoard : React.FC<Props> = (props: Props) => {
    return (
        <div data-testid="ScoreBoard" className="board">
          <div className="icon_container">
            <img className="surround" alt="Deployment Frequency" title="Deployment Frequency" src="/images/change_dark.svg" style={{filter: "brightness(0) saturate(100%) invert(45%) sepia(250%) saturate(500%) hue-rotate(-15deg) brightness(100%) contrast(120%)"}} />
            <img className="icon" alt="Deployment Frequency" title="Deployment Frequency" src="/images/deploy_dark.svg" style={{width: "30%", left: "33px", top: "33px"}}/>
          </div>
          <div className="icon_container">
            <img className="surround" alt="Change Lead Time" title="Change Lead Time" src="/images/change_dark.svg" style={{filter: "brightness(0) saturate(100%) invert(36%) sepia(86%) saturate(7496%) hue-rotate(356deg) brightness(101%) contrast(102%)"}} />
            <img className="icon" alt="Change Lead Time" title="Change Lead Time" src="/images/lead_time_dark.svg" style={{left: "31px", top: "32px"}}/>
          </div>
          <div className="icon_container">
            <img className="surround" alt="Change Failure Rate" title="Change Failure Rate" src="/images/change_dark.svg" style={{filter: "brightness(0) saturate(100%) invert(60%) sepia(75%) saturate(4083%) hue-rotate(73deg) brightness(92%) contrast(92%)"}} />
            <img className="icon" alt="Change Failure Rate" title="Change Failure Rate" src="/images/failure_dark.svg" style={{left: "34px", top: "32px"}}/>
          </div>
          <div className="icon_container">
            <img className="surround" alt="Recovery Rate" title="Recovery Rate" src="/images/change_dark.svg" style={{filter: "brightness(0) saturate(100%) invert(93%) sepia(74%) saturate(3024%) hue-rotate(1deg) brightness(102%) contrast(102%)"}} />
            <img className="icon" alt="Recovery Rate" title="Recovery Rate" src="/images/recover_dark.svg" style={{left: "33px", top: "34px"}}/>
          </div>
        </div>
    )
}

export default ScoreBoard


import React, { Children, ReactNode, useMemo } from 'react'

interface Props {
  children: ReactNode
  trend: string
}

const TrendIcon : React.FC<Props> = (props) => {
  return (<div style={{position: "relative", display: "flex", justifyContent: "center", alignItems: "center"}}>
  </div>)
}

export default TrendIcon

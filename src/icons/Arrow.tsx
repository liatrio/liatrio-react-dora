import React, { useMemo } from 'react'

interface Props {
  direction: "up" | "down"
  hexColor?: string
}

const ArrowIcon : React.FC<Props> = (props: Props) => {
  const color = useMemo(() => props.hexColor ? props.hexColor : '#000000', [props.hexColor])
  const rotation = props.direction === "up" ? 270 : 90

  return (
    <svg fill={color} transform={`rotate(${rotation})`} height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.027 512.027">
    <g>
      <g>
        <path d="M508.907,248.087L295.467,36.033c-4.16-4.053-10.987-4.053-15.04,0.107c-1.92,1.92-2.987,4.587-3.093,7.36v126.72H10.667
          C4.8,170.22,0,175.02,0,180.887V330.22c0,5.867,4.8,10.667,10.667,10.667h266.667v127.467c0,4.267,2.56,8.213,6.613,9.813
          c1.28,0.533,2.667,0.853,4.053,0.853c2.88,0,5.547-1.067,7.573-3.093l213.333-212.693
          C513.067,258.967,513.067,252.247,508.907,248.087z M298.667,443.073V330.22c0-5.867-4.8-10.667-10.667-10.667H21.333v-128H288
          c5.867,0,10.667-4.8,10.667-10.667V67.927l187.627,187.307L298.667,443.073z"/>
      </g>
    </g>
    </svg>
  )
}

export default ArrowIcon

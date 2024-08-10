import React from 'react';
import { DotProps } from 'recharts';

interface CustomDotProps extends DotProps {
  payload: any
  tooltipId: string
  mouseOver: (event: any, payload: any) => void
}

const CustomDot: React.FC<CustomDotProps> = ({ cx, cy, fill, payload, mouseOver, tooltipId }) => {
  const mOver = (e: any) => {
    if(mouseOver) {
      mouseOver(e, payload)
    }
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={8}
      fill={fill}
      stroke="none"
      onMouseOver={mOver}
      style={{ cursor: 'pointer' }}
      data-tooltip-id={tooltipId}
    />
  );
};

export default CustomDot;
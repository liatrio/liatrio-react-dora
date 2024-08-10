import React from 'react';
import { DotProps } from 'recharts';

interface CustomShapeProps extends DotProps {
  payload: any
  tooltipId: string
}

const CustomShape: React.FC<CustomShapeProps> = ({ cx, cy, fill, tooltipId }) => {

  return (
    <circle
      cx={cx}
      cy={cy}
      r={8}
      fill={fill}
      stroke="none"
      style={{ cursor: 'pointer' }}
      data-tooltip-id={tooltipId}
    />
  );
};

export default CustomShape;
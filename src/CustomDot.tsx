import React from 'react';
import { DotProps } from 'recharts';

interface CustomDotProps extends DotProps {
  payload: any
  onClick: (payload: any) => void
}

const CustomDot: React.FC<CustomDotProps> = ({ cx, cy, fill, payload, onClick }) => {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={8}
      fill={fill}
      stroke="none"
      onClick={() => onClick(payload)}
      style={{ cursor: 'pointer' }}
    />
  );
};

export default CustomDot;
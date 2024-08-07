import React from 'react';
import { RectangleProps } from 'recharts';

interface CustomBarProps extends RectangleProps {
  payload: any;
  onClick: (payload: any) => void;
}

const CustomBarShape: React.FC<CustomBarProps> = ({ x, y, width, height, payload, fill, onClick }) => {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      stroke="none"
      onClick={() => onClick(payload)}
      style={{ cursor: 'pointer' }}
    />
  );
};

export default CustomBarShape;

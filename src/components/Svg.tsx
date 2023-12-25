import React, { FC } from 'react';
import svgRegister from '../utils/svgRegister';
import { ISvg } from '../utils/svgRegister';

type Params = Omit<ISvg, 'icon'>;

export const Svg: FC<ISvg> = ({ icon, className, height, width, stroke, fill, onClick }) => {
  const params: Params = {};

  if (className) {
    params.className = className;
  }
  if (height) {
    params.height = height;
  }
  if (width) {
    params.width = width;
  }
  if (stroke) {
    params.stroke = stroke;
  }
  if (fill) {
    params.fill = fill;
  }

  const Component = svgRegister[`${icon}`];

  if (!Component) {
    return <div>No icon</div>;
  }

  return (
    <Component
      {...params}
      onClick={() => {
        if (onClick) {
          onClick();
        }
      }}
    />
  );
};

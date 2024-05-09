import React, { HTMLAttributes } from 'react';
import ConsecutiveCandles from './ConsecutiveCandles';

type TInstrument = 'consecutive candles';

const componentMap = {
  'consecutive candles': ConsecutiveCandles,
};

const InstrumentSpecifics = ({ instrument, ...props }: { instrument: TInstrument; props?: HTMLAttributes<HTMLElement> }) => {
  const ComponentToRender = componentMap[instrument];

  if (!ComponentToRender) {
    return <div>Select instrument</div>;
  }

  return <ComponentToRender {...props} />;
};

export default InstrumentSpecifics;

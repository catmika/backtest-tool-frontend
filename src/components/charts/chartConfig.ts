import * as d3 from 'd3';

const colorScheme = {
  primary: '#3498db',
  secondary: '#2ecc71',
  accent: '#e74c3c',
  neutral: '#95a5a6',
};

const colorScale = d3.scaleOrdinal(d3.schemeSet2);

export const chartConfig = {
  colors: colorScheme,
  colorScale: colorScale,
};

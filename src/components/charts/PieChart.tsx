import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import { chartConfig } from './chartConfig';
import { IStats } from '@/store/api/instruments.api';

export const PieChart = ({ data }: { data?: Record<string, IStats> }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const legendRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const drawChart = () => {
      if (data) {
        const containerWidth = ref.current?.parentElement?.offsetWidth || 400;
        const containerHeight = ref.current?.parentElement?.offsetHeight || containerWidth;
        const width = containerWidth; // Subtract some padding
        const height = containerHeight; // Subtract some padding
        const radius = Math.min(width, height) / 2;

        // Transform the data object into an array of objects with label and value properties
        const dataArray = Object.entries(data).map(([label, value]) => ({ label, value: value.percentage }));

        // Clear any previous SVG content
        d3.select(ref.current).selectAll('*').remove();
        d3.select(legendRef.current).selectAll('*').remove();

        // Create SVG container
        const svg = d3
          .select(ref.current)
          .append('svg')
          .attr('viewBox', `0 0 ${width} ${height}`)
          .attr('preserveAspectRatio', 'xMinYMin meet')
          .append('g')
          .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Create a pie generator
        const pie = d3.pie<{ label: string; value: number }>().value((d) => d.value);

        // Create an arc generator
        const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>().innerRadius(0).outerRadius(radius);

        // Create pie chart
        const arcs = svg.selectAll('arc').data(pie(dataArray)).enter().append('g').attr('class', 'arc');

        arcs
          .append('path')
          .attr('d', arc)
          .attr('fill', (d, i) => chartConfig.colorScale(i as any));

        arcs
          .append('text')
          .attr('transform', (d) => `translate(${arc.centroid(d)})`)
          .attr('text-anchor', 'middle')
          .text((d) => (d.data.value ? `${d.data.value}%` : ''))
          .style('font-size', `${Math.min(radius / 10, 20)}px`)
          .style('fill', '#fff');

        // Create legend
        const legend = d3.select(legendRef.current);

        dataArray.forEach((d, i) => {
          const legendItem = legend
            .append('div')
            .attr('class', 'legend-item')
            .style('display', 'flex')
            .style('align-items', 'center')
            .style('margin-bottom', '10px');

          legendItem
            .append('div')
            .style('width', '20px')
            .style('height', '20px')
            .style('background-color', chartConfig.colorScale(i as any))
            .style('margin-right', '8px');

          legendItem.append('span').text(d.label).style('font-size', '12px');
        });
      }
    };

    drawChart();

    window.addEventListener('resize', drawChart);

    return () => {
      window.removeEventListener('resize', drawChart);
    };
  }, [data, ref.current?.parentElement?.offsetWidth]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
      <svg ref={ref} style={{ height: '100%', width: '100%' }} />
      <div ref={legendRef} style={{ marginLeft: '50px', marginRight: 'auto' }}></div>
    </div>
  );
};

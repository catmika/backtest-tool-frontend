import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { chartConfig } from './chartConfig';
import { IStats } from '@/store/api/instruments.api';

export const BarChart = ({ data }: { data: Record<string, IStats> }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const legendRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const drawChart = () => {
      const containerWidth = ref.current?.parentElement?.offsetWidth || 400;
      const containerHeight = ref.current?.parentElement?.offsetHeight || 300;
      const margin = { top: 20, right: 20, bottom: 30, left: 40 };
      const width = containerWidth - margin.left - margin.right;
      const height = containerHeight - margin.top - margin.bottom;

      // Transform the data object into an array of objects with label and value properties
      const dataArray = Object.entries(data).map(([label, value]) => ({ label, value: value.percentage }));

      // Clear any previous SVG content
      d3.select(ref.current).selectAll('*').remove();
      d3.select(legendRef.current).selectAll('*').remove();

      // Create SVG container
      const svg = d3
        .select(ref.current)
        .append('svg')
        .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Create scales
      const x = d3.scaleBand().range([0, width]).padding(0.1);

      const y = d3.scaleLinear().range([height, 0]);

      x.domain(dataArray.map((d) => d.label));
      y.domain([0, d3.max(dataArray, (d) => d.value) || 0]);

      // Create and add the bars
      svg
        .selectAll('.bar')
        .data(dataArray)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', (d) => x(d.label) || 0)
        .attr('width', x.bandwidth())
        .attr('y', (d) => y(d.value))
        .attr('height', (d) => height - y(d.value))
        .attr('fill', (d, i) => chartConfig.colorScale(i as any));

      // Add the x-axis
      svg
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '.25em')
        .attr('dy', '1em')
        .attr('font-size', '14px');

      // Add the y-axis
      svg
        .append('g')
        .call(
          d3
            .axisLeft(y)
            .ticks(5)
            .tickFormat((d) => `${d}%`),
        )
        .attr('font-size', '14px');

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
      <div ref={legendRef} style={{ marginLeft: '20px', marginRight: 'auto' }}></div>
    </div>
  );
};

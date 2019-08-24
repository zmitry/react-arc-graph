import { scaleLinear } from 'd3-scale';
import { interpolateWarm, interpolateCool } from 'd3-scale-chromatic';

import { clamp } from 'lodash';
import React from 'react';

import {
  defaultPaddingFinderOptions,
  getEdgePaddings,
  getEdgeSides,
} from './normalizeGraph';
import { NodeLink, NodeLinkDefaultProps } from './NodeLink';

interface IEdge {
  from: number;
  to: number;
  order?: number;
}

export interface IEdgeInternal {
  from: number;
  to: number;
  fromIndex: number;
  toIndex: number;
  order?: number;
  side?: number;
  direction?: number;
  pad: number;
  index?: number;
}

const defaultProps = {
  width: 1200,
  height: 1200,
  padding: 20,
  scale: 20,
  paddingFinderOptions: defaultPaddingFinderOptions,
  nodeLinkProps: NodeLinkDefaultProps,
};

type IDefaultPropsType = typeof defaultProps;

interface IArcGraphProps extends IDefaultPropsType {
  edges: IEdge[];
}

export class ArcGraph extends React.Component<IArcGraphProps> {
  static defaultProps = defaultProps;
  render() {
    const {
      edges: data = [],
      width,
      height,
      padding,
      scale,
      paddingFinderOptions,
      nodeLinkProps,
    } = this.props;

    const nodes = [...new Set(data.flatMap(el => [el.from, el.to]))].sort(
      (a, b) => a - b
    );

    const edges: IEdgeInternal[] = data.map((el, index) => {
      const oFromIndex = nodes.indexOf(el.from);
      const oToIndex = nodes.indexOf(el.to);

      const [fromIndex, toIndex] = [oFromIndex, oToIndex].sort((a, b) => a - b);

      return {
        ...el,
        index,
        fromIndex,
        toIndex,
        direction: clamp(oFromIndex - oToIndex, -1, 1),
        pad: Math.abs(toIndex - fromIndex) - 1,
        side: 1,
      };
    });
    const sides = getEdgeSides(edges);
    sides.forEach((el, k) => {
      edges[k].side = el;
    });
    const paddings = getEdgePaddings(edges, paddingFinderOptions);
    paddings.forEach((el, k) => {
      edges[k].pad = el;
    });
    const size = edges.length;
    const intr = scaleLinear()
      .domain([0, size])
      .range([padding, scale * size + padding]);
    const colorInterpolate = n => {
      let k =
        n % 2 === 0 ? interpolateWarm(n / size) : interpolateCool(n / size);

      return k;
    };
    return (
      <svg width={width} height={height} viewBox="0 0 100 400">
        <defs>
          <marker
            id="arrow"
            viewBox="-5 -5 15 15"
            refX="3"
            refY="4"
            markerUnits="strokeWidth"
            markerWidth="4"
            markerHeight="4"
            orient="auto"
          >
            <path
              d="M -5 -2 L 10 4 L -5 10"
              fill="red"
              stroke="red"
              strokeWidth="1"
            />
          </marker>
          {edges.map(edge => (
            <linearGradient
              key={edge.index}
              id={'linear' + edge.index}
              x1="0"
              x2="0"
              y1="0"
              y2="1"
            >
              <stop offset="0%" stopColor={colorInterpolate(edge.fromIndex)} />
              <stop offset="100%" stopColor={colorInterpolate(edge.toIndex)} />
            </linearGradient>
          ))}
        </defs>
        {edges.map((el, i) => {
          return (
            <NodeLink
              edge={el}
              key={i}
              scaleY={intr}
              interpolateColor={colorInterpolate}
              {...nodeLinkProps}
            />
          );
        })}
        {nodes.map((_el, i) => {
          const color = colorInterpolate(i);
          return (
            <g key={i}>
              <circle cx={padding} fill={color} cy={intr(i)} r={3} />
            </g>
          );
        })}
      </svg>
    );
  }
}

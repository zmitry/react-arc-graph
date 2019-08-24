import { line as lineGenerator, curveMonotoneY } from 'd3-shape';
import { ScaleLinear } from 'd3-scale';
import React from 'react';

import { IEdgeInternal } from './ListViewGraph';

const line = lineGenerator().curve(curveMonotoneY);
function linePath({ x, y, h, w, z = w, d = 1 }) {
  const x2 = w * d + x;
  const x3 = x2;
  const y2 = y + z;
  const y3 = Math.max(h - z, y2);
  return line([[x, y], [x2, y + z], [x3, y3], [x, h]]);
}
function linePathSimple({ x, y, h }) {
  // hack for svg to draw gradient
  return line([[x, y], [x + 0.000001, h]]);
}

export interface INodeLinkProps {
  scaleY: ScaleLinear<number, number>;
  edge: IEdgeInternal;
  interpolateColor: (t: number) => string;
}

export const NodeLinkDefaultProps = {
  // angle factor for nodes near to center
  angleFactor: 6,
  // basic angle
  angleBasic: 15,
  // scale for links
  // bigger value -> bigger distance between links
  padScale: 5,
  // maximum row unit for padding
  maxPad: 6,
  // if nodes are on the limit make some space between them to prevent being on the same line
  padLimitDiffFactor: 3,
  strokeWidth: 2,
};

export function NodeLink({
  edge,
  scaleY,
  angleBasic,
  angleFactor,
  padScale,
  maxPad,
  padLimitDiffFactor,
}: INodeLinkProps & typeof NodeLinkDefaultProps) {
  const diff = Math.abs(edge.toIndex - edge.fromIndex);
  const padAvailable = Math.min(edge.pad, maxPad);
  const padDiff = edge.pad - padAvailable;
  const pathObj = {
    x: scaleY(0),
    y: scaleY(Math.min(edge.fromIndex, edge.toIndex)),
    h: scaleY(Math.max(edge.fromIndex, edge.toIndex)),
    w: padAvailable * padScale + padDiff * padLimitDiffFactor,
    d: edge.side,
    z: angleBasic + angleFactor / edge.pad,
  };
  let d;
  if (diff !== 1) {
    d = linePath(pathObj);
  } else {
    d = linePathSimple(pathObj);
  }
  return (
    <path
      data-id={edge.index}
      key={edge.index}
      fill="none"
      strokeWidth={1}
      pathLength={100}
      strokeDasharray={100}
      d={d}
      stroke={`url(#linear${edge.index})`}
    />
  );
}

NodeLink.defaultProps = NodeLinkDefaultProps;

import { range } from 'lodash';

import { IEdgeInternal } from './ListViewGraph';

export function getEdgeSides(edges: IEdgeInternal[]) {
  // make kv map for edges value is nodes indexes and values in array of edges which cross this coordinates
  // for e.g we have something like this
  // where short nodes are 1 and to respectively and long node is 3
  // and nodes are 1 2 3 respectively
  // * - * - *
  //  \_____/
  // in result we will have map like this
  // 1 -> [1,3]
  // 2 -> [2,3]
  const kvMap = edges.reduce<Map<number, IEdgeInternal[]>>((acc, el) => {
    if (Math.abs(el.toIndex - el.fromIndex) === 1) {
      return acc;
    }
    for (let i = el.fromIndex; i < el.toIndex; i++) {
      const v = acc.get(i) || [];
      acc.set(i, [...v, el]);
    }
    return acc;
  }, new Map());

  // map where key is index of edge in array and value is side which you need to set
  const itemsToSet = [...kvMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .reduce<Map<number, number>>((acc, [__, lineEdges]) => {
      // compute edges which are already on the left side
      const leftEdges = lineEdges.filter(el => acc.get(el.index) === -1);
      let diff = Math.ceil((lineEdges.length - leftEdges.length) / 2);
      for (const edge of lineEdges) {
        const index = edge.index;
        if (acc.get(index) === undefined) {
          // set left direction until it's half of all edges on this space
          const side = edge.index % 2 === 1 && diff > 0 ? -1 : 1;
          acc.set(index, side);

          if (side === -1) {
            diff--;
          }
        }
      }
      return acc;
    }, new Map());

  return itemsToSet;
}

export interface IPaddingFinderOptions {
  defaultPad?: number;
  padStep?: number;
  allowOneSepIntersections?: boolean;
}

export const defaultPaddingFinderOptions: IPaddingFinderOptions = {
  defaultPad: 1,
  padStep: 1,
  // if true we will allow to be element like this on the same lvl
  // * - * - * - *
  //  \___\_/___/
  // if false it will be like this
  // * - * - * - *
  //  \___\_/   /
  //       \___/
  allowOneSepIntersections: false,
};

// computes padding between graph center and edge
export function getEdgePaddings(
  edges: IEdgeInternal[],
  options = defaultPaddingFinderOptions
) {
  const { defaultPad, padStep, allowOneSepIntersections } = Object.assign(
    {},
    defaultPaddingFinderOptions,
    options
  );

  const kvMap = new Map<string, number>();
  // dont care about 1 length edges
  const filtered = edges
    .filter(el => el.pad !== 0)
    .sort((a, b) => a.pad - b.pad);
  // key is edge index and value is padding to set
  const result = new Map<number, number>();
  filtered.forEach(el => {
    // find max padding through all intersected edges
    /* tslint:disable */
    let [a, b] = [el.fromIndex, el.toIndex].sort((a, b) => a - b);
    /* tslint:enable */
    if (allowOneSepIntersections) {
      a += 1;
    }
    const ranges = range(a, b).map(i => {
      const k = i + ':' + el.side;
      return kvMap.get(k) || defaultPad;
    });
    const maxPad = ranges.length > 0 ? Math.max(...ranges) : defaultPad;

    const nextPad = maxPad + padStep;
    let startIndex = el.fromIndex;
    let endIndex = el.toIndex;
    if (allowOneSepIntersections) {
      startIndex += 1;
      endIndex -= 1;
    }

    // delete that padding from all intersected
    for (let i = startIndex; i <= endIndex; i++) {
      const k = i + ':' + el.side;
      kvMap.set(k, nextPad);
    }
    result.set(el.index, nextPad);
  });
  return result;
}

import { data1, data2, paddingMockData, paddingMockData2 } from './fixtures';
import { getEdgePaddings, getEdgeSides } from './normalizeGraph';
import { nodesFromEdges } from './utils';
const toNodePrefix = '__to';
const fromNodePrefix = '__from';

export const createFakeFromToNodes = (nodes: any[]): any[] => {
  return nodes.reduce(
    (acc, node) =>
      acc.concat([
        { ...node, fakeId: node.id + toNodePrefix },
        { ...node, fakeId: node.id + fromNodePrefix },
      ]),
    []
  );
};

const mapEdges = edges => edges;

export const createFakeNodesIds = nodes => nodes.map(node => node.fakeId);

const createNodesIds = edges =>
  createFakeNodesIds(createFakeFromToNodes(nodesFromEdges(edges)));

describe('ArcGraph', () => {
  it('finds sides', () => {
    const edges = mapEdges({
      edges: data1,
      nodeIDs: createNodesIds(data1),
      defaultSide: 'auto',
    });

    const mapping = getEdgeSides(edges);
    expect(mapping).toMatchSnapshot();
    const edges2 = mapEdges({
      edges: data2,
      nodeIDs: createNodesIds(data2),
      defaultSide: 'auto',
    });
    const mapping2 = getEdgeSides(edges2);
    expect(mapping2).toMatchSnapshot();
  });

  it('it finds padding ', () => {
    const mapping = getEdgePaddings(paddingMockData as any, {
      defaultPad: 0,
      padStep: 1,
    });
    expect(mapping).toMatchInlineSnapshot(`
Map {
  1 => 1,
  3 => 2,
  2 => 3,
}
`);
    const mapping2 = getEdgePaddings(paddingMockData as any, {
      allowOneSepIntersections: true,
      defaultPad: 0,
      padStep: 1,
    });

    expect(mapping2).toMatchInlineSnapshot(`
Map {
  1 => 1,
  3 => 1,
  2 => 1,
}
`);

    const mapping3 = getEdgePaddings(paddingMockData2 as any, {
      allowOneSepIntersections: true,
      defaultPad: 0,
      padStep: 1,
    });
    expect(mapping3.size).toBe(0);
  });
});

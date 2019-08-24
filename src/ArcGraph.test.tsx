// import React from 'react';
// import { data1, data2 } from './fixtures';
// import { computeGraphData, ArcGraph } from './ArcGraph';
// import { NodeLink } from './NodeLink';
// import { defaultPaddingFinderOptions } from './normalizeGraph';
// import { nodesFromEdges } from './utils';

// xdescribe('ArcGraph', () => {
//   it('computes correct data with memoization', () => {
//     const params = {
//       edges: data2,
//       nodes: nodesFromEdges(data2),
//     };
//     const mappedData = computeGraphData({
//       ...params,
//       paddingFinderOptions: defaultPaddingFinderOptions,
//       defaultSide: 'auto',
//     });
//     expect(mappedData).toMatchSnapshot();
//     const mappedData2 = computeGraphData({
//       ...params,
//       paddingFinderOptions: defaultPaddingFinderOptions,
//       defaultSide: 'auto',
//     });
//     expect(mappedData2).toBe(mappedData);
//   });

//   it('renders data without errors', () => {
//     const ref = mount(
//       <ArcGraph
//         edges={data1}
//         nodes={nodesFromEdges(data1)}
//         buildInterpolators={() => ({
//           interpolateY: () => 10,
//         })}
//       />
//     );
//     const linksSize = ref.find(NodeLink).getElements().length;
//     expect(linksSize).toBe(5);
//     const nodesSize = ref.find('circle').getElements().length;
//     expect(nodesSize).toBe(10);
//   });
// });

export default undefined;

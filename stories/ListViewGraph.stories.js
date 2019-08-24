import React from 'react';
import { storiesOf } from '@storybook/react';
import { ListViewGraph } from '../src/ListViewGraph';
import { nodesFromEdges } from '../src/utils';
function Wrapper({ children }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
}

const data = [
  ['1', '2'],
  ['1', '5'],

  ['2', '4'],

  ['3', '6'],
  ['3', '8'],

  ['5', '8'],

  ['6', '8'],
  ['7', '8'],
  ['9', '10'],
  ['9', '11'],
].map(el => ({ from: el[0], to: el[1] }));

storiesOf('Arc graph', module)
  .add('basic', () => (
    <Wrapper>
      <ListViewGraph
        edges={data}
        nodes={nodesFromEdges(data)}
        buildInterpolators={() => ({
          interpolateY: () => 10,
        })}
      />
    </Wrapper>
  ))
  .add('ui variations', () => (
    <Wrapper>
      <ListViewGraph
        edges={data}
        nodeLinkProps={{
          // basic angle
          angleBasic: 20,
          // scale for links
          // bigger value -> bigger distance between links
          padScale: 3,
          // maximum row unit for padding
          maxPad: 5,
          // if nodes are on the limit make some space between them to prevent being on the same line
          padLimitDiffFactor: 3,
        }}
      />
      <ListViewGraph
        edges={data}
        nodeLinkProps={{
          angleFactor: 10,
          // basic angle
          angleBasic: 10,
          // scale for links
          // bigger value -> bigger distance between links
          padScale: 8,
          // maximum row unit for padding
          maxPad: 5,
          // if nodes are on the limit make some space between them to prevent being on the same line
          padLimitDiffFactor: 3,
        }}
      />
      <ListViewGraph
        edges={data}
        paddingFinderOptions={{
          defaultPad: 1,
          padStep: 1,
          allowOneSepIntersections: false,
        }}
        nodeLinkProps={{
          angleFactor: 1,
          // basic angle
          angleBasic: 2,
          // scale for links
          // bigger value -> bigger distance between links
          padScale: 3,
          // maximum row unit for padding
          maxPad: 5,
          // if nodes are on the limit make some space between them to prevent being on the same line
          padLimitDiffFactor: 3,
        }}
      />
      <ListViewGraph
        edges={data}
        paddingFinderOptions={{
          defaultPad: 2,
          padStep: 1,
          allowOneSepIntersections: false,
        }}
        nodeLinkProps={{
          angleFactor: 32,
          // basic angle
          angleBasic: 3,
          // scale for links
          // bigger value -> bigger distance between links
          padScale: 4,
          // maximum row unit for padding
          maxPad: 6,
          // if nodes are on the limit make some space between them to prevent being on the same line
          padLimitDiffFactor: 3,
        }}
      />
    </Wrapper>
  ));

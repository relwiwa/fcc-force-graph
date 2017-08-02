/*  Force Directed Graph, adapted from:
    - http://bl.ocks.org/sathomas/11550728
    - https://medium.com/ninjaconcept/interactive-dynamic-force-directed-graphs-with-d3-da720c6d7811 */

import React from 'react';
import ReactDOM from 'react-dom';

import ForceGraph from './force-graph';

import contiguityData from '../data/contiguity-data.json';

const NationalContiguityGraph = (props) => {
  return (
    <div className="grid-container grid-container-padded">
      <div className="national-contiguity-graph row">
        <div className="text-center cell">
          <h1>National Contiguity Graph</h1>
          <p>This graph shows border relationships between countries. It tries to display as many of the maps without overlaps as possible.</p>
            <ForceGraph
              links={contiguityData.links}
              nodes={contiguityData.nodes}
            />
        </div>
      </div>
    </div>
  );
};

export default NationalContiguityGraph;

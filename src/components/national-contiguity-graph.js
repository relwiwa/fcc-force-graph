/*  Force Directed Graph, adapted from:
    - http://bl.ocks.org/sathomas/11550728
    - https://medium.com/ninjaconcept/interactive-dynamic-force-directed-graphs-with-d3-da720c6d7811 */

import React from 'react';
import ReactDOM from 'react-dom';

import ForceGraph from './force-graph';

import contiguityData from '../data/contiguity-data.json';

const NationalContiguityGraph = (props) => {
  return (
    <div className="national-contiguity-graph row">
      <div className="column small-12">
        <h1 className="text-center">National Contiguity Graph</h1>
          <ForceGraph
            links={contiguityData.links}
            nodes={contiguityData.nodes}
          />
      </div>
    </div>
  );
};

export default NationalContiguityGraph;

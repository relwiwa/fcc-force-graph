/*  Force Directed Graph, adapted from:
    - http://bl.ocks.org/sathomas/11550728 */

import React, { Component } from 'react';

import ForceGraph from './force-graph';

import contiguityData from '../data/contiguity-data.json';

class NationalContiguityGraph extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="national-contiguity-graph row">
        <h1 className="text-center">National Contiguity</h1>
        <ForceGraph />
      </div>
    );
  }
};

export default NationalContiguityGraph;

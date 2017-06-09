/*  Force Directed Graph, adapted from:
    - http://bl.ocks.org/sathomas/11550728
    - https://medium.com/ninjaconcept/interactive-dynamic-force-directed-graphs-with-d3-da720c6d7811 */

import React, { Component } from 'react';

import ForceGraph from './force-graph';

import contiguityData from '../data/contiguity-data.json';
import SPEX from '../data/national-contiguity-graph.spex';

const chartMargins = { top: 50, right: 30, bottom: 30, left: 30 };

class NationalContiguityGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartWidth: null
    }
  }

  componentDidMount() {
    this.calculateWidth();    
  }

  calculateWidth() {
    this.setState({
      chartWidth: this.graphContainer.getBoundingClientRect().width
    });
  }

  render() {
    const { chartWidth } = this.state;

    return (
      <div ref={(el) => { this.graphContainer = el }} className="national-contiguity-graph row">
        <h1 className="text-center">National Contiguity</h1>
        {chartWidth && <ForceGraph
          links={contiguityData.links}
          nodes={contiguityData.nodes}
          chartWidth={chartWidth}
          chartHeight={chartWidth * SPEX.chart.ratioFactor}
          chartMargins={chartMargins}
        />}
      </div>
    );
  }
};

export default NationalContiguityGraph;

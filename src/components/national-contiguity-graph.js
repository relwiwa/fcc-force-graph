/*  Force Directed Graph, adapted from:
    - http://bl.ocks.org/sathomas/11550728
    - https://medium.com/ninjaconcept/interactive-dynamic-force-directed-graphs-with-d3-da720c6d7811 */

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ForceGraph from './force-graph';

import contiguityData from '../data/contiguity-data.json';
import SPEX from '../data/national-contiguity-graph.spex';

class NationalContiguityGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartHeight: null,
      chartWidth: null
    }

    this.calculateDimensions = this.calculateDimensions.bind(this);
  }

  componentDidMount() {
    this.calculateDimensions();
    addEventListener('resize', this.calculateDimensions)
  }

  componentWillUnmount() {
    removeEventListener('resize', this.calculateDimensions);
  }

  /* Calculate dimensions for initial display and when resizing 
      - Foundation's column container that is referenced, has padding that needs to be subtracted from width
      - Set horizontal or vertical layout  */
  calculateDimensions() {
    const { breakpoints, ratioFactorHorizontal, ratioFactorVertical } = SPEX.chart;
    const containerWidth = this.getContainerWidth();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Vertical alignment
    if (windowHeight >= windowWidth && windowHeight - windowWidth > 100) {
      let ratioFactorSelector;

      if (containerWidth < breakpoints.small) {
        ratioFactorSelector = 'small'
      }
      else if (containerWidth < breakpoints.medium) {
        ratioFactorSelector = 'medium';
      }
      else {
        ratioFactorSelector = 'large';
      }
      this.setState({
        chartHeight: containerWidth * ratioFactorVertical[ratioFactorSelector],
        chartWidth: containerWidth,
      });
    }
    // Horizontal alignment
    else {
      this.setState({
        chartHeight: containerWidth * ratioFactorHorizontal,
        chartWidth: containerWidth,
      });      
    }
  }

  getContainerWidth() {
    const containerComputedStyles = getComputedStyle(this.graphContainer);
    const containerDimensions = {
      height: containerComputedStyles['height'],
      width: containerComputedStyles['width'],
      paddingLeft: containerComputedStyles['padding-left'],
      paddingRight: containerComputedStyles['padding-right']
    }

    // get rid of 'px'
    for (let property in containerDimensions) {
      containerDimensions[property] = containerDimensions[property].substr(0, containerDimensions[property].length - 2);
    }
    let { height, paddingLeft, paddingRight, width } = containerDimensions;
    width = width - paddingLeft - paddingRight;
    return width;    
  }

  render() {
    const { chartHeight, chartWidth } = this.state;

    return (
      <div ref={(outer) => { this.outer = outer }}  className="national-contiguity-graph row">
        <div ref={(el) => { this.graphContainer = el }} className="column small-12">
          <h1 className="text-center">National Contiguity</h1>
          {chartWidth && <ForceGraph
            links={contiguityData.links}
            nodes={contiguityData.nodes}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
          />}
        </div>
      </div>
    );
  }
};

export default NationalContiguityGraph;

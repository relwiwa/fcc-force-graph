import React, { Component } from 'react';
import { forceCenter, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';

import ForceGraphFlag from './force-graph-flag';
import ForceGraphLink from './force-graph-link';
import ForceGraphTooltip from './force-graph-tooltip';

import SPEX from '../data/national-contiguity-graph.spex';

class ForceGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartHeight: null,
      chartWidth: null,
      currNode: null,
      dimensionsCount: 0,
      links: null,
      nodes: null,
      simulationStatus: SPEX.simulation.stati.notStarted,
      tickCount: 0,
    }

    this.handleResize = this.handleResize.bind(this);
  }

  /* Lifecycle Methods
  /////////////////////*/

  componentDidMount() {
    this.calculateDimensions();
  }

  /* Don't render every tick */
  shouldComponentUpdate() {
    const { simulationStatus, tickCount } = this.state;
    const { stati, updateFactor } = SPEX.simulation;

    if (simulationStatus === stati.calculationOngoing) {
      if (tickCount % updateFactor === 0) {
        return true;
      }
      else {
        return false;
      }
    }
    return true;
  }

  /*  Handling resize problematic in relation to svg height/display of scrollbar:
      - There was the following problem:
        - chartWidth + chartHeight were calculated in parent component when svg was not yet displayed
        - when svg got displayed and a scrollbar was displayed too, the initial calucation was wrong as
          it did not take the widht of the scrollbar into account; later calculations triggered by
          resize event were calculated correctly
      - To solve this problem, dimensionCount state variable is used to ensure, that the force graph
        will only start its calculation after two render cycles:
        - During the first render cycle, svg dimensions get calculated and svg displays
        - During the second render cycle, scrollbar is displayed or not and is taken into account when
          calculating the dimensions
        - In the next render cycle, simulation gets started
      - Apart from that, a timeout is set, that will start the simulation and restart it after 
      - After simulation was stopped due to resize, new dimensions will be
        received
      - A timeout is set, which will start the simulation (from the beginning) */
  componentDidUpdate(prevProps, prevState) {
    const { dimensionsCount, simulationStatus } = this.state;
    const { restartTimeout, stati } = SPEX.simulation;

    if (simulationStatus === stati.stopped) {
      if (this.restartTimeout !== undefined) {
        clearTimeout(this.restartTimeout);
      }
      this.restartTimeout = setTimeout(() => {
        this.startSimulation()
        this.setState({
          simulationStatus: stati.ongoing
        })
      }, restartTimeout);
    }
    else if (simulationStatus === stati.notStarted && dimensionsCount === 1) {
      this.calculateDimensions();
      addEventListener('resize', this.handleResize)
    }
    else if (simulationStatus === stati.notStarted && dimensionsCount === 2) {
      this.startSimulation();
    }
  }

  componentWillUnmount() {
    this.stopSimulation();
    removeEventListener('resize', this.handleResize);
  }


  /* Dimensions handling
  ***********************/

  /* Calculate dimensions for SVG container element and determine orientation */
  calculateDimensions() {
    const { dimensionsCount } = this.state;
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
        dimensionsCount: dimensionsCount + 1
      });
    }
    // Horizontal alignment
    else {
      this.setState({
        chartHeight: containerWidth * ratioFactorHorizontal,
        chartWidth: containerWidth,
        dimensionsCount: dimensionsCount + 1
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


  /*  Handler Functions
  //////////////////////*/

  handleResize() {
    this.stopSimulation();
    this.calculateDimensions();
  }

  handleSimulationEnded() {
    removeEventListener('tick', this.simulation);
    removeEventListener('end', this.simulation);
    this.setState({
      simulationStatus: SPEX.simulation.stati.calculationEnded
    });
  }

  handleSimulationTick(links, nodes, width, height, radius) {
    const { tickCount } = this.state;

    /*  Keep nodes within SVG boundaries, adapted from:
        https://bl.ocks.org/mbostock/1129492 */
    let nodesToUse = [...nodes];
    let linksToUse = [...links];
    nodesToUse.map((node) => {
      // 25/15 are the flag images width/height
      node.x = Math.max(25, Math.min(width - 25, node.x))
      node.y = Math.max(15, Math.min(height - 15, node.y))
    });

    linksToUse.map((link) => {
      link.x1 = link.source.x;
      link.y1 = link.source.y;
      link.x2 = link.target.x;
      link.y2 = link.target.y;
    });
    
    this.setState({
      nodes: nodesToUse,
      links: linksToUse,
      tickCount: tickCount + 1
    });
  }

  startSimulation() {
    const { links, nodes } = this.props;
    const { chartWidth, chartHeight } = this.state;
    const { forceCharge, stati } = SPEX.simulation;

    /* Create new objects to prevent state mutations
       unsure, whether its working or what exactly happens
       within the tick callback :-( */
    this.nodes = [...nodes];
    this.links = [...links];

    this.simulation = forceSimulation(this.nodes)
      .force('charge', forceManyBody()
        .strength(forceCharge.strength)
        .distanceMin(forceCharge.distanceMin)
        .distanceMax(forceCharge.distanceMax)
      )
      .force('center', forceCenter(chartWidth / 2, chartHeight / 2))
      .force('link', forceLink())

    this.simulation.force('link').links(this.links);

    this.simulation.on('tick', () => this.handleSimulationTick(this.links, this.nodes, chartWidth, chartHeight));
    this.simulation.on('end', () => this.handleSimulationEnded());

    this.setState({
      simulationStatus: stati.calculationOngoing
    });
  }

  stopSimulation() {
    this.simulation.stop();
    removeEventListener('tick', this.simulation);
    removeEventListener('end', this.simulation);
    this.setState({
      currNode: null,
      links: null,
      nodes: null,
      simulationStatus: SPEX.simulation.stati.stopped,
      tickCount: 0,
    });
  }

  render() {
    const { chartHeight, chartWidth } = this.state;
    const { currNode, links, nodes, simulationStatus, tickCount } = this.state;
    const { stati } = SPEX.simulation

    const showGraph = (simulationStatus !== stati.notStarted
      && simulationStatus !== stati.stopped
      && tickCount > 1)
      ? true
      : false;

     return (
      <div
        ref={(el) => this.graphContainer = el}
        className="force-graph text-center"
        style={{height:'100%', marginBottom: '20px', position: 'relative', width: '100%'}}>
        <svg
          style={{height: chartHeight, width: '100%'}}
        >
          {showGraph && <g>
            {links.map((link) => {
              return (
                <ForceGraphLink
                  key={link.index}
                  source={link.source}
                  target={link.target}
                />
              )
            })}
          </g>}
        </svg>
        <div style={{height: '100%', left: 0, position:'absolute', top: 0, width: '100%'}}>
          {showGraph && nodes.map((node) => {
            return (
              <ForceGraphFlag
                key={node.code}
                nodeData={node}
                onMouseEnter={(node) => this.setState({ currNode: node })}
                onMouseLeave={() => this.setState({ currNode: null })}
              />
            )})
          }
          {currNode !== null && <ForceGraphTooltip
            chartWidth={chartWidth}
            currNode={currNode}
          />}
        </div>
      </div>
    );
  }
}

export default ForceGraph;

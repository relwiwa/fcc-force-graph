import React, { Component } from 'react';
import { forceCenter, forceLink, forceManyBody, forceSimulation, forceX, forceY } from 'd3-force';

import ForceGraphFlag from './force-graph-flag';
import ForceGraphLink from './force-graph-link';
import ForceGraphNode from './force-graph-node';

import SPEX from '../data/national-contiguity-graph.spex';

class ForceGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      simulationStatus: SPEX.simulation.stati.notStarted,
      tickCount: 0,
    }
  }

  /* Lifecycle Methods
  /////////////////////*/

  componentDidMount() {
    this.startSimulation();    
  }

  /*  Resize handling:
      - When resize happend/is happening, simulation will be stopped
      - Event Listeners get removed
      - When new dimensions are received via props, simulation gets
        started new via componentDidUpdate */
  componentWillReceiveProps(nextProps) {
    this.stopSimulation();
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

  /*  Resize handling:
      - After simulation was stopped due to resize, new dimensions will be
        received
      - A timeout is set, which will start the simulation (from the beginning) */
  componentDidUpdate(prevProps, prevState) {
    const { simulationStatus } = this.state;
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
  }

  componentWillUnmount() {
    this.stopSimulation();
  }

  /*  Handler Munctions
  //////////////////////*/

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
      // 16/10 are the flag images width/height
      node.x = Math.max(16, Math.min(width - 16, node.x))
      node.y = Math.max(10, Math.min(height - 10, node.y))
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
    const { chartWidth, chartHeight, links, nodes } = this.props;
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
      links: null,
      nodes: null,
      simulationStatus: SPEX.simulation.stati.stopped,
      tickCount: 0,
    });
  }

  render() {
    const { chartHeight, chartWidth } = this.props;
    const { links, nodes, simulationStatus, tickCount } = this.state;
    const { stati } = SPEX.simulation

    const showGraph = (simulationStatus !== stati.notStarted
      && simulationStatus !== stati.stopped
      && tickCount > 1)
      ? true
      : false;

     return (
      <div className="force-graph text-center" style={{position: 'relative', height:chartHeight, width: chartWidth}}>
        <svg
          style={{position: 'absolute', top: 0, left: 0, background: 'rgba(221, 221, 221, 0.5)', color: 'gray', boxShadow: '5px 5px 5px', width: '100%', height: '100%'}}
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
        <div style={{position:'absolute', top: 0, left: 0, right: 0, width: '100%', height: '100%'}}>
          {showGraph && nodes.map((node) => {
            return (
              <ForceGraphFlag
                key={node.code}
                nodeData={node}
              />
            )})
          }
        </div>
      </div>
    );
  }
}

export default ForceGraph;

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
      simulationEnded: false,
      nodes: null,
      links: null,
      tickCount: 0,
    }
  }

  componentWillMount() {
    this.setState({
      nodes: this.props.nodes,
      links: this.props.links,
    });
  }

  componentDidMount() {
    this.startSimulation();    
  }

  componentWillUnmount() {
    this.simulation.stop();
  }

  handleSimulationEnded() {
    this.setState({
      simulationEnded: true
    });
  }

  handleSimulationTick(links, nodes, width, height, radius) {
    const { tickCount } = this.state;

    /*  Keep nodes within SVG boundaries, adapted from:
        https://bl.ocks.org/mbostock/1129492 */
    nodes.map((node) => {
      /*  Probably, here state mutations are happening */
      node.x = Math.max(5, Math.min(width - 5, node.x))
      node.y = Math.max(5, Math.min(height - 5, node.y))
    });

    links.map((link) => {
      link.x1 = link.source.x;
      link.y1 = link.source.y;
      link.x2 = link.target.x;
      link.y2 = link.target.y;
    });
    
    this.setState({
      nodes: nodes,
      links: links,
      tickCount: tickCount + 1
    });
  }

  startSimulation() {
    const { links, nodes } = this.state;
    const { chartWidth, chartHeight } = this.props;

    /* create new objects to prevent state mutations
       unsure, whether its working or what exactly happens
       within the tick callback :-( */
    this.nodes = [...nodes];
    this.links = [...links];

    this.simulation = forceSimulation(this.nodes)
      .force('charge', forceManyBody()
        .strength(-1200)
        .distanceMin(30)
        .distanceMax(50)
      )
      .force('center', forceCenter(chartWidth / 2, chartHeight / 2))
      .force('link', forceLink())

      this.simulation.force('link').links(this.links);

      this.simulation.on('tick', () => this.handleSimulationTick(this.links, this.nodes, chartWidth, chartHeight));

      this.simulation.on('end', () => this.handleSimulationEnded());
  }

  shouldComponentUpdate() {
    const { tickCount } = this.state;

    if (tickCount % SPEX.simulation.updateFactor === 0) {
      return true;
    }
    else {
      return false;
    }
  }

  render() {
    const { chartHeight, chartMargins, chartWidth } = this.props;
    const { links, nodes, tickCount } = this.state;

     return (
      <div className="force-graph text-center" style={{position: 'relative'}}>
        <svg
          style={{background: 'lightblue'}}
          width={chartWidth + chartMargins.left + chartMargins.right}
          height={chartHeight + chartMargins.top + chartMargins.bottom}
        >
          {tickCount > 5 && <g>
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
          {tickCount > 5 &&<g>
            {nodes.map((node) => {
              return (
                <ForceGraphNode
                  key={node.code}
                  nodeData={node}
                />
              )
            })}
          </g>}
        </svg>
        {tickCount > 5 && nodes.map((node) => {
          return (
            <ForceGraphFlag
              key={node.code}
              nodeData={node}
              chartWidth={chartWidth}
              chartMargins={chartMargins}
            />
          )})
        }
      </div>
    );
  }
}

export default ForceGraph;

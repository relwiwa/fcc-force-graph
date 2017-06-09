import React from 'react';

const ForceGraphNode = (props) => {
  const { nodeData } = props;

  return (
    <circle
      className="force-graph-node"
      r={5}
      cx={nodeData.x}
      cy={nodeData.y}
      fill={'red'}
    >
    </circle>
  )
}

export default ForceGraphNode;

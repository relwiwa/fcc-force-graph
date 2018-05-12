import React from 'react';

const ForceGraphLink = (props) => {
  const { source, target } = props;

  return (
    <line
      className="force-graph-link"
      x1={source.x}
      y1={source.y}
      x2={target.x}
      y2={target.y}
      stroke='#1779ba'
      strokeWidth="0.5"
    />
  )
}

export default ForceGraphLink;
